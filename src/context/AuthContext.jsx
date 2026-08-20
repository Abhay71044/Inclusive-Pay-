import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { firebaseConfig, API_BASE_URL } from '../config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'inclusivepay_registered_users';

// Helper to sync Google / Verified user with MongoDB Atlas backend
const syncGoogleUserWithBackend = async (firebaseUser) => {
  const payload = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
    photoURL: firebaseUser.photoURL || ''
  };

  const urlsToTry = [
    `${API_BASE_URL}/api/auth/google-sync`,
    'http://localhost:5000/api/auth/google-sync'
  ];

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          return {
            displayName: data.user.fullName || payload.displayName,
            email: data.user.email,
            photoURL: data.user.profileImage || payload.photoURL,
            provider: 'google',
            mongoId: data.user.id,
            token: data.token
          };
        }
      }
    } catch (e) {
      // Retry next endpoint fallback
    }
  }

  // Local fallback if API is unreachable
  return {
    displayName: payload.displayName,
    email: payload.email,
    photoURL: payload.photoURL,
    provider: 'google'
  };
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('home'); // home, login, signup, dashboard, download-hub, profile

  useEffect(() => {
    // Restore session from localStorage if present
    const savedUser = localStorage.getItem('inclusivepay_active_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('inclusivepay_active_user');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Only restore session if email is verified or logged in with Google
        if (user.emailVerified || user.providerData.some(p => p.providerId === 'google.com')) {
          const userObj = await syncGoogleUserWithBackend(user);
          setCurrentUser(userObj);
          localStorage.setItem('inclusivepay_active_user', JSON.stringify(userObj));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync Google user with MongoDB Atlas backend
      const userObj = await syncGoogleUserWithBackend(user);

      setCurrentUser(userObj);
      localStorage.setItem('inclusivepay_active_user', JSON.stringify(userObj));
      setActiveView('home');
      return { success: true, user: userObj };
    } catch (error) {
      console.error("Google Auth error:", error);
      return { success: false, error: error.message };
    }
  };

  const registerLocal = async (fullName, email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      // 2. Set Display Name in Firebase
      if (fullName) {
        await updateProfile(fbUser, { displayName: fullName });
      }

      // 3. Send Verification Email to user's real email inbox
      await sendEmailVerification(fbUser);

      // 4. Sign out until email is verified
      await firebaseSignOut(auth);

      return {
        success: true,
        requiresVerification: true,
        message: `✉️ Account created! A verification email has been sent to ${cleanEmail}. Please open your inbox and click the link to verify before logging in.`
      };
    } catch (error) {
      let friendlyError = error.message;
      if (error.code === 'auth/email-already-in-use') {
        friendlyError = 'An account with this email address already exists.';
      } else if (error.code === 'auth/invalid-email') {
        friendlyError = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        friendlyError = 'Password must be at least 6 characters.';
      }
      return { success: false, error: friendlyError };
    }
  };

  const loginLocal = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Sign in with Firebase Email & Password
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      // 2. Check if email address is verified
      if (!fbUser.emailVerified) {
        await firebaseSignOut(auth);
        return {
          success: false,
          error: '✉️ Email address not verified yet! Please check your email inbox and click the verification link before logging in.'
        };
      }

      // 3. User is verified! Register / Sync in MongoDB Atlas
      const payload = {
        fullName: fbUser.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password
      };

      const urlsToTry = [
        `${API_BASE_URL}/api/auth/register`,
        'http://localhost:5000/api/auth/register',
        `${API_BASE_URL}/api/auth/login`,
        'http://localhost:5000/api/auth/login'
      ];

      let mongoUserObj = null;

      for (const url of urlsToTry) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await response.json();
          if (response.ok && data.success && data.user) {
            mongoUserObj = {
              displayName: data.user.fullName || fbUser.displayName || cleanEmail.split('@')[0],
              email: data.user.email,
              photoURL: data.user.profileImage || '',
              provider: 'local',
              mongoId: data.user.id,
              token: data.token
            };
            break;
          }
        } catch (e) {
          // Retry next fallback endpoint
        }
      }

      const activeUserObj = mongoUserObj || {
        displayName: fbUser.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        photoURL: '',
        provider: 'local'
      };

      setCurrentUser(activeUserObj);
      localStorage.setItem('inclusivepay_active_user', JSON.stringify(activeUserObj));
      setActiveView('home');

      return { success: true, user: activeUserObj };
    } catch (error) {
      let friendlyError = error.message;
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        friendlyError = 'Invalid email or password. Please try again.';
      }
      return { success: false, error: friendlyError };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Signout warning:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('inclusivepay_active_user');
    setActiveView('home');
  };

  const updateUserProfile = (newProps) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...newProps };
      localStorage.setItem('inclusivepay_active_user', JSON.stringify(updated));

      // Also update in registered list if local user
      if (prev.email) {
        const users = getRegisteredUsers();
        const idx = users.findIndex(u => u.email.toLowerCase() === prev.email.toLowerCase());
        if (idx >= 0) {
          users[idx].displayName = updated.displayName || users[idx].displayName;
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      }
      return updated;
    });
  };

  const switchView = (viewId) => {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeView,
        switchView,
        loginWithGoogle,
        registerLocal,
        loginLocal,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
