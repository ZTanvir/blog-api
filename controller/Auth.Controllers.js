const authQueries = require("../db/queries/Auth.Queries");
const { encryptedPassword, generateJwt } = require("../utils/authUtils");

const { body, validationResult } = require("express-validator");

const validateRegisterUser = [
  body("username").notEmpty().withMessage("Username is required.").trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom(async (value) => {
      // email address available
      if (value) {
        const user = await authQueries.getUserByEmail(value);
        if (user && user.email === value) {
          throw new Error("E-mail already in use.");
        }
      }
    })
    .trim(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 digit long.")
    .trim(),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password and confirm password must be same")
    .trim(),
];

const validateUserAuthentication = [
  body("email").notEmpty().withMessage("Email is required."),

  body("password").notEmpty().withMessage("Password is required."),
];

const registerUser = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
    const { username, email, password } = req.body;
    const hashPassword = await encryptedPassword(password);
    const user = await authQueries.createUser(username, email, hashPassword);

    // Create token
    const payload = { userId: user.id };
    const accessToken = await generateJwt(payload, "1m");
    const refreshToken = await generateJwt(payload, "30d");

    // Set refresh token HTTP-Only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({ errors: result.array() });
  }
  return res.status(200).json({ message: "Successful" });
};

module.exports = {
  registerUser,
  validateRegisterUser,
  loginUser,
  validateUserAuthentication,
};
