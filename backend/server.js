
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Node.js to use Google DNS


const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");
const path = require("path");

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`); // ✅ Fixed $(err.message) -> ${err.message}
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({path:  "backend/config/config.env"});
 
}

// Connecting to database
connectDatabase();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // ✅ Fixed aoi_secret -> api_secret
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT || 4000}`);
});

// Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1); // ✅ Fixed process.exit -> process.exit(1)
  });
});

const cors = require("cors");
app.use(cors());