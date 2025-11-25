const { verifyJwt } = require("../utils/authUtils");
const authQueries = require("../db/queries/Auth.Queries");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(401);
      throw new Error("Authorization header missing.");
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await verifyJwt(token);

    const user = await authQueries.getUserById(payload.userId);

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    req.user = userData;
    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    next(new Error("Not authorized,token failed"));
  }
};
module.exports = { authMiddleware };
