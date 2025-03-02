const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");

const userRouter = express.Router();

const USER_FIELDS = ["firstName", "lastName", "about", "skills"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_FIELDS);
    res.send(requests);
  } catch (err) {
    res.statusCode(400).send("Error reading requests" + err);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_FIELDS);
    const data  = connections.map((row) => row.fromUserId);
    res.send(data);
  } catch (err) {
    res.status(400).send("Error reading connections" + err);
  }
});

module.exports = userRouter;
