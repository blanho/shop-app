const { NotFound } = require("../errors");
const Product = require("../models/product");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeature = require("../utils/apiFeatures");

// Create new product => [POST] /api/v1/admin/products/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products => [GET] /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  const productCount = await Product.countDocuments();
  const apiFeatures = new APIFeature(Product, req.query)
    .search()
    .filter()
    .pagination(resPerPage);
  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
});

// Get single product details => [GET] /api/v1/products/:id
exports.getSingProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new NotFound("Product not found"));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// Update product => [PUT] /api/v1/admin/products/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new NotFound("Product not found"));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    sucess: true,
    product,
  });
});

// Delete product => [DELETE] /api/v1/admin/products/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new NotFound("Product not found"));
  }
  await product.deleteOne();

  res.status(200).json({
    sucess: true,
    message: "Product is deleted",
  });
});
