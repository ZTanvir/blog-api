const prisma = require("../../config/dbClient");

const getPosts = async (page) => {
  const postPerPage = 5;
  const skip = (page - 1) * postPerPage;

  const posts = await prisma.posts.findMany({
    where: {
      published: true,
    },

    include: {
      user: {
        select: {
          username: true,
          role: true,
        },
      },
    },
    take: postPerPage,
    skip,
    orderBy: {
      createdAt: "desc",
    },
  });
  return posts;
};

const totalPosts = async () => {
  const totalPost = await prisma.posts.count({
    where: {
      published: true,
    },
  });
  return totalPost;
};

const getAllUserPosts = async (userId) => {
  const posts = await prisma.posts.findMany({
    where: {
      userId,
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
  });

  return posts;
};

const getUnpublishUserPosts = async (userId) => {
  const posts = await prisma.posts.findMany({
    where: {
      userId,
      published: false,
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

const getAnyPost = async (postId) => {
  const post = await prisma.posts.findUnique({
    where: {
      id: postId,
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

const createPost = async (
  title,
  excerpt,
  content,
  tag,
  userId,
  published = false,
) => {
  const newPost = await prisma.posts.create({
    data: {
      title,
      excerpt,
      content,
      tag,
      userId,
      published,
    },
  });
  return newPost;
};

const updatePost = async (
  title,
  excerpt,
  content,
  tag,
  userId,
  postId,
  published,
) => {
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
      published,
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
      published: true,
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
  totalPosts,
  getPost,
  getAnyPost,
  createPost,
  updatePost,
  deletePost,
  findPostById,
  sortPostByDate,
  getAllUserPosts,
  getPublishUserPosts,
  getUnpublishUserPosts,
};
