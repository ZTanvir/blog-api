const prisma = require("../../config/dbClient");

const getUserByEmail = async (email) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });
  return user;
};

module.exports = { getUserByEmail };
