class APIFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: new RegExp(this.queryStr.keyword, "i"),
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    let filterContent = { ...this.queryStr };

    // Removing fields from query
    const removeFields = ["keyword", "limit", "page"];

    // Delete properties containing to removeFiles
    removeFields.forEach((el) => delete filterContent[el]);

    // Filter price, ratings
    let queryStr = JSON.stringify({ ...filterContent }); // Convert to String

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeature;
