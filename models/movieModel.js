const mongoose = require('mongoose');

//MovieSchemas
const MovieSchema = new mongoose.Schema({
  Title: {
    type: String,
    trim: true,
    //its validator.  Unique true means in has to have title and price otherwise validation error occurs
    required: [true, 'A movie must have a Title'],
    //cant have dublicate Title
    unique: true,
  },
  Year: {
    type: Number,
  },
  Genre: {
    type: String,
  },
  Price: {
    type: Number,
    required: [true, 'A movie must have a price'],
  },
  Runtime: {
    type: Number,
  },
  Plot: {
    type: String,
    trim: true,
    required: [true, 'A movie must have plot description'],
    priceDiscount: Number,
  },
  Rating: {
    type: Number,
    default: 0,
  },
  Poster: {
    type: String,
    required: [true, 'A movie must have poster'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
//MODEL
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
