const prisma = require("../../config/dbClient");

const getPosts = async () => {
  const posts = await prisma.users.findMany({});
  return posts;
};

module.exports = { getPosts };
