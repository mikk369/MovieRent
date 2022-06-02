const mongoose = require('mongoose');
const slugify = require('slugify');

//MovieSchemas
const MovieSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      //trim removes white spaces from strings, if spaces are left in or so
      trim: true,
      //its validator.  Unique true means in has to have title and price otherwise validation error occurs
      required: [true, 'A movie must have a Title'],
      //cant have dublicate Title
      unique: true,
    },
    slug: String,
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
  },
  {
    //virtual properties: schema options
    //each time data is outputed as JSON we want virtuals to be part of the output
    toJSON: { virtuals: true },
    //same when data gets outputed as objects
    toObject: { virtuals: true },
  }
);
//virutal properties: adding new data output that takes Runtime and multyplies it to get minutes(cant use it in query, cause its not part of the query)
MovieSchema.virtual('RuntimeInMinutes').get(function () {
  return this.Runtime * 60;
});

// // TODO: didnt work//DOCUMENT MIDDLEWARE: runs before .save() and .create()
// MovieSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// MovieSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
//MODEL
const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
