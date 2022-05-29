const express = require('express');
const morgan = require('morgan');

const movieRouter = require('./routes/movieRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
//1)middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//MOUNTING ROUTES
app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);

module.exports = app;
