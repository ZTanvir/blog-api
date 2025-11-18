const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controller/Comment.Controllers");
// @route GET   /api/comments/post/:postId
// @description Get all comments of a post
// @access      Public

commentRouter.get("/post/:postId", commentController.getAllComments);

module.exports = commentRouter;
