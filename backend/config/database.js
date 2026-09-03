const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      dbName: "Ecommerce", // Hardcodes target database to Ecommerce
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
      console.log(`Active Database Name: ${data.connection.name}`);
    })
    .catch((err) => {
      console.error(`MongoDB Connection Error: ${err.message}`);
    });
};

module.exports = connectDatabase;