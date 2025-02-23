const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token not found");
    }

    const decodedObj = jwt.verify(token, "DEV@Tinder$790");

    const { userId } = decodedObj;

    const user = await User.findById(userId);

    req.user = user;

    if (!user) {
      return res.status(401).send("Unauthorized user");
    }
    next();
  } catch (err) {
    res.status(401).send("Unauthorized user");
  }
};

module.exports = { userAuth };
