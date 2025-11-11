const prisma = require("../../config/dbClient");

const getPosts = async () => {
  const posts = await prisma.posts.findMany({
    where: {
      published: true,
    },
  });
  return posts;
};

const getPost = async (postId) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
      published: true,
    },
  });
  return post;
};

module.exports = { getPosts, getPost };
