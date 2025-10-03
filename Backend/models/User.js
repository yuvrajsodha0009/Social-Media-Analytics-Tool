const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profilePic: { type: String },
  youtubeChannelPic: { type: String }, 
  googleId: { type: String },
  youtubeAccessToken: { type: String },
  youtubeRefreshToken: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
