const prisma = require("../../config/dbClient");

const getUserByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  return user;
};

const createUser = async (username, email, password) => {
  const user = await prisma.users.create({
    data: {
      username,
      email,
      password,
    },
  });
  return user;
};

const getUserById = async (id) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  return user;
};

module.exports = { getUserByEmail, createUser, getUserById };
