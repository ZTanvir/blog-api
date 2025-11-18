const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controller/Comment.Controllers");
// @route GET   /api/comments/post/:postId
// @description Get all comments of a post
// @access      Public

commentRouter.get("/post/:postId", commentController.getAllComments);

// @route       POST /api/comments/post/:postId
// @description Add comments to a post
// @access      Private (Only authenticated user can add comment to post)
commentRouter.post(
  "/post/:postId",
  commentController.verifyComment,
  commentController.addComment
);

module.exports = commentRouter;
