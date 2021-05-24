const ErrorResponse = require('../utils/errorResponse');

// 400 - Bad Request, , 404 - Not Found, 500 - Internal Server Error

const errorHandler = (err, req, res, next) => {
  let error = { ...err }, errors = {};

  error.message = err.message;

  // Log to console for dev
  console.log(`${err}`.red);

  // Sequelize Validation Error
  if(err.name === 'SequelizeValidationError'){
    err.errors.forEach(error => errors[error.path] = error.message)
    const message = Object.values(errors).map(val => val);
    error = new ErrorResponse("Validation Error", 400);
  }
  if(err.name==="SequelizeUniqueConstraintError"){
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    errors
  });
};

module.exports = errorHandler;
