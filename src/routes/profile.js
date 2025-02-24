const express = require("express");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decoded = jwt.verify(token, "DEV@Tinder$790");

    const { userId } = decoded;
    const user = req.user;
    res.send("Reading cookie");
  } catch (err) {
    res.status(400).send("Error reading cookie");
  }
});

module.exports = profileRouter;
