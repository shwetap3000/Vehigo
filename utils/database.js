const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const db = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Connected to database!"))
    .catch((err) => console.log("Failed connecting to db!", err.message));
};

module.exports = db;
