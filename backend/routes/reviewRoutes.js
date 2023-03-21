const express = require("express");
const router = express.Router();

const {
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewController");

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/reviews").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(isAuthenticatedUser, getProductReviews);

router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
