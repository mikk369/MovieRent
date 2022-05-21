'use strict';

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
                <button class="add-cart-button">add to cart</button>
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

  //add search by ENTER key
  document.addEventListener('keydown', function (e) {
    // console.log(e.key);
    if (e.key === 'Enter') {
      document.getElementById('search-btn').click();
    }
  });
  //Select image to add
  const image_input = document.querySelector('#image_input');
  let uploaded_image = '';

  image_input.addEventListener('change', function () {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      uploaded_image = reader.result;
      document.querySelector(
        '.added_image'
      ).style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
  });
});

// Cart
let cartIcon = document.querySelector('.shopping-cart-button');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Open close cart
cartIcon.onclick = () => {
  cart.classList.add('active');
};
closeCart.onclick = () => {
  cart.classList.remove('active');
};

//Cart Working JS
if (document.readyState == 'loading') {
  document.addEventListener('DOMcontentLoaded', ready);
} else {
  ready();
}

// TODO:adding not working
// //add to cart
// let addCart = document.querySelector('.add-cart-button');
// for (let i = 0; i < addCart.length; i++) {
//   let button = addCart[i];
//   button.addEventListener('click', addCartClicked);
// }
// //add To cart
// function addCartClicked(event) {
//   let button = event.target;
//   let shopProducts = button.parentelement;
//   let title = shopProducts.querySelector('.movie-name');
//   [0].innerText;
//   console.log(title);
// }
// // Making Function
// function ready() {
//   //Remove items from cart
//   let removeCartButtons = document.getElementsByClassName('cart-remove');
//   console.log(removeCartButtons);
//   for (let i = 0; i < removeCartButtons.length; i++) {
//     let button = removeCartButtons[i];
//     button.addEventListener('click', removeCartItem);
//   }
// }

// //Remove items from cart
// function removeCartItem(event) {
//   let buttonClicked = event.target;
//   buttonClicked.parentelement.remove();
// }
