import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  passwordHash: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
});

const User = mongoose.models?.['User'] ?? mongoose.model('User', UserSchema);

export default User;
