
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import type { User } from './user';

export interface Answer extends Document {
  content: string;
  author: Types.ObjectId | User;
  question: Types.ObjectId;
  votes: number;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<Answer>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const AnswerModel: Model<Answer> = mongoose.models.Answer || mongoose.model<Answer>('Answer', AnswerSchema);

export default AnswerModel;
