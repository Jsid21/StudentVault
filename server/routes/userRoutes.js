const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const Post = require('../models/post.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {checkClientHeader,validateId,authMiddleware} = require("../utils/middleware.js");


// Signup endpoint
router.post("/signup",checkClientHeader ,async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({username});
  console.log(existingUser);
  
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  User.create({ username, email, password: hashedPassword });
  res.status(201).json({ message: "User registered successfully" });
});
  // Login route
router.post("/login",checkClientHeader, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "168h" }
    );

    // Send the token as an HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      // secure: false, // Set to true if using HTTPS
      // sameSite: "strict", // Prevent CSRF attacks
      maxAge: 3600000 *24 * 7, // 1 hour
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// post request for logout
// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
  });
  res.status(200).json({ message: "Logged out successfully" });
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