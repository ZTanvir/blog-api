const express = require("express");
const postRoutes = express.Router();
const postControllers = require("../controller/Post.Controllers");

// @route       GET /api/posts
// @description Get all posts
// @access      Public
postRoutes.get("/", postControllers.getPosts);

// @route       GET /api/posts/id
// @description Get a single post
// @access      Public
module.exports = postRoutes;
