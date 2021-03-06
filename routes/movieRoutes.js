const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();
const movieController = require('../controllers/movieController');

//to define parameter middleware
// router.param('id', movieController.chekID);

router
  .route('/top-10-cheap')
  .get(movieController.aliasTopMovies, movieController.getAllMovies);

router.route('/movie-stats').get(movieController.getMovieStats);
router.route('/newest-first').get(movieController.newestFirst);
router.route('/oldest-first').get(movieController.oldestFirst);

router
  .route('/')
  .get(authController.protect, movieController.getAllMovies)
  .post(movieController.createMovie);
router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'moderator'),
    movieController.deleteMovie
  );

module.exports = router;
