const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const { protect, JWT_SECRET } = require('./middleware/authMiddleware');

const app = express();

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Global Download Counter in memory (fallback)
let downloadCounter = 12480;

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// MongoDB Atlas Connection
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri || mongoUri.includes('<db_username>')) {
  console.warn('⚠️ WARNING: MONGODB_URI is not properly configured in server/.env file.');
} else {
  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('✅ Connected successfully to MongoDB Atlas!');
      try {
        await User.collection.dropIndex('firebaseUid_1');
      } catch (e) {
        // Index already dropped or not present
      }
    })
    .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));
}

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'InclusivePay Enterprise API is online.' });
});

// Download Stats API
app.get('/api/stats/downloads', (req, res) => {
  res.json({ success: true, count: downloadCounter });
});

app.post('/api/stats/downloads/increment', (req, res) => {
  downloadCounter += 1;
  res.json({ success: true, count: downloadCounter });
});

/* ==========================================================================
   AUTHENTICATION ENDPOINTS
   ========================================================================== */

// 1. Local Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      provider: 'local',
      lastLogin: new Date()
    });

    const token = generateToken(newUser);

    console.log(`👤 New Local User Registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profileImage: newUser.profileImage,
        provider: newUser.provider,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
});

// 2. Local Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: 'This email is linked with Google Login. Please click "Direct Google Sign In".' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    console.log(`🔑 User Logged In: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
});

// 3. Google OAuth Sync Endpoint
app.post('/api/auth/google-sync', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Missing user email credentials.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      user.googleId = uid || user.googleId;
      user.displayName = displayName || user.fullName;
      if (photoURL) user.profileImage = photoURL;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        fullName: displayName || email.split('@')[0],
        email: email.toLowerCase(),
        googleId: uid,
        profileImage: photoURL || '',
        provider: 'google',
        lastLogin: new Date()
      });
    }

    const token = generateToken(user);

    console.log(`🌐 Google User Synced: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Google Sign-In synchronized successfully!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Google Sync Error:', error);
    res.status(500).json({ success: false, message: 'Server error during Google sync.', error: error.message });
  }
});

// 4. Get Current User Profile (Protected)
app.get('/api/auth/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
});

// 5. Update Profile (Protected)
app.put('/api/auth/update-profile', protect, async (req, res) => {
  try {
    const { fullName, profileImage } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (fullName) user.fullName = fullName;
    if (profileImage) user.profileImage = profileImage;
    user.updatedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        provider: user.provider,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// 6. Change Password (Protected)
app.put('/api/auth/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (user.provider === 'google' && !user.password) {
      return res.status(400).json({ success: false, message: 'Accounts created via Google Sign-In do not use local passwords.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 InclusivePay Enterprise Server running on http://localhost:${PORT}`));
