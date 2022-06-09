const catchAsync = require('./../utils/catchAsync');
const Movie = require('../models/movieModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

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
exports.getAllMovies = catchAsync(async (req, res, next) => {
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
});

//get movie by id. Finding/queryng documents from database
exports.getMovie = catchAsync(async (req, res, next) => {
  //finds one movie by its ID and its shorthand for Moive.findOne
  const movie = await Movie.findById(req.params.id);
  //Movie.findOne({ __id: req.params.id })

  //Error handler
  // TODO: didnt work
  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

//post movie
exports.createMovie = catchAsync(async (req, res, next) => {
  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      movie: newMovie,
    },
  });
});

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
exports.updateMovie = catchAsync(async (req, res, next) => {
  //query the doc we need to update based on ID
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  //handler
  // TODO: didnt work
  if (!movie) {
    return next(new AppError('No movie doind with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

//delete movie
exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  //didnt work
  // TODO: didnt work
  if (!movie) {
    return next(new AppError('No movie doind with that ID', 404));
  }

  res.status(204).json({
    status: 'Movie has been deleted',
    data: null,
  });
});
// calculating avg statistics
exports.getMovieStats = catchAsync(async (req, res, next) => {
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
});

// Movies By year -1 then newest first, 1 then oldest first
exports.newestFirst = catchAsync(async (req, res, next) => {
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
});
//gives oldest movies BY YEAR
exports.oldestFirst = catchAsync(async (req, res, next) => {
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
});
