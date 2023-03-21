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
const cors = require("cors");
const Product = require("./models/product");

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
app.use(cors());
app.use(cookieParser());
app.use(fileUpload());
app.use(morgan("dev"));

// Socket
const http = require("http").createServer(app);
const io = require("socket.io")(http);
let users = [];
io.on("connection", (socket) => {
  console.log(`${socket.id} connected`);

  socket.on("joinRoom", (id) => {
    const user = { userId: socket.id, room: id };

    const check = users.every((user) => user.userId !== socket.id);

    if (check) {
      users.push(user);
      socket.join(user.room);
    } else {
      users.map((user) => {
        if (user.userId === socket.id) {
          if (user.room !== id) {
            socket.leave(user.room);
            socket.join(id);
            user.room = id;
          }
        }
      });
    }
  });

  socket.on("createComment", async (msg) => {
    const { rating, comment, productId, user, name } = msg;
    const review = {
      user,
      name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new NotFound(`Cannot be found product with id: ${productId}`)
      );
    }

    const isReviewed = product.reviews.find((r) => {
      return r.user.toString() === user;
    });

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === user.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
      product.numofReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => {
        return item.rating + acc;
      }, 0) / product.numofReviews;

    await product.save({ validateBeforeSave: false });
    console.log(product);
    io.emit("sendCommentToClient", product);
  });
  socket.on("disconnect", () => {
    console.log(`${socket.id} + disconnected`);
  });
});

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
    http.listen(PORT, () => {
      console.log(
        `Server is running on PORT: ${PORT} in ${process.env.NODE_ENV}`
      );
    });
  } catch (error) {
    console.log(error);
  }
};
bootstrap();
