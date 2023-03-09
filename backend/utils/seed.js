require("dotenv").config();
const connectDatabase = require("../config/db");
const products = require("../data/product");
const Product = require("../models/product");

connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
seedProducts();
