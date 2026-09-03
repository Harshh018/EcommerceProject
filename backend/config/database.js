const mongoose = require("mongoose");

const connectDatabase = () => {
  // Hardcoded direct connection to your aoowl3r cluster
  const DB_URI = "mongodb+srv://harshgupta:Harsh12345@cluster0.aoowl3r.mongodb.net/Ecommerce?appName=Cluster0";

  mongoose
    .connect(DB_URI, {
      dbName: "Ecommerce",
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error(`MongoDB Connection Error: ${err.message}`);
    });
};

module.exports = connectDatabase;