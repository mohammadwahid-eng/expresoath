import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    select: false,
  },
  tokens: [String]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  const user = this;
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  const user = this;
  return bcrypt.compare(password, user.password);
}

userSchema.methods.createToken = async function() {
  const user = this;
  const token = jwt.sign({ user: { _id: user._id, name: user.name, email: user.email } }, process.env.JWT_SECRET, { expiresIn: '7d' });
  user.tokens = user.tokens.concat(token);
  await user.save();
  return token;
}

const User = model('User', userSchema);

export default User;