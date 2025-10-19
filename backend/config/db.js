const mongoose = require('mongoose');
require('colors');
require('dotenv').config();

const connectDB = async () => {
  try {
    console.log("🌍 Connecting to MongoDB...");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`.red.bold);

    // Instead of crashing, retry connection after 10 seconds
    setTimeout(connectDB, 10000);
  }
};

module.exports = connectDB;
