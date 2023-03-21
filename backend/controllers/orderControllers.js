const { NotFound, BadRequest } = require("../errors");
const Order = require("../models/order");
const Product = require("../models/product");
const catchAsyncErrors = require("../utils/catchAsyncErrors");

// Create new order => [POST] /api/v1/orders/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// Create single order => [POST] /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(
      new NotFound(`Cannot be found order with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders => [GET] /api/v1/orders/me
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    order,
  });
});

// Get all orders => [GET] /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update / status order - ADMIN => [PUT] /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new NotFound(`Cannot be found order with id: ${req.params.id}`)
    );
  }

  if (order.orderStatus === "Delivered") {
    return next(new BadRequest("You've already delivered this order"));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });
  (order.orderStatus = req.body.status), (order.deliveredAt = Date.now());

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// Delete an order => [DELETE] /api/v1/admin/orders/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new NotFound(`Cannot be found order with id: ${req.params.id}`)
    );
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ message: `Cannot be found product with id: ${id}` });
  }

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}
