// const fs = require('fs');
// const express = require('express');
const Movie = require('../models/movieModel');
const APIFeatures = require('../utils/apiFeatures');

// aliasTopMovies middlware sets these values when hiting the '/top-10-cheap' route
exports.aliasTopMovies = (req, res, next) => {
  //how much info will be shown
  req.query.limit = '10';
  //sorts rating & price in declining queue
  req.query.sort = 'sort=-Rating,Price';
  //what fields we want to see
  req.query.fields = 'Title,Price,imdbRating,Year,Genre';
  next();
};

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
    //sort out query objects, build query
    //1)filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // //2) advanced filtering
    // //converting object to a string
    // let queryStr = JSON.stringify(queryObj);
    // //replace add $ sign infront of gte,gt,lte,lt
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // //to find operators in query Strings
    // let query = Movie.find(JSON.parse(queryStr));

    //3) Sorting
    // if (req.query.sort) {
    //   //remove , and add SPACE
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   //newest created movies appear first
    //   query = query.sort('-createdAt');
    // }

    //4) field limiting
    // if (req.query.fields) {
    //   //remove , and add SPACE
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    // //5)Pagination
    // //to convert string to number by multiplying and || default page 1
    // const page = req.query.page * 1 || 1;
    // //|| default limit 100
    // const limit = req.query.limit * 1 || 100;
    // //calculate skip value,
    // const skip = (page - 1) * limit;
    // // page=2&limit-10, 1-10 = page 1, 11-20 = page 2 ...
    // query = query.skip(skip).limit(limit);
    // //if user skips more pages than there are pages
    // if (req.query.page) {
    //   const numMoives = await Movie.countDocuments();
    //   if (skip >= numMoives) throw new Error('This page does not exist');
    // }

    //EXECUTE QUERY, need to call 'return this' after every method to chain them like this.We are creating new object called 'APIFeatures' class, in there we are passing query object 'Movie.find()' and query string that is coming from express 'req.query' then with each method we added we manipulate the query.
    const features = new APIFeatures(Movie.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    //we await the result that query coming back with all the documents we selected that query is in 'features.query'
    const movies = await features.query;

    //send response
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
// calculating avg statistics
exports.getMovieStats = async (req, res, next) => {
  try {
    const stats = await Movie.aggregate([
      //calculate grater or equal rating 9
      // {
      //   $match: { Rating: { $gte: 9 } },
      // },

      {
        //to calculate ALL movies averages need to use NULL
        $group: {
          _id: null,
          num: { $sum: 1 },
          avgRating: { $avg: '$Rating' },
          avgPrice: { $avg: '$Price' },
          minPrice: { $min: '$Price' },
          maxPrice: { $max: '$Price' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      // {
      //   //sorts by avg price cheapest first when adding -1 then its decending(highest first)
      //   $sort: { avgPrice: 1 },
      // },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Movies By year -1 then newest first, 1 then oldest first
exports.newestFirst = async (req, res) => {
  try {
    const newestFirst = await Movie.aggregate([
      {
        $sort: { Year: -1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        newestFirst,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
//gives oldest movies BY YEAR
exports.oldestFirst = async (req, res) => {
  try {
    const oldestFirst = await Movie.aggregate([
      {
        $sort: { Year: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        oldestFirst,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
