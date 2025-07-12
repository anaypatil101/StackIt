
import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please provide a valid email address.'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 6,
    select: false, // Do not return password by default
  },
  avatarUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre<User>('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function(enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};


const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

export default UserModel;
