const errorHandling = (err, req, res, next) => {
  let errors = {
    message: err.message || 500,
    statusCode: err.statusCode || "Something wrong, please try later",
  };
  // ValidationError
  if (err.name === "ValidationError") {
    const validationErrorList = Object.values(err.errors);
    errors.message = validationErrorList
      .map((item) => {
        return item.message;
      })
      .join(",");
    errors.statusCode = 400;
  }

  // DuplicateError
  if (err.code === 11000 && err.code) {
    errors.message = `${Object.keys(
      err.keyValue
    )} field has been duplicated, please choose another one`;
    errors.statusCode = 400;
  }

  // NotFound Error
  if (err.name === "CastError") {
    errors.message = `Cannot find item with id: ${err.value}`;
    errors.statusCode = 404;
  }

  console.log(errors);

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return res.status(errors.statusCode).json({
      sucess: false,
      error: err,
      message: errors.message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    return res.status(errors.statusCode).json({
      sucess: false,
      message: errors.message,
    });
  }
};

module.exports = errorHandling;
