import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  timeStamp: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);
