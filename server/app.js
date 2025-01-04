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
const port = 3000

const url = process.env.MONGODB_URL;


// middleswares - 
app.use(express.json());

// Allow CORS with credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173", "https://student-vault.vercel.app/"); // React app's URL
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const corsOptions = {
    origin: "https://student-vault.vercel.app/", // React app's URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization","x-client-id"],
    credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// restrict unauthorized calls
// const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);


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
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    }
}
app.use(session(sessionOptions));

// library imported middlewares for password saving in database
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
// const client = new MongoClient(url, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });


// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);
// async function connectToDatabase() {
//     try {
//         await mongoose.connect(uri,clientOptions,{
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log("Successfully connected to local MongoDB!");
//     } catch (err) {
//         console.error("Error connecting to local MongoDB:", err);
//     }
// }

// // Call the database connection function
// connectToDatabase();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/",userRoutes);
app.use("/api",apiRoutes);

// async function main() {
//   try {
//       await mongoose.connect(uri, {
//           serverSelectionTimeoutMS: 5000,
//           socketTimeoutMS: 45000,
//       });
//       console.log("Connected to database");
//   } catch (err) {
//       console.error("Failed to connect to the database", err);
//   }
// }

// main().catch(err => console.log(err));
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