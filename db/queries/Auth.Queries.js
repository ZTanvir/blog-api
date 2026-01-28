const prisma = require("../../config/dbClient");
const { Role } = require("@prisma/client");

const getUserByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  return user;
};

const createUser = async (username, email, password, isAuthor) => {
  const setRole = isAuthor ? Role.AUTHOR : Role.USER;
  const user = await prisma.users.create({
    data: {
      username,
      email,
      password,
      role: setRole,
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
