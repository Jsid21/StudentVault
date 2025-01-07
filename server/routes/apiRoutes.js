const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user.js");
const Post = require('../models/post.js');
const {checkClientHeader,validateId,authMiddleware} = require("../utils/middleware.js");
const ExpressError = require("../utils/ExpressError.js");
// below package for file uploading
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// for checking active session -
router.get('/checkSession',authMiddleware,(req, res) => {
  res.status(200).json({
    loggedIn: true,
    // message: "User is logged in",
    user: req.user.username, // Includes user details like id and username
  });
  });

// Get all posts
router.get("/posts", checkClientHeader, async (req, res, next) => {
    try {
      const posts = await Post.find({}).populate("owner", "username"); // Populate only the 'username' field
      res.status(200).json(posts);
    } catch (err) {
      next(new ExpressError("Failed to fetch posts", 500));
    }
  });

// fetching post details -
router.get("/posts/:id", checkClientHeader,async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id).populate("owner", "username");
      if (!post) {
        return res.status(404).send({message : "Post not found"});
      }
      res.status(200).json(post);
    } catch (err) {
    //   res.status(500).json({ message: "File fetch failed", error: err.message });
      next(new ExpressError("Failed to fetch post", 500));
    }
  });

// Request for uploading posts
router.post("/upload", checkClientHeader,authMiddleware ,upload.single("file"), async (req, res, next) => {
    try {
      const { title, description } = req.body;
      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({ message: "Title and description are required." });
      }
      // Create a new Post instance
      const newPost = new Post({
        title,
        description,
        owner: req.user ? req.user.id : null, // Associate with user if logged in
      });
      // If a file is uploaded, add its details to the post
      if (req.file) {
        newPost.file = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }
      
      await newPost.save();
      res.status(200).json({
        message: "Post uploaded successfully",
        post: newPost,
      });
  
    } catch (error) {
      console.error("Error uploading post:", error.message);
    //   res.status(500).json({ message: "File upload failed", error: error.message });
      next(new ExpressError("Failed to fetch post", 500));
    }
  });

// post delete DELETE request
router.delete("/posts/:id",checkClientHeader,(async (req, res, next) => {
    try {
      let { id } = req.params;
      await Post.findByIdAndDelete(id);
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.log("Error deleting post:", error.message);
      next(new ExpressError(`${error.message}`, 500));
    }
  }));

// PUT request for updating post
router.put("/posts/:id", checkClientHeader, upload.single("file"), async (req, res, next) => {
    try {
 
      const { id } = req.params;
      const { title, description } = req.body;
  
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      if (title) post.title = title;
      if (description) post.description = description;
  
      if (req.file) {
        post.file = {
          url: req.file.path,
          filename: req.file.filename,
        };
      }
  
      await post.save();
      res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
      console.log("Error updating post:", error.message);
      next(new ExpressError(`${error.message}`, 500));
    }
  });

//   fetching posts of concerned user
  router.get('/userposts', checkClientHeader, async (req, res) => {
    try {
      const { username } = req.query; // Accept username as a query parameter
  
      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }
  
      // Filter posts where the owner's username matches
      const posts = await Post.find({})
        .populate('owner', 'username') // Populate the owner field to access username
        .exec();
      const filteredPosts = posts.filter(
        (post) => post.owner?.username === username
      );
      if (filteredPosts.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
      // console.log(filteredPosts);
      
      res.status(200).json(filteredPosts);
    } catch (error) {
      console.log('Error fetching posts:', error.message);
      next(new ExpressError(`${error.message}`, 500));
    }
  });

  module.exports = router;
