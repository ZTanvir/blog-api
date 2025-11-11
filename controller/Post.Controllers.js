const postQueries = require("../db/queries/Post.Queries");

const getPosts = async (req, res, next) => {
  try {
    const posts = await postQueries.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.stats(404);
    next(error);
  }
};

const getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const posts = await postQueries.getPost(postId);
    res.status(200).json(posts);
  } catch (error) {
    res.stats(404);
    next(error);
  }
};

module.exports = { getPosts, getPost };
