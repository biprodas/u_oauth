const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
require("colors");

// Load env vars
dotenv.config({ path: "./config/config.env" });
// dotenv.config();

const errorHandler = require("./middleware/error");
const { connectPostgreSQL } = require("./config/db");
const mountRoute = require("./routes/routes.js");

// Load env vars
// dotenv.config({ path: './config/config.env' });

const app = express();

app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks
//app.use(limiter);                   // Rate limiting
app.use(hpp()); // Prevent http param pollution
app.use(cors()); // Enable CORS
// app.use(cors({
//   exposedHeaders: ['authorization']
// }));

// File Upload Middleware
// app.use("uploads", express.static("uploads"));

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect to database
// connectDB()
if (process.env.NODE_ENV !== "test") {
  connectPostgreSQL();
}
// Mount routers
mountRoute(app);

app.use(errorHandler);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Listening on port
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

module.exports = server;
