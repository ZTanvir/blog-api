const authQueries = require("../db/queries/Auth.Queries");

const { body, validationResult } = require("express-validator");

const validateRegisterUser = [
  body("username").notEmpty().withMessage("Username is require."),

  body("email")
    .notEmpty()
    .withMessage("Email is require.")
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
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 digit long."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password and confirm password must be same"),
];

const registerUser = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
  res.status(200);
};

module.exports = { registerUser, validateRegisterUser };
