const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');

exports.getAllusers = catchAsync(async (req, res) => {
  const users = await User.find();

  //send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not working yet',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not working yet',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not working yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route not working yet',
  });
};
