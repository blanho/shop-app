const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripeAPI,
} = require("../controllers/paymentController");

const { isAuthenticatedUser } = require("../middleware/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/stripeAPI").get(isAuthenticatedUser, sendStripeAPI);

module.exports = router;
