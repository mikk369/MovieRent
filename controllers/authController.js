const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //need to specify create new use like this so anyone cant add an adming role to new user
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //adds "payload" the data in the jwt token, UserID, The secret, and time when token expires in
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    //sends token to user
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email || !password) {
    //need to return login function so it finishes right away
    return next(new AppError('Please provide email and password!', 400));
  }
  //2)Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  //if no user or no correct password then return AppError
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrct email or password', 401));
  }

  //3)if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
