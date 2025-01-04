const mongoose = require("mongoose");
const initData = require("./data.js");
const post = require("../models/post.js");
require('dotenv').config({path:"../.env"});


const uri = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
      await mongoose.connect(uri, {
         
      });
      console.log('Database is connected');
      initDB();
  } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
  }
};
connectDB();

async function initDB() {
    try {
        await post.deleteMany({});
        initData.data = initData.data.map((obj) => ({ ...obj, owner: "6779445ba66a7b213f6e6ab1" }));
        await post.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Failed to initialize data", err);
    }
}