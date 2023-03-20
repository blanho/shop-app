require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/errors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = require("./utils/swagger");

// Import all routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Swagger
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(fileUpload());
app.use(morgan("dev"));

// Setting up cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", reviewRoutes);
app.use("/api/v1", paymentRoutes);

app.use(errorMiddleware);

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
