const ErrorResponse = require('../utils/errorResponse');

exports.jwtConfig = (req, res, next) => {
  const jwtPrivateKey = process.env.JWT_SECRET;
  //const jwtExpire = process.env.JWT_EXPIRE;

  if(!jwtPrivateKey){
    return next(
      new ErrorResponse('FATAL ERROR: JWT_PRIVATE_KEY is not defined.', 500)
    );
  }
  // if(!jwtExpire){
  //   return next(
  //     new ErrorResponse('FATAL ERROR: JWT_EXPIRE should be a number of seconds or string representing a timespan', 500)
  //   );
  // }
  
  next();
};

