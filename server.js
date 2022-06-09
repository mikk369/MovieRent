const mongoose = require('mongoose');
const dotenv = require('dotenv');

//uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION, shutting down!');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

//gets the password from config.env and replaces it in database adress
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//connects database with mongoose
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

// console.log(process.env);
const port = process.env.PORT || 5500;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});

//handles unhandled projected promises
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, shutting down!');
  server.close(() => {
    process.exit(1);
  });
});
