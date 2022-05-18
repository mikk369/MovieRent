const genreButton = document.querySelector('.genre');
const modal = document.querySelector('.modal');
const addMoviesButton = document.querySelector('.add-movies');
const closeModalButton = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
//open modal
const openModal = function () {
  // console.log('button clicked');
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
addMoviesButton.addEventListener('click', openModal);

//close modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);
  //close modal with escape
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//this listens for DOM content loaded just in case
document.addEventListener('DOMContentLoaded', () => {
  //apikey
  const apikey = '9f0ca0df';
  //search movies from API
  async function loadMovie(search) {
    try {
      let response = await fetch(
        `https://www.omdbapi.com/?apikey=${apikey}&s=${search}`
      );

      //convert response
      let data = await response.json();

      //clear old
      document.getElementById('movie-div').innerHTML = '';
      //loop over response
      data.Search.forEach((movie) => {
        //create a div
        const movieContainer = document.createElement('div');
        //give it a classname
        movieContainer.classList.add('card');
        //create innerHtml for div
        movieContainer.innerHTML = `
           <div class="card-box">
              <img
                class="poster"
                src="${movie.Poster}"
                alt="Avatar"
                height="300" width="200"
              />
              <div class="lower-card">
                <h4 class="movie-name"><b>${movie.Title}</b></h4>
                <p class="genre">${movie.Genre}</p>
                <p class="year">${movie.Year}</p>
                <button class="add-cart">add to cart</button>
              </div>
            </div>
            `;
        //add movieContainer to movie-div
        document.getElementById('movie-div').appendChild(movieContainer);
      });
    } catch (error) {
      console.log('Error', error);
    }
  }

  //  add listeners to search button
  document
    .getElementById('search-btn')
    .addEventListener('click', (response) => {
      response.preventDefault();
      //get search term from input
      const search = document.getElementById('text-input').value;
      //goto loadMovie function
      loadMovie(search);
      //console log search term
      console.log('search', search);
    });
});
