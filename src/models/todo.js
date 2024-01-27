import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const TodosSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Todo = mongoose.models?.['Todo'] ?? mongoose.model('Todo', TodosSchema);

export default Todo;
