const express = require("express");
const app = express();
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
// const prisma = require("./config/dbClient");

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});

app.use(errorHandler);

module.exports = app;
