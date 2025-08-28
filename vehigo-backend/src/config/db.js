const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("COnnecting")
  await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:");
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
