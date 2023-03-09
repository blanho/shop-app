const mongoose = require("mongoose");

const connectDatabase = (URI) => {
  return mongoose.connect(URI);
};

module.exports = connectDatabase;
