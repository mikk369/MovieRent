const path = require('path');
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const movieRouter = require('./routes/movieRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.set('view engine', 'pug');
//path to views
app.set('views', path.join(__dirname, 'views'));
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

app.get('/', (req, res) => {
  res.status(200).render('base');
});
//MOUNTING ROUTES
app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);

//Error handling when any other routes from UP ↑ didnt send response and it got to this point here:
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
