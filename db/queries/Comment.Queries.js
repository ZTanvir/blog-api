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

module.exports = { getCommentsByPostId, findPostById };
