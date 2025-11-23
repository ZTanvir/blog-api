const postQueries = require("../db/queries/Post.Queries");
const { body, validationResult } = require("express-validator");

const validateCreatePost = [
  body("title").notEmpty().withMessage("Title is required.").trim().escape(),
  body("excerpt")
    .notEmpty()
    .withMessage("Excerpt is required.")
    .trim()
    .escape(),
  body("content")
    .notEmpty()
    .withMessage("Content is required.")
    .trim()
    .escape(),
  body("tag")
    .notEmpty()
    .withMessage("Tag is required.")
    .isArray()
    .withMessage("Invalid tag format")
    .trim()
    .escape(),
];

const getPosts = async (req, res, next) => {
  try {
    const posts = await postQueries.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404);
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
    res.status(404);
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

      const post = await postQueries.findPostById(postId);
      if (!post) {
        throw new Error("Post not found.");
      }

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

const deletePost = async (req, res, next) => {
  try {
    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
      res.status(400);
      throw new Error("Invalid post id.");
    }

    const post = await postQueries.findPostById(postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found.");
    }

    await postQueries.deletePost(post.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  validateCreatePost,
};
