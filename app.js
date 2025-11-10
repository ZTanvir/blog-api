const express = require("express");
const app = express();
require("dotenv").config();

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});

module.exports = app;
