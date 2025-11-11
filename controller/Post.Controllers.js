const postQueries = require("../db/queries/Post.Queries");

const getPosts = async (req, res, next) => {
  try {
    const posts = await postQueries.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.stats(400);
    next(error);
  }
};

module.exports = { getPosts };
