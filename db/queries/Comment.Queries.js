const prisma = require("../../config/dbClient");

const getCommentsByPostId = async (postId) => {
  const comments = await prisma.comments.findMany({
    where: {
      postsId: postId,
    },
  });
  return comments;
};

const findPostById = async (postId) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
    },
  });
  return post;
};

const addComment = async (comment, userId, postId) => {
  const newComment = await prisma.comments.create({
    data: {
      comment,
      userId,
      postsId: postId,
    },
  });
  return newComment;
};

const findCommentById = async (commentId) => {
  const comment = await prisma.comments.findUnique({
    where: {
      id: commentId,
    },
  });
  return comment;
};

const deleteComment = async (commentId, postId) => {
  await prisma.comments.delete({
    where: {
      id: commentId,
      postsId: postId,
    },
  });
};

module.exports = {
  getCommentsByPostId,
  findPostById,
  addComment,
  findCommentById,
  deleteComment,
};
