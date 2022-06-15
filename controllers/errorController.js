const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  //loops over error objects

  const value = err.errmsg.mact(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please lofin again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has been expired, please log in agaen !', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorprod = (err, req) => {
  //operational, trusted error: send message to client
  if (err.isOpperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //programming or other unknown error: dont want to send details to cliend
  } else {
    //1) log to console
    console.log('ERROR !!!', err);
    //2) send generic mssage
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // err.statusCode is equal to err.statusCode if its defined if not its 500(eternal server error)
  err.statusCode = err.statusCode || 500;
  //err.status is equal to err.status if its defined if not its 'error'
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    //handles cast error when the movie id is wrong
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    //handles title error when movie title is already entered
    if (error.code === 11000) error = handleDuplicateFields(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrorprod(error, res);
  }
};
