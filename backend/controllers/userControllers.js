const { BadRequest, NotFound } = require("../errors");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/user");
const sendToken = require("../utils/jwt");
// Get currently logged in user details => [GET] /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Change password => [PUT] /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new BadRequest("Password is incorrect"));
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

// Update / Update user profile => [PUT] /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  //   Update avatar: ToDO
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Admin Routes
// Get all users => [GET] /api/v1/admin/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get user details => [GET] /api/v1/admin/user/:id
exports.getUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFound(`Cannot be found user with id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update / Update user profile => [PUT] /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete user => [DELETE] /api/v1/admin/user/:id
exports.deleteUserDetail = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new NotFound(`Cannot be found user with id: ${req.params.id}`));
  }

  // Remove avatar from cloudinary - TODO

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
