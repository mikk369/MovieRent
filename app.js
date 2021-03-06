const path = require('path');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const movieRouter = require('./routes/movieRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//path to public
app.use(express.static(path.join(__dirname, 'public')));
//1)middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//MOUNTING ROUTES
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// app.post('/', function (req, res) {
//   res.sendFile(__dirname + 'index.html');
// });

app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);

//Error handling when any other routes from UP ↑ didnt send response and it got to this point here:
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
