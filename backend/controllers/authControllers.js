const User = require("../models/user");

const catchAsyncError = require("../utils/catchAsyncErrors");
const {
  BadRequest,
  UnAuthenticated,
  NotFound,
  CustomError,
} = require("../errors");
const sendToken = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Unauthenticated = require("../errors/UnAuthenticated");

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

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new NotFound("User doesnt exist"));
  }

  //   Get reset token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //   Create reset password url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow: \n\n${resetURL}\n\nIf you have not requested this email, then ignore it`;
  console.log("abc  ");
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message));
  }
});

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new BadRequest("Reset password token is invalid"));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Unauthenticated("Password doesnt match"));
  }

  //   Setup new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

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
