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
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const userRoutes = require("./routes/userRoutes.js");
const apiRoutes = require("./routes/apiRoutes.js");
// const isLoggedIn = require("./utils/middleware.js");
// const validateId = require("./utils/validateId.js");
const {checkClientHeader,validateId} = require("./utils/middleware.js");

if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const app = express()
const port = 4000


const url = process.env.MONGODB_URL;


// middleswares - 
app.use(express.json());

// Allow CORS with credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://student-vault.vercel.app/"); // React app's URL
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const corsOptions = {
  origin: ["https://student-vault.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-client-id"],
  credentials: true
};
app.use(cors(corsOptions));

// to store all session details on mongodb
const store = MongoStore.create({
    mongoUrl: url ,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
});
store.on("error",()=>{
    console.log("error in mongodb session store",err);
});


// Express session setup
// const sessionOptions = {
//     store,
//     secret : process.env.SECRET,
//     resave:false,
//     saveUninitialized:true,
//     cookie:{
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge : 7 * 24 * 60 * 60 * 1000,
//         httpOnly :true
//     }
// }
app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only HTTPS in production
    },
}));

// library imported middlewares for password saving in database
app.use(passport.initialize());
app.use(passport.session());
// Use local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user.id); // Store the user ID in the session
});
passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await User.findById(id);
    console.log("Found user:", user);
    done(null, user);
  } catch (err) {
    console.error("Error deserializing user:", err);
    done(err);
  }
});


// for defining local variables
app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    next();
});

// Use connect-flash
app.use(flash());

// Middleware to pass flash messages to the frontend
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

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