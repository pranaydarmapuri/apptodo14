import mongoose from 'mongoose';
import User from './user';
const TodoSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Todo = mongoose.models?.['Todo'] ?? mongoose.model('Todo', TodoSchema);

export default Todo;
