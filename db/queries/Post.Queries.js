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

const createPost = async (title, excerpt, content, tag, userId) => {
  const newPost = await prisma.posts.create({
    data: {
      title,
      excerpt,
      content,
      tag,
      userId,
    },
  });
  return newPost;
};

module.exports = { getPosts, getPost, createPost };
