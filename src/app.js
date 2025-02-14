const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send("Error creating the user");
  }
});

// find user by emailId
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error getting user");
  }
});

// feed api get all users from the db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Error getting users");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Error deleting user");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndUpdate(userId, req.body, {
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }
  } catch (err) {
    res.status(400).send("Error updating user");
  }
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
