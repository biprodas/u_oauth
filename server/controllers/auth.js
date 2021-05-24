const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');
const os = require( 'os' );


const { User, RefreshToken } = require('../models');
const moment = require('moment');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, phone, username, password, role } = req.body;
  // Check for user
  let user = await User.findOne({ where: { username }, attributes: {include: 'password'} });
  if (user) {
    return next(new ErrorResponse('username exists', 401));
  }
  // Create user
  user = await User.create({ name, username, phone, password, role });

  const accessToken = user.getSignedAccessToken();
  // const refreshToken = user.getSignedRefreshToken(user, req);
  const [time,type] = (process.env.REFRESH_TOKEN_EXPIRES||"").split("*");
  
  rtoken = await RefreshToken.create({
    userId: user.id,
    token: uuidv4(),
    expiresIn: moment().add(Number(time||0), type),
    // expiresIn: new Date(Date.now() + (process.env.REFRESH_TOKEN_EXPIRES||7) * 24 * 60 * 60 * 1000), // cookie date ta dilam
    createdByIp: req.ip
  })
  // console.log("Mewwww",rtoken)

  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE||7) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res
    .status(201)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      success: true,
      message: `User registered successfully.`,
      accessToken, refreshToken: rtoken.token
    });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  // Validate username & password
  if (!username || !password) {
    return next(new ErrorResponse('Please provide an username and password', 400));
  }
  // Check for user
  const user = await User.findOne({ where: { username }, attributes: {include: 'password'} });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const accessToken = user.getSignedAccessToken();

  // const refreshToken = await RefreshToken.findOne({
  //   where: { token: req.cookies.refreshToken },
  //   include: [User],
  // });

  // const networkInterfaces = os.networkInterfaces();
  // console.log("NetworkInterface", networkInterfaces );

  const [time,type] = (process.env.REFRESH_TOKEN_EXPIRES||"").split("*");
  // console.log("Time/Type",time,type);

  const rtoken = new RefreshToken({
    userId: user.id,
    token: uuidv4(), 
    // token: crypto.randomBytes(40).toString('hex'),
    expiresIn: moment().add(Number(time||0), type),
    createdByIp: req.ip
  })

  // console.log("Mewwww",rtoken)
  // logout from all device
  const [ rowsUpdated, [ exRefreshTokens ] ] = await RefreshToken.update(
    { replacedByToken: rtoken.token, revokedByIp: req.ip, revokedAt: moment() }, 
    {
      where: { userId: user.id, revokedAt: null },
      returning: true
    }
  );
  await rtoken.save();

  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE||7) * 24 * 60 * 60 * 1000),
    httpOnly: false
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      success: true,
      message: `User logged in successfully.`,
      accessToken, refreshToken: rtoken.token
    });
});


// @desc      Log user out / clear cookie
// @route     DELETE /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  if(!req.user){
    return next(new ErrorResponse('Unauthorized', 403));
  }
  const {refreshToken} = req.user;

  if(!refreshToken){
    return next(new ErrorResponse('no active refresh token', 403));
  }
  refreshToken.revokedAt = Date.now();
  refreshToken.revokedByIp = req.ip;
  refreshToken.replacedByToken = refreshToken.token;
  await refreshToken.save();

  // res.clearCookie("accessToken");
  // console.log("QQQQQQQ",req.cookies); 
  Object.entries(req.cookies).map(([key,value]) => res.clearCookie(key));
  // res.cookie('token', 'none', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true
  // });

  res.status(200).json({
    success: true,
    message: `Logout successfull`,
    data: {}
  });
});


// @desc      Log user out / clear cookie
// @route     DELETE /api/v1/auth/logout-all
// @access    Private
exports.logoutAll = asyncHandler(async (req, res, next) => {
  if(!req.user){
    return next(new ErrorResponse('Unauthorized', 403));
  }
  const {refreshToken} = req.user;

  if(!refreshToken){
    return next(new ErrorResponse('no active refresh token', 403));
  }
  
  const [ rowsUpdated, [ exRefreshTokens ] ] = await RefreshToken.update(
    { replacedByToken: refreshToken.token, revokedByIp: req.ip, revokedAt: moment() }, 
    {
      where: { userId: req.user.id, revokedAt: null },
      returning: true
    }
  );

  Object.entries(req.cookies).map(([key,value]) => res.clearCookie(key));

  res.status(200).json({
    success: true,
    message: `Logout successfull`,
    data: {}
  });
});


// @desc      Refresh Token
// @route     POST /api/v1/auth/refresh_token
// @access    Public
exports.refreshToken = asyncHandler(async (req, res, next) => {

  if(!req.user){
    return next(new ErrorResponse('Unauthorized', 403));
  }
  const {refreshToken} = req.user;

  if(!refreshToken){
    return next(new ErrorResponse('no active refresh token', 403));
  }
  
  const accessToken = user.getSignedAccessToken();
  // replace old refresh token with a new one and save
  const [time,type] = (process.env.REFRESH_TOKEN_EXPIRES||"").split("*");

  const newRefreshToken = new RefreshToken({
    userId: user.id,
    token: uuidv4(),
    expiresIn: moment().add(Number(time||0), type),
    createdByIp: req.ip
  });

  refreshToken.revokedAt = Date.now();
  refreshToken.revokedByIp = req.ip;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();


  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE||7) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      success: true,
      message: ``,
      accessToken, refreshToken: newRefreshToken.token
    });

  
});

// @desc      Login user
// @route     POST /api/v1/auth/revoke_token
// @access    Public
exports.revokeToken = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = req.body.refreshToken;

  if (!token) {
    return next(new ErrorResponse('token is required', 401));
  }

  // const ownToken = await RefreshToken.findOne({ where:{ userId: req.user.id, token } });
  const refreshToken = await RefreshToken.findOne({ where: {token} });
  if (!refreshToken || !refreshToken.isActive){
    return next(new ErrorResponse('Invalid Token', 401));
  }
  // users can revoke their own tokens and admins can revoke any tokens
  if (refreshToken.userId!==req.user.id && req.user.role !== "Admin") {
      return next(new ErrorResponse('Unauthorized', 401));
  }

  // refreshToken.replacedByToken = 
  refreshToken.revokedAt = Date.now();
  refreshToken.revokedByIp = req.ip;
  await refreshToken.save();

  res.status(200).json({
    success: true,
    message: "Token Revoked",
    data: {}
  });
});


// @desc      Revoke token
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  //const user = await User.findById(req.user.id);
  if(!req.user){
    return next(new ErrorResponse('Authentication Failed', 401));
  }
  res.status(200).json({
    success: true,
    data: req.user || {}
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = { name, username, phone, role } = req.body;

  const usr = await User.findOne({where: { username } })
  if(usr && usr.id!==req.user.id){
    return next(new ErrorResponse(`username ${username} address already in use!`, 409));
  }

  const [ rowsUpdated, [ user ] ] = await User.update(fieldsToUpdate, {
    where: { id: req.user.id },
    returning: true 
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  console.log(req.body)
  const user = await User.findByPk(req.user.id, { attributes: {include: 'password'}})
  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  user.password = req.body.newPassword;
  await user.save()

  sendTokenResponse(user, 200, res);
});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, req, res) => {
  // Create token
  const accessToken = user.getSignedAccessToken();
  const refreshToken = user.getSignedRefreshToken(user, req)

  const cookieOptions = {
    expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE||7) * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res
    .status(statusCode)
    .cookie('accessToken', accessToken, cookieOptions)
    .json({
      success: true,
      message: ``,
      accessToken, refreshToken
    });
};

// function setTokenCookie(res, token){
//   const cookieOptions = {
//     httpOnly: true,
//     expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE||7) * 24 * 60 * 60 * 1000),
//   };
//   res.cookie('accessToken', token, cookieOptions);
// }