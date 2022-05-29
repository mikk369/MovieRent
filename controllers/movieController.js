// const fs = require('fs');
const Movie = require('../models/movieModel');

///testing data from jsonFILE
// const movies = JSON.parse(
//   fs.readFileSync(`${__dirname}/../movie_list/moviesData.json`)
// );
///

//checks if the movie ID is valid if not returns 404 using with JSON DB
// exports.chekID = (req, res, next, val) => {
//   console.log(`Movie id is: ${val}`);
//   if (req.params.id * 1 > movies.length) {
//     return res.status(404).json({
//       status: ' fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

//checks if the movie body DOESENT contain Title or Body then returns 404
// exports.checkBody = (req, res, next) => {
//   if (!req.body.Title || !req.body.Price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing Title or Price',
//     });
//   }
//   next();
// };

//get all movies
exports.getAllMovies = async (req, res) => {
  //find method to find all documents in Movie and convert to javascript objects
  try {
    //sort out query objects
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);

    const movies = await Movie.find(queryObj);

    res.status(200).json({
      status: 'success',
      //measures how much result are in movie array
      results: movies.length,
      //movie 'envelope'
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//get movie by id. Finding/queryng documents from database
exports.getMovie = async (req, res) => {
  try {
    //finds one movie by its ID and its shorthand for Moive.findOne
    const movie = await Movie.findById(req.params.id);
    //Movie.findOne({ __id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
//post movie
exports.createMovie = async (req, res) => {
  try {
    //creates tour promise in newMovie
    const newMovie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

//used when using json file as database
// console.log(req.body);
// const newId = movies[movies.length - 1].id + 1;
// const newMovie = Object.assign({ id: newId }, req.body);

// //push movie to movie array
// movies.push(newMovie);

// //write to json file
// fs.writeFile(
//   `${__dirname}/movie_list/moviesData.json`,
//   JSON.stringify(movies),
//   (err) => {
//     res.status(201).json({
//       status: 'success',
//       data: {
//         movie: newMovie,
//       },
//     });
//   }
// );

//update movie
exports.updateMovie = async (req, res) => {
  try {
    //query the doc we need to update based on ID
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

//delete movie
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Movie has been deleted',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
