const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
   AUTHENTICATION ENDPOINTS & DIRECT EMAIL SERVICE
   ========================================================================== */

// Setup Nodemailer Transporter for Direct Primary Inbox Delivery
const createTransporter = async () => {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback to Ethereal / Direct Transport
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// 0. Direct Primary Inbox Verification Email Dispatch
app.post('/api/auth/send-verification-email', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate Verification Token (24h validity)
    const verificationToken = jwt.sign(
      { email: cleanEmail, fullName, password },
      process.env.JWT_SECRET || 'inclusivepay_secret_jwt_key_2026',
      { expiresIn: '24h' }
    );

    const clientOrigin = req.headers.origin || 'http://localhost:5173';
    const verifyUrl = `${clientOrigin}/?verifyToken=${encodeURIComponent(verificationToken)}`;

    // Create Transporter
    const transporter = await createTransporter();

    const mailOptions = {
      from: `"InclusivePay Team" <no-reply@inclusivepay.app>`,
      to: cleanEmail,
      subject: 'Verify Your InclusivePay Account – Action Required',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #080b15; color: #ffffff; padding: 32px; border-radius: 16px; max-width: 560px; margin: 0 auto; border: 1px solid #1d2444;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #4f52f8; margin: 0; font-size: 26px; font-weight: 800;">InclusivePay</h1>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Voice-First Accessible UPI Payment Network</p>
          </div>
          
          <div style="background-color: #141930; padding: 24px; border-radius: 12px; border: 1px solid #1d2444;">
            <h2 style="color: #ffffff; font-size: 18px; margin-top: 0;">Hello ${fullName || 'InclusivePay User'},</h2>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              Thank you for registering your InclusivePay account. Please click the button below to verify your email address and activate your account:
            </p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${verifyUrl}" style="background-color: #4f52f8; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(79,82,248,0.4);">Verify My InclusivePay Account</a>
            </div>
            
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-bottom: 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verifyUrl}" style="color: #7a7df9; word-break: break-all;">${verifyUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 11px;">
            <p>© 2026 InclusivePay. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Verification Email Dispatched to ${cleanEmail}: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`🔗 Test Email Preview URL: ${previewUrl}`);
    }

    res.status(200).json({
      success: true,
      message: `✉️ Verification email sent to ${cleanEmail}! Please check your Primary Inbox.`,
      previewUrl: previewUrl || undefined,
      verificationToken
    });
  } catch (error) {
    console.error('Send Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification email.', error: error.message });
  }
});

// 0.1 Verify Token Endpoint
app.post('/api/auth/verify-email-token', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'inclusivepay_secret_jwt_key_2026');
    const { email, fullName, password } = decoded;

    const cleanEmail = email.trim().toLowerCase();

    // Create or Activate user in MongoDB Atlas
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'InclusivePayPass123', salt);

    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      user.fullName = fullName || user.fullName;
      user.password = hashedPassword;
      user.isVerified = true;
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = await User.create({
        fullName: fullName || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        provider: 'local',
        isVerified: true,
        lastLogin: new Date()
      });
    }

    const authToken = generateToken(user);
    console.log(`✅ Token Verified & User Activated in MongoDB Atlas: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Account verified successfully!',
      token: authToken,
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
    console.error('Verify Token Error:', error);
    res.status(400).json({ success: false, message: 'Invalid or expired verification token.', error: error.message });
  }
});

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
