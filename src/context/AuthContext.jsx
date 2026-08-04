import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { firebaseConfig } from '../config';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'inclusivepay_registered_users';

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userObj = {
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          photoURL: user.photoURL || '',
          provider: 'google'
        };
        setCurrentUser(userObj);
        localStorage.setItem('inclusivepay_active_user', JSON.stringify(userObj));
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper to get all registered local users
  const getRegisteredUsers = () => {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  };

  // Helper to save a registered local user
  const saveRegisteredUser = (userObj) => {
    const users = getRegisteredUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === userObj.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = userObj;
    } else {
      users.push(userObj);
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userObj = {
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || '',
        provider: 'google'
      };
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

    // 1. Try Backend API Registration
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email: cleanEmail, password })
      });
      const data = await response.json();
      if (!response.ok) {
        // If backend returned error (e.g. duplicate email)
        if (data.message) {
          return { success: false, error: data.message };
        }
      }
    } catch (e) {
      console.warn("Backend registration API offline, using local client storage.");
    }

    // Check duplicate in local storage
    const users = getRegisteredUsers();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    // Register user
    const newUser = {
      displayName: fullName,
      email: cleanEmail,
      password: password,
      photoURL: '',
      provider: 'local'
    };
    saveRegisteredUser(newUser);

    const activeUserObj = {
      displayName: fullName,
      email: cleanEmail,
      photoURL: '',
      provider: 'local'
    };
    setCurrentUser(activeUserObj);
    localStorage.setItem('inclusivepay_active_user', JSON.stringify(activeUserObj));
    setActiveView('home');

    return { success: true, user: activeUserObj };
  };

  const loginLocal = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Express/MongoDB Backend Login
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const userObj = {
          displayName: data.user.fullName || cleanEmail.split('@')[0],
          email: data.user.email,
          photoURL: data.user.profileImage || '',
          provider: 'local'
        };
        setCurrentUser(userObj);
        localStorage.setItem('inclusivepay_active_user', JSON.stringify(userObj));
        setActiveView('home');
        return { success: true, user: userObj };
      } else if (response.status === 400 && data.message) {
        return { success: false, error: data.message };
      }
    } catch (e) {
      console.warn("Backend login API offline, verifying credentials with local store.");
    }

    // 2. Fallback local credential verification
    const users = getRegisteredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { 
        success: false, 
        error: 'No account found with this email address. Please Sign Up first.' 
      };
    }

    // STRICT PASSWORD MATCH VERIFICATION
    if (foundUser.password !== password) {
      return { 
        success: false, 
        error: 'Incorrect password. Please enter the correct password.' 
      };
    }

    const userObj = {
      displayName: foundUser.displayName || cleanEmail.split('@')[0],
      email: foundUser.email,
      photoURL: '',
      provider: 'local'
    };
    setCurrentUser(userObj);
    localStorage.setItem('inclusivepay_active_user', JSON.stringify(userObj));
    setActiveView('home');

    return { success: true, user: userObj };
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
