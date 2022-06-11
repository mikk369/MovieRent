const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => {
  //need to specify create new use like this so anyone cant add an adming role to new user//can use also User.save
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //adds "payload" the data in the jwt token, UserID, The secret, and time when token expires in
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    //sends token to user
    token,
    data: {
      user: newUser,
    },
  });
});
