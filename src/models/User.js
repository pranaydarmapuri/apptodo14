
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
  jwtToken: {
    type: String,
    default: '', 
  },
});

const User = mongoose.models?.['User'] ?? mongoose.model('User', UserSchema);

export default User;
