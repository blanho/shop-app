const express = require("express");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

router.route("/products").get(getProducts);

router.route("/products/:id").get(getSingProduct);

// Admin
router.route("/admin/products/new").post(newProduct);

router.route("/admin/products/:id").put(updateProduct).delete(deleteProduct);

module.exports = router;
