const postQueries = require("../db/queries/Post.Queries");
const { body, validationResult } = require("express-validator");

const validateCreatePost = [
  body("title").trim().notEmpty().withMessage("Title is required.").escape(),
  body("excerpt")
    .notEmpty()
    .withMessage("Excerpt is required.")
    .trim()
    .escape(),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required.")
    .escape(),
  body("tag")
    .trim()
    .notEmpty()
    .withMessage("Tag is required.")
    .isArray()
    .withMessage("Invalid tag format")
    .escape(),
];

const getPosts = async (req, res, next) => {
  try {
    const { sort, order, limit } = req.query;

    if (sort && order && limit) {
      const posts = await postQueries.sortPostByDate(Number(limit), order);
      return res.status(200).json(posts);
    }

    const posts = await postQueries.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

const getUserPosts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { userId } = req.params;
    if (status === "all") {
      const posts = await postQueries.getUserPosts(Number(userId));
      return res.status(200).json(posts);
    } else if (status == "published") {
    } else if (status == "unpublish") {
    }
    return res.status(200).json([]);
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
      let { title, excerpt, content, tag } = req.body;
      const userId = req.user?.id;

      const newPost = await postQueries.createPost(
        title,
        excerpt,
        content,
        tag,
        userId,
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

      const { title, excerpt, content, tag } = req.body;
      const userId = req.user?.id;

      const post = await postQueries.findPostById(postId);
      if (!post) {
        throw new Error("Post not found.");
      }

      if (post.userId !== userId) {
        res.status(401);
        throw new Error(
          "Permission denied .User are not the owner of the post.",
        );
      }

      const newPost = await postQueries.updatePost(
        title,
        excerpt,
        content,
        tag,
        userId,
        postId,
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
    const userId = req.user?.id;

    if (post.userId !== userId) {
      res.status(401);
      throw new Error("Permission denied .User are not the owner of the post.");
    }

    await postQueries.deletePost(post.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getUserPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
  validateCreatePost,
};
