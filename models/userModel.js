const crypto = require('/crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'user must have name'],
    unique: [true, 'Name already used'],
    trim: true,
    maxlength: [15, 'User name must have less or equal 1 characters'],
    minlength: [1, 'User name must have atleast 1 character'],
  },

  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //if el(password confirm) is equal to password returns: true(password === passwordConfirm). THIS keyword works only on User.CREATE or .SAVE in authController, cant use THIS keyworkd with .FINDONE .UPDATE/ONE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  createPasswordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.pre('save', async function (next) {
  //if password is modified then run the following code
  if (!this.isModified('password')) return next();
  //hash current password,12 means how long is the random string(salt)
  this.password = await bcrypt.hash(this.password, 12);
  // const salt = await bcrypt.genSalt(12);
  // const hashedPassword = await bcrypt.hash(this.password, salt);
  // this.password = hashedPassword;
  next();
  //to delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
//calling function correctPassword that accepts candidatePassword that user passes in body.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  //since password select is set to false so need to pass in userPassword also with compare function
  return await bcrypt.compare(candidatePassword, userPassword);
};
// TODO:didnt get the timestamp
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
};

//user MODEL
const User = mongoose.model('User', userSchema);
module.exports = User;
