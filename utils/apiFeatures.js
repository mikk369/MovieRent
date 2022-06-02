class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //sort out query objects, build query
    //1)filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    //2) advanced filtering
    //converting object to a string
    let queryStr = JSON.stringify(queryObj);
    //replace add $ sign infront of gte,gt,lte,lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //to find operators in query Strings
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //sorting
    if (this.queryString.sort) {
      //remove , and add SPACE
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //newest created movies appear first
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // field limiting
    if (this.queryString.fields) {
      //remove , and add SPACE
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    //5)Pagination
    //to convert string to number by multiplying and || default page 1
    const page = this.queryString.page * 1 || 1;
    //|| default limit 100
    const limit = this.queryString.limit * 1 || 100;
    //calculate skip value,
    const skip = (page - 1) * limit;
    // page=2&limit-10, 1-10 = page 1, 11-20 = page 2 ...
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
