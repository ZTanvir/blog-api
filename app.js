const express = require("express");
const app = express();
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const postRouter = require("./routes/Post.Routes");
const commentRouter = require("./routes/Comment.Routes");
const authRouter = require("./routes/Auth.Routes");

app.use(express.json());

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

module.exports = app;
