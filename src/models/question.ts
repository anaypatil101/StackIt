
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import type { User } from './user';
import type { Answer } from './answer';

export interface Question extends Document {
  title: string;
  description: string;
  tags: string[];
  author: Types.ObjectId | User;
  answers: (Types.ObjectId | Answer)[];
  votes: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<Question>({
  title: {
    type: String,
    required: [true, 'Please provide a title for your question.'],
    minlength: 10,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
    minlength: 20,
  },
  tags: {
    type: [String],
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer',
  }],
  votes: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// To ensure we can search questions efficiently
QuestionSchema.index({ title: 'text', description: 'text', tags: 'text' });


const QuestionModel: Model<Question> = mongoose.models.Question || mongoose.model<Question>('Question', QuestionSchema);

export default QuestionModel;
