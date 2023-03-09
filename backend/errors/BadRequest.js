const CustomError = require("./CustomError");

class BadRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
