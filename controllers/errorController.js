module.exports = (err, req, res, next) => {
  // err.statusCode is equal to err.statusCode if its defined if not its 500(eternal server error)
  err.statusCode = err.statusCode || 500;
  //err.status is equal to err.status if its defined if not its 'error'
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
