'use strict';

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

      data.Search?.forEach((movie) => {
        //create a div
        const movieContainer = document.createElement('div');
        //give it a classname
        movieContainer.classList.add('card');
        //generate random price
        let int = Math.floor(Math.random() * 9) + 1;

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
                <p class="year">${movie.Year}</p>
                <p class="price">${int}<sup>€</sup></p>
                
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

    //if clicking anywhere outside cart, closes the cart
    document.addEventListener('mouseup', function (event) {
      if (event.target != cart) {
        cart.classList.remove('active');
      }
    });

    //cart working
    if (document.readyState == 'loading') {
      document.addEventListener('DOMContentLoaded', ready);
    } else {
      ready();
    }

    //Function
    function ready() {
      //remove items from cart
      let removeCartButtons = document.getElementsByClassName('cart-remove');
      for (let i = 0; i < removeCartButtons.length; i++) {
        let button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
      }
      //quantity changes
      let quantityInputs = document.getElementsByClassName('cart-quantity');
      for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
      }
      //add to cart
      let addCart = document.getElementsByClassName('add-cart-button');
      for (let i = 0; i < addCart.length; i++) {
        let button = addCart[i];
        button.addEventListener('click', addCartClicked);
      }
    }

    //update total
    function updateTotal() {
      let cartContent = document.getElementsByClassName('cart-content')[0];
      let cartBoxes = cartContent.getElementsByClassName('cart-box');
      let total = 0;
      for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName('cart-price')[0];
        let quantityElement =
          cartBox.getElementsByClassName('cart-quantity')[0];
        let price = parseFloat(priceElement.innerText.replace('$', ''));
        let quantity = quantityElement.value;
        total = total + price * quantity;

        document.getElementsByClassName('total-price')[0].innerText =
          '$' + total;
      }
    }

    //remove items from cart
    function removeCartItem() {
      this.parentNode.remove();
      updateTotal();
    }

    //add TO cart
    function addCartClicked(event) {
      let button = event.target;
      let shopProducts = button.parentElement;
      let title =
        shopProducts.getElementsByClassName('movie-name')[0].innerText;
      let price = shopProducts.getElementsByClassName('price')[0].innerText;
      //TODO:cant get poster
      // let productImg = shopProducts.getElementsByClassName('poster')[0].src;
      addProductToCart(title, price);
      updateTotal();
    }

    function addProductToCart(title, price) {
      let cartShopBox = document.createElement('div');
      cartShopBox.classList.add('cart-box');
      let cartItems = document.getElementsByClassName('cart-content')[0];
      let cartItemsNames = cartItems.getElementsByClassName('movie-name');
      for (let i = 0; i < cartItemsNames.length; i++) {
        alert('You have already added this movie to cart');
        return;
      }
      //TODO: src peab lisama
      let cartboxContent = `<img
                      src="#"
                      alt="movie-picture"
                      class="poster"
                      />
                        <div class="movie-name"></div>
                          <div class="cart-price">5€</div>
                            <input type="number" value="1" class="cart-quantity" />
                        </div>
                      <!-- Remove Cart -->
                      <i class="fa-solid fa-trash-can cart-remove"></i>`;
      cartShopBox.innerHTML = cartboxContent;
      cartItems.append(cartShopBox);
      cartShopBox
        .getElementsByClassName('cart-remove')[0]
        .addEventListener('click', removeCartItem);
      cartShopBox
        .getElementsByClassName('cart-quantity')[0]
        .addEventListener('change', quantityChanged);

      //quantity changes
      function quantityChanged(event) {
        let input = event.target;
        if (isNaN(input.value) || input.value <= 0) {
          input.value = 1;
        }
        updateTotal();
      }
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
      // console.log('search', search);
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
