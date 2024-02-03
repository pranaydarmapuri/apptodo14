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
  
 
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo',
  }],
});

const User = mongoose.models?.['User'] ?? mongoose.model('User', UserSchema);

export default User;
