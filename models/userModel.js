const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have name'],
    unique: [true, 'Name already used'],
    trim: true,
    maxlength: [15, 'User name must have less or equal 1 characters'],
    minlenght: [1, 'User name must have atleast 1 character'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlenght: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    defaul: Date.now(),
  },
});
//user MODEL
const User = mongoose.model('User', userSchema);

module.exports = User;
