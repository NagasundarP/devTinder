const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUp } = require("./utils/validations");
const bcrypt = require("bcrypt");

app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = new User({ ...req.body, password: passwordHash });

    await user.save();
    res.status(201).send("User created successfully");
    res.send(user);
  } catch (err) {
    res.status(400).send("Error creating the user");
  }
});

// login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.cookie("token", user._id);
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Error logging in");
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
