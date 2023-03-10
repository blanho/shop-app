const User = require("../models/user");

const catchAsyncError = require("../middleware/catchAsyncErrors");
const { BadRequest, UnAuthenticated } = require("../errors");
const sendToken = require("../utils/jwt");

// Register a user => [POST] /api/v1/register
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id:
        "shop/users/24-248253_user-profile-default-image-png-clipart-png-download_y7mexg",
      url: "https://res.cloudinary.com/dg6qyxc0a/image/upload/v1678416285/shop/users/24-248253_user-profile-default-image-png-clipart-png-download_y7mexg.png",
    },
  });

  sendToken(user, 200, res);
});

// Login User => /api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequest("Please enter email and password"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new UnAuthenticated("Invalid Credentials"));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new UnAuthenticated("Invalid Credentials"));
  }

  sendToken(user, 200, res);
});

// Logout User => /api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});
