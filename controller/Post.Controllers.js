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
  try {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
      res.status(400);
      throw new Error("Invalid post id.");
    }
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
    try {
      let { title, excerpt, content, tag, userId } = req.body;
      userId = Number(userId);

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
  } else {
    res.status(400).json({ errors: result.array() });
  }
};

const editPost = async (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    try {
      const postId = Number(req.params.postId);
      if (isNaN(postId)) {
        res.status(400);
        throw new Error("Invalid post id.");
      }

      const { title, excerpt, content, tag, userId } = req.body;
      updatedUserId = Number(userId);

      const newPost = await postQueries.updatePost(
        title,
        excerpt,
        content,
        tag,
        updatedUserId,
        postId
      );

      return res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ errors: result.array() });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  editPost,
  validateCreatePost,
};
