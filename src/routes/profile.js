const express = require("express");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile, validateEditPassword } = require("../utils/validations");
const bcrypt = require("bcrypt");
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

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid updates");
    }
    const user = req.user;
    Object.keys(req.body).forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send(`${user.firstName} your profile has been updated successfully`);
  } catch (err) {
    res.status(400).send(err);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    validateEditPassword(req);
    const user = req.user;
    user.password = req.body.password;
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
    console.log(user.password);
    await user.save();
    res.send(`${user.firstName} your password updated successfully`);
  } catch (err) {
    res
      .status(400)
      .send("Error updating password. Please try again later.");
  }
}
);

module.exports = profileRouter;
