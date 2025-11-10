const express = require("express");
const app = express();
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");

app.get("/", (req, res, next) => {
  throw new Error("Invalid request");

  res.status(200).json({ message: "Server is running" });
});

app.use(errorHandler);

module.exports = app;
