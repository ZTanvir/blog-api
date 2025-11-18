const express = require("express");
const postRouter = express.Router();
const postControllers = require("../controller/Post.Controllers");

// @route       GET /api/posts
// @description Get all posts
// @access      Public
postRouter.get("/", postControllers.getPosts);

// @route       GET /api/posts/id
// @description Get a single post
// @access      Public
postRouter.get("/:postId", postControllers.getPost);

// @route       POST /api/posts
// @description Create a new post
// @access      Private(User have to logged in)

postRouter.post(
  "/",
  postControllers.validateCreatePost,
  postControllers.createPost
);

// @route          PUT /api/posts/id
// @description    Edit a post
// @access         Private (User have to logged in)
postRouter.put(
  "/:postId",
  postControllers.validateCreatePost,
  postControllers.editPost
);

// @route       DELETE /api/posts/id
// @description Delete a post
// @access      Private (User have to logged in)
postRouter.delete("/:postId", postControllers.deletePost);

module.exports = postRouter;
