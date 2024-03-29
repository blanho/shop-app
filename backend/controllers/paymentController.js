const catchAsyncError = require("../utils/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Process stripe payments => /api/v1/payment/process

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      integration_check: "accept_a_payment",
    },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

// Send stripe API key  => /api/v1/stripeAPI

exports.sendStripeAPI = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeAPIKey: process.env.STRIPE_API_KEY,
  });
});
