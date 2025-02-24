const express = require("express");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");

const requestsRouter = express.Router();

requestsRouter.use(express.json());
requestsRouter.use(cookieParser());

requestsRouter.post("/createConnectionReq", userAuth, (req, res) => {
  const user = req.user;

  console.log("Request sent successfully");

  res.send(user.firstName + "Connection request sent successfully");
});

module.exports = requestsRouter;
