const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const { RefreshToken } = require('../models');

const requiresAuth=true

// 401 - Unauthorized, 403 - Forbidden

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  if (!requiresAuth) return next();

  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  else if(req.cookies.accessToken) {
    // Set token from cookie
    console.log("accesstoken from cookie");
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  
  try {
    // Verify token 
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {ignoreExpiration: true} );
    let refreshToken;
    console.log("Decoded",decoded);
    const user = await User.findByPk(decoded.id);
    const refreshTokens = await RefreshToken.findAll({where: {userId:user.id, revokedAt: null}});
    user.refreshToken = refreshTokens.find(r => r.isActive);

    if (Date.now() >= decoded.exp * 1000) {
      console.log("Access token Expired");
      if(user.refreshToken) {
        console.log("user.refreshToken",user.refreshToken);
        const accessToken = user.getSignedAccessToken();
        const cookieOptions = {
          expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE||7) * 24 * 60 * 60 * 1000),
          httpOnly: false
        };
        if (process.env.NODE_ENV === 'production') {
          cookieOptions.secure = true;
        }
        req.user = user;
        res.cookie('accessToken', accessToken, cookieOptions);
      }
      else{
        Object.entries(req.cookies).map(([key,value]) => res.clearCookie(key));
        return next(new ErrorResponse('Not authorized to access this route', 401));
      }
    }
    
    req.user = user;
    
    
    // log(req.user, RefreshToken)
    // get refresh token
    // req.user.ownsToken = token => !!refresh_tokens.find(x => x.token === token);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles [string or array]
exports.authorizeOld = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!requiresAuth) return next();
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};

exports.authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req, res, next) => {
    if (!requiresAuth) return next();
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403)
      );
    }
    next();
  };
};
