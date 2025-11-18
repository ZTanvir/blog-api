const commentQueries = require("../db/queries/Comment.Queries");

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

module.exports = { getAllComments };
