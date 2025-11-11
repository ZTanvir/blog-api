const express = require("express");
const app = express();
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const postRoutes = require("./routes/Post.Routes");

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});
app.use("/api/posts", postRoutes);

app.use(errorHandler);

module.exports = app;
