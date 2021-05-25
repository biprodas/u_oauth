const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {sequelize} = require('../config/db')
const { User, RefreshToken } = require('../models');


// @desc      Get all RefreshTokens
// @route     GET /api/v1/RefreshTokens
// @access    Private/Admin
exports.getRefreshTokens = asyncHandler(async (req, res, next) => {
  const refreshTokens = await RefreshToken.findAll({include: [User]});
  // const RefreshTokens = await sequelize.query(`
  //   select name, RefreshTokenname, phone, role, status 
  //   from RefreshTokens where project_id=${pid} or role='Admin';`,
  // { type: sequelize.QueryTypes.SELECT });

  return res
  .status(200)
  .set("Content-Range", refreshTokens.length)
  .json(refreshTokens);
});

// @desc      Get single RefreshToken
// @route     GET /api/v1/RefreshTokens/:id
// @access    Private/Admin
exports.getRefreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = await RefreshToken.findByPk(req.params.id);

  if(!refreshToken){
    return next(new ErrorResponse(`No RefreshToken with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: refreshToken
  });
});

// @desc      Create RefreshToken
// @route     POST /api/v1/RefreshTokens
// @access    Private/Admin
exports.createRefreshToken = asyncHandler(async (req, res, next) => {

  res.status(201).json({
    success: true,
    message: `Working`,
    data: {}
  });
});

// @desc      Update RefreshToken
// @route     PUT /api/v1/RefreshTokens/:id
// @access    Private/Admin
exports.updateRefreshToken = asyncHandler(async (req, res, next) => {

  res.status(200).json({
    success: true,
    message: "Working",
    data: {}
  });
});

// @desc      Delete RefreshToken
// @route     DELETE /api/v1/RefreshTokens/:id
// @access    Private/Admin
exports.deleteRefreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = await RefreshToken.findByPk(req.params.id)

  if(!refreshToken){
    return next(
      new ErrorResponse(`No RefreshToken with the id of ${req.params.id}`, 404)
    );
  }
  
  await refreshToken.destroy();

  res.status(200).json({
    success: true,
    message: `RefreshToken with the id ${req.params.id} deleted successfully`,
    data: {}
  });
});