// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose"); // Import mongoose
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000; // Fallback to 5000 if PORT is undefined
// const MONGO_URI = process.env.MONGO_URI; // Fetch MongoDB URI from .env

// // Middleware
// app.use(bodyParser.json());
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB connection
// mongoose
//   .connect(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.error("MongoDB connection error:", error));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./config/dbConfig"); // Import the database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const contactRoutes = require("./Routes/contactRoute");
const testimonialRoutes = require("./Routes/testimonialRoute");
const requestRoutes = require("./Routes/requestRoute");
const review = require("./Routes/ReviewRoutes");


app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//product

const productRoutes = require("./Routes/productRoute"); // تأكد من صحة المسار

app.use("/api/products", productRoutes);
app.use("/api/requests", requestRoutes);
// Connect to MongoDB
connectDB(); // Call the function to establish the connection

const userRoutes = require("./routes/userRoute");
const orderRoutes = require('./routes/orderRoutes');

app.use("/api/user", userRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/review", review);
app.use('/api/orders', orderRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
