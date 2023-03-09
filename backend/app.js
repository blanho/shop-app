require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const app = express();

// Import all routes
const productRoutes = require("./routes/productRoutes");

app.use(express.json());

app.use("/api/v1", productRoutes);

const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log("Connect database successfully");
    app.listen(PORT, () => {
      console.log(
        `Server is running on PORT: ${PORT} in ${process.env.NODE_ENV}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
bootstrap();
