const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/Auth.Controllers");

// @route       POST /api/auth/register
// @Description Register new user
// @Access      Public
authRouter.post(
  "/register",
  authController.validateRegisterUser,
  authController.registerUser
);

// @route POST  /api/auth/login
// @Description Authenticate user
// @Access      Public

authRouter.post(
  "/login",
  authController.validateUserAuthentication,
  authController.loginUser
);

// @route POST  /api/auth/refresh
// @Description Generate new access token
// @Access      Private(Needs valid refresh token in cookie)

authRouter.post("/refresh", authController.refreshToken);

module.exports = authRouter;
