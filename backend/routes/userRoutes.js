const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUserDetail,
} = require("../controllers/userControllers");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

router.route("/me").get(isAuthenticatedUser, getUserProfile);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getUserDetail)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUserDetail);

module.exports = router;
