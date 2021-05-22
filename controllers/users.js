const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const {sequelize} = require('../config/db')
const User = require('../models/User');
const {nanoid} = require('nanoid');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const pid = req.query.project_id||null;
  const users = await sequelize.query(`
    select name, username, phone, role, status 
    from users where project_id=${pid} or role='Admin';`,
  { type: sequelize.QueryTypes.SELECT });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if(!user){
    return next(new ErrorResponse(`No User with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {

  const usr = await User.findOne({where: { username: req.body.username} })
  if(usr){
    return next(new ErrorResponse(`Username ${req.body.username} already in use!`, 409));
  }

  const nanopass = nanoid(10);
  req.body.password = nanopass;
  // const salt = await bcrypt.genSalt(10);
  // req.body.password = await bcrypt.hash(req.body.password, salt);
  
  const user = await User.create(req.body);
  user.password = nanopass;
  // Send sms
  console.log(`SMS => id: ${user.username}, password: ${req.body.password}`.green.inverse)

  res.status(201).json({
    success: true,
    message: `User with id ${user.id} Created Successfully`,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {

  const usr = await User.findOne({where: { username: req.body.username} })

  if(usr && usr.id!==Number(req.params.id)){
    return next(new ErrorResponse(`Username ${req.body.username} already in use!`, 409));
  }

  const [ rowsUpdated, [ user ] ] = await User.update(req.body, {
    where: { id: req.params.id },
    returning: true
  });

  if(!user){
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "User Updated",
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id)

  if(!user){
    return next(
      new ErrorResponse(`No User with the id of ${req.params.id}`, 404)
    );
  }
  
  await user.destroy();

  res.status(200).json({
    success: true,
    message: `User with the id ${req.params.id} deleted successfully`,
    data: {}
  });
});