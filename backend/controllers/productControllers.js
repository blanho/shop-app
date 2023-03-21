const { NotFound, BadRequest } = require("../errors");
const Product = require("../models/product");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const APIFeature = require("../utils/apiFeatures");
const cloudinary = require("cloudinary").v2;

// Create new product => [POST] /api/v1/admin/products/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.images) {
    return res.status(400).json({ message: "Please provide the image" });
  }
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.uploader.upload(images[i], {
      folder: "shop/products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products => [GET] /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 6;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new APIFeature(Product, req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;

  const filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    productsCount,
    products,
    resPerPage,
    filteredProductsCount,
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

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.uploader.destroy(product.images[i].public_id);
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "shop/products",
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product => [DELETE] /api/v1/admin/products/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new NotFound("Product not found"));
  }

  // Delete image
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});

// Get all products => [GET - Admin] /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
});
