const commentQueries = require("../db/queries/Comment.Queries");
const { body, validationResult } = require("express-validator");

const verifyComment = [
  body("comment")
    .notEmpty()
    .withMessage("Comment is required")
    .isLength({ min: 20, max: 1500 })
    .withMessage("Comment must be between 20 and 1500 character long")
    .trim()
    .escape(),
];

const getAllComments = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
      res.status(401);
      throw new Error("Invalid post id.");
    }

    const post = await commentQueries.findPostById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found.");
    }

    const comments = await commentQueries.getCommentsByPostId(postId);

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const addComment = async (req, res, next) => {
  const result = validationResult(req);
  console.log("result", result);
  if (result.isEmpty()) {
    try {
      const comment = req.body.comment;
      const userId = 1; //todo change when add user auth
      const postId = Number(req.params.postId);
      if (isNaN(postId)) {
        res.status(401);
        throw new Error("Invalid post id.");
      }

      const post = await commentQueries.findPostById(postId);
      if (!post) {
        res.status(404);
        throw new Error("Post not found.");
      }

      const newComment = await commentQueries.addComment(
        comment,
        userId,
        postId
      );

      res.status(201).json({ message: "Comment added successfully." });
    } catch (error) {
      console.log(error);
      next(error);
    }
  } else {
    res.status(401).send(result.array());
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const userId = 1; //todo update when authentication added
    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
      res.status(401);
      throw new Error("Invalid post id.");
    }

    const post = await commentQueries.findPostById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found.");
    }

    const commentId = Number(req.params.commentId);
    if (isNaN(commentId)) {
      res.status(401);
      throw new Error("Invalid comment id.");
    }
    const comment = await commentQueries.findCommentById(commentId);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found.");
    }

    await commentQueries.deleteComment(commentId, userId, postId);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getAllComments, addComment, deleteComment, verifyComment };
