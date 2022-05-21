const express = require('express');
const app = express();
const fs = require('fs');

// to modify data
app.use(express.json());

//to convert array to js object
const movies = JSON.parse(
  fs.readFileSync(`${__dirname}/movie_list/moviesData.json`)
);
//get all movies
const getAllMovies = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
};
//get movie by id
const getMovie = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  if (id > movies.length) {
    return res.status(404).json({
      status: ' fail',
      message: 'Invalid ID',
    });
  }

  const movie = movies.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',

    data: {
      movie,
    },
  });
};
//post movie
const postMovie = (req, res) => {
  // console.log(req.body);
  const newId = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newId }, req.body);

  //push movie to movie array
  movies.push(newMovie);

  //write to json file
  fs.writeFile(
    `${__dirname}/movie_list/moviesData.json`,
    JSON.stringify(movies),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          movie: newMovie,
        },
      });
    }
  );
};
//delete movie
const deleteMovie = (req, res) => {
  if (req.params.id * 1 > movies.length) {
    return res.status(404).json({
      status: ' fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// app.post('/', postMovie);
// app.get('/', getAllMovies);
// app.get('/movies/:id', getMovie);
// app.get('/movies/:id', deleteMovie);

app.route('/').get(getAllMovies).post(postMovie);
app.route('/movies/:id').get(getMovie).delete(deleteMovie);

const port = 5500;

app.listen(port, () => {
  console.log(`App running on port ${port}..`);
});
