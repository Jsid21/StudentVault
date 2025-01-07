const express = require('express')
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
// const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session"); // For session management
const User = require("./models/user.js");
const Post = require('./models/post.js');
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const userRoutes = require("./routes/userRoutes.js");
const apiRoutes = require("./routes/apiRoutes.js");
const cookieParser = require("cookie-parser");
// const isLoggedIn = require("./utils/middleware.js");
// const validateId = require("./utils/validateId.js");
const {checkClientHeader,validateId} = require("./utils/middleware.js");

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const app = express()
const port = process.env.PORT || 5000


const url = process.env.MONGODB_URL;


// middleswares - 
app.use(express.json());
app.use(cookieParser());

// Allow CORS with credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://studentvault.onrender.com"); // React app's URL
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const corsOptions = {
  origin: ["https://studentvault.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-client-id"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({
    // store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: true, // Only HTTPS in production
      sameSite: "none"
    },
}));


// for defining local variables
// app.use((req,res,next)=>{
//     res.locals.currUser = req.user;
//     next();
// });


// Middleware to pass flash messages to the frontend
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   next();
// });

const connectDB = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
    });
    
      console.log('Database is connected');
  } catch (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/",userRoutes);
app.use("/api",apiRoutes);

// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
  });


  // Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).json({ error: message });
  });

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
