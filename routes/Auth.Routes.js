const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/Auth.Controllers");

// @route       POST /api/auth/register
// @Description Register new user as user
// @Access      Public
authRouter.post(
  "/register",
  authController.validateRegisterUser,
  authController.registerUser
);

module.exports = authRouter;
