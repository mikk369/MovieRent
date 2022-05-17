const genreButton = document.querySelector(".genre");
const modal = document.querySelector(".modal");
const addMoviesButton = document.querySelector(".add-movies");
const closeModalButton = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay");
//open modal
const openModal = function () {
  // console.log('button clicked');
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
addMoviesButton.addEventListener("click", openModal);

//close modal
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
closeModalButton.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  // console.log(e.key);
  //close modal with escape
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
