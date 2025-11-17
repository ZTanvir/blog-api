const postQueries = require("../db/queries/Post.Queries");
const { body, validationResult } = require("express-validator");

const validateCreatePost = [
  body("title").notEmpty().withMessage("Please enter title.").trim().escape(),
  body("excerpt")
    .notEmpty()
    .withMessage("Please enter excerpt.")
    .trim()
    .escape(),
  body("content")
    .notEmpty()
    .withMessage("Please enter content.")
    .trim()
    .escape(),
  body("tag").notEmpty().withMessage("Please enter tag.").trim().escape(),
];

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

const createPost = async (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    let { title, excerpt, content, tag, userId } = req.body;
    userId = Number(userId);
    try {
      const newPost = await postQueries.createPost(
        title,
        excerpt,
        content,
        tag,
        userId
      );
      return res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }
  res.status(400).json({ errors: result.array() });
};

module.exports = { getPosts, getPost, createPost, validateCreatePost };
