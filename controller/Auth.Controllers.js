const authQueries = require("../db/queries/Auth.Queries");
const {
  encryptedPassword,
  comparePassword,
  generateJwt,
  verifyJwt,
} = require("../utils/authUtils");

const { body, cookie, validationResult } = require("express-validator");

const validateRegisterUser = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .escape(),
  body("email")
    .trim()
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
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 digit long.")
    .escape(),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Password and confirm password must be same")
    .escape(),
];

const validateUserAuthentication = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .custom(async (value, { req }) => {
      if (value) {
        const user = await authQueries.getUserByEmail(value);
        //  no user with this email
        if (!user) {
          throw new Error("Invalid credential.");
        }
      }
    })
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .custom(async (value, { req }) => {
      const email = req.body.email;
      if (!email) {
        throw new Error("Invalid credential");
      }

      const user = await authQueries.getUserByEmail(email);
      if (!user) {
        throw new Error("Invalid credential");
      } else {
        const hashPassword = user.password;
        const isMatch = await comparePassword(value, hashPassword);
        // password don't match with store password
        if (!isMatch) {
          throw new Error("Invalid credential");
        }
      }
    })
    .escape(),
];

const validateAuthorAuthentication = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .custom(async (value, { req }) => {
      if (value) {
        const user = await authQueries.getUserByEmail(value);
        //  no user with this email
        if (!user) {
          throw new Error("Incorrect Email.");
        }
      }
    })
    .escape(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
    .custom(async (value, { req }) => {
      const email = req.body.email;
      if (!email) {
        throw new Error("Incorrect Password.");
      }

      const user = await authQueries.getUserByEmail(email);
      if (!user) {
        throw new Error("Incorrect Password.");
      } else {
        const hashPassword = user.password;
        const isMatch = await comparePassword(value, hashPassword);
        // password don't match with store password
        if (!isMatch) {
          throw new Error("Incorrect Password.");
        }
        const role = user.role;
        if (role !== "AUTHOR") {
          throw new Error("Author access only");
        }
      }
    })
    .escape(),
];

const validateRefreshToken = [
  cookie("refreshToken")
    .exists()
    .withMessage("No refresh token")
    .custom(async (value, { req }) => {
      const token = value;
      // throw a error automatically ,when token is invalid
      // "msg": "signature verification failed",
      const { payload } = await verifyJwt(token);

      const userId = payload.userId;
      const user = await authQueries.getUserById(userId);
      //  The user has the cookies, but the user account has been deleted.
      if (!user) {
        throw new Error("User not found");
      }
    }),
];

const registerUser = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  try {
    const { username, email, password, isAuthor } = req.body;
    const hashPassword = await encryptedPassword(password);
    const user = await authQueries.createUser(
      username,
      email,
      hashPassword,
      isAuthor,
    );

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
  const email = req.body.email;
  try {
    const user = await authQueries.getUserByEmail(email);
    const payload = { userId: user.id };

    const accessToken = await generateJwt(payload, "1m");
    const refreshToken = await generateJwt(payload, "30d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
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

const refreshToken = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({ errors: result.array() });
  }
  const token = req.cookies?.refreshToken;
  const { payload } = await verifyJwt(token);

  const userId = payload.userId;
  const user = await authQueries.getUserById(userId);

  const payloadData = { userId: user.id };
  const newAccessToken = await generateJwt(payloadData, "1m");

  res.status(200).json({
    accessToken: newAccessToken,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
};

const logoutUser = async (req, res, next) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully." });
};

module.exports = {
  registerUser,
  validateRegisterUser,
  loginUser,
  validateUserAuthentication,
  refreshToken,
  validateRefreshToken,
  validateAuthorAuthentication,
  logoutUser,
};
