const express = require('express');

const router = express.Router();
const movieController = require('../controllers/movieController');

//to define parameter middleware
// router.param('id', movieController.chekID);

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);
router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
