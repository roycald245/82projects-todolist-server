import mongoose from 'mongoose';
import { ITodo } from '../interfaces/ITodo';

const Todo = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    description: {
      type: String,
    },

    isComplete: {
      type: Boolean,
      index: true,
    },

  },
  { timestamps: true },
);

export default mongoose.model<ITodo & mongoose.Document>('Todo', Todo);
