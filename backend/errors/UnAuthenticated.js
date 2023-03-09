const CustomError = require("./CustomError");

class Unauthenticated extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Unauthenticated;
