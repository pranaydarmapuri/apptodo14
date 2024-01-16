// src/models/user.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  // Add any additional fields relevant to your user model
});

const User = mongoose.model('users', UserSchema);

export default User;
