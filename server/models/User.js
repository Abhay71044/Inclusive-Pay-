const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String }, // Hashed password for local users
  googleId: { type: String, sparse: true }, // Firebase UID / Google ID
  profileImage: { type: String, default: '' },
  provider: { type: String, enum: ['google', 'local'], default: 'local' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  deviceInfo: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
