const jwt = require("jsonwebtoken");
const express = require("express");
const userRouter = express.Router();
require("dotenv").config();

userRouter.get("/login", (req, res) => {
  try {
    let { username, password } = req.body;
    if (username === "naval.ravikant" && password === "05111974") {
      // generating token for authentication
      let token = jwt.sign({}, process.env.JWT_SECRET);
      if (token) {
        res.status(200).send({ JWT: token });
      } else {
        res.send({ error: "Unable to generate token" });
      }
    } else {
      res.send({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.send({ error: error });
  }
});

module.exports = {
  userRouter,
};
