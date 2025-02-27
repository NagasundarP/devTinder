const express = require("express");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const requestsRouter = express.Router();

requestsRouter.use(express.json());
requestsRouter.use(cookieParser());

requestsRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      const toUser = await User.findOne({ _id: toUserId });
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      //check if there is existing request
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          message: "Request already exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " is intrested in " + toUser.firstName,
        data: data,
      });
    } catch (err) {
      res.send(err);
    }
  }
);

requestsRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(req.params.status)) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: req.params.requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({
          message: "Request not found",
        });
      }
      connectionRequest.status = req.params.status;
      const data = await connectionRequest.save();
      res.json({
        message: "Request reviewed successfully",
        data,
      });
    } catch (err) {
      res.send(err);
    }
  }
);

module.exports = requestsRouter;
