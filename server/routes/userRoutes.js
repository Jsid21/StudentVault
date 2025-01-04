const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");
const Post = require('../models/post.js');
const {checkClientHeader,validateId} = require("../utils/middleware.js");


// Signup route
router.post("/signup",checkClientHeader ,async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      await User.register(newUser, password);
      res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
      next(new ExpressError(err.message, 400)); // Pass error to global handler
    }
  });

  // Login route
  router.post(
    "/login",
    passport.authenticate("local"),
    (req, res) => {
      try{
      console.log("Logged-in user:", req.session.passport.user); // Check if req.user is populated
      res.status(200).json({ message: "Logged in successfully!" });
    }catch(err){
      console.log(err.message);
      // res.status(400).json({ message: "Failed to login" });
      next(new ExpressError(err.message, 401));
    }
  }
  );

// post request for logout
router.post("/logout",checkClientHeader ,(req, res, next) => {
req.logout((err) => {
    if (err) return next(new ExpressError("Logout failed", 500));
    res.status(200).json({ message: "User logged out successfully" });
});
});

  // Example in Node.js/Express
router.get('/profile',checkClientHeader ,async (req, res) => {
    try {
      const { username } = req.query; // Accept username as a query parameter
      const user = await User.findOne({ username }); // Replace with your DB query
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ email: user.email, password: user.password, username: user.username });
    } catch (error) {
    //   res.status(500).json({ error: 'Internal Server Error' });
      next(new ExpressError(error.message, 401));
    }
  });

  module.exports = router;