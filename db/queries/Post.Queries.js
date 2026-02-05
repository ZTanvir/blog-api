const prisma = require("../../config/dbClient");

const getPosts = async () => {
  const posts = await prisma.posts.findMany({
    where: {
      published: false,
    },

    include: {
      user: {
        select: {
          username: true,
          role: true,
        },
      },
    },
  });
  return posts;
};

const getAllUserPosts = async (userId) => {
  const posts = await prisma.posts.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      published: true,
    },
  });

  return posts;
};

const getPublishUserPosts = async (userId) => {
  const posts = await prisma.posts.findMany({
    where: {
      userId,
      published: true,
    },
    select: {
      id: true,
      title: true,
      published: true,
    },
  });

  return posts;
};

const getUnpublishUserPosts = async (userId) => {
  const posts = await prisma.posts.findMany({
    where: {
      userId,
      published: false,
    },
    select: {
      id: true,
      title: true,
      published: true,
    },
  });

  return posts;
};

const getPost = async (postId) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
      published: false,
    },
    include: {
      user: {
        select: {
          username: true,
          role: true,
        },
      },
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

const updatePost = async (title, excerpt, content, tag, userId, postId) => {
  const newPost = await prisma.posts.update({
    where: {
      id: postId,
    },
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

const deletePost = async (postId) => {
  const deletePost = await prisma.posts.delete({
    where: {
      id: postId,
    },
  });
  return deletePost;
};

const findPostById = async (postId) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
    },
  });
  return post;
};

const sortPostByDate = async (limit = 6, order = "desc" | "asc") => {
  const latestPost = await prisma.posts.findMany({
    take: limit,
    where: {
      published: false,
    },
    orderBy: [
      {
        createdAt: order,
      },
    ],
    include: {
      user: {
        select: {
          username: true,
          role: true,
        },
      },
    },
  });
  return latestPost;
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  findPostById,
  sortPostByDate,
  getAllUserPosts,
  getPublishUserPosts,
  getUnpublishUserPosts,
};
