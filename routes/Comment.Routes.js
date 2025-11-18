const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controller/Comment.Controllers");
// @route GET   /api/comments/post/:postId
// @description Get all comments of a post
// @access      Public

commentRouter.get("/post/:postId", commentController.getAllComments);

// @route       POST /api/comments/post/:postId
// @description Add comments to a post
// @access      Private (Only authenticated user can add comment to a post)
commentRouter.post(
  "/post/:postId",
  commentController.verifyComment,
  commentController.addComment
);

// @route       Delete /api/comments/post/:postId/comments/:commentId
// @description Delete a comment
// @access      Private (User have to be both authenticated and comment owner )
commentRouter.delete(
  "/post/:postId/comments/:commentId",
  commentController.deleteComment
);

module.exports = commentRouter;
