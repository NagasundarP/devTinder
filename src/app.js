const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUp } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

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
      const token = await jwt.sign(
        {
          userId: user._id,
        },
        ""
      );

      console.log(token);

      res.cookie("token", token);
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Error logging in");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const {token} = cookies;
    const decoded = jwt.verify(token, "");
    console.log(decoded);
    const {userId} = decoded;
    const user = await User.findById(userId);
    console.log(user)
    console.log("The logged in user is", userId); 
    res.send("Reading cookie");
  } catch (err) {
    res.status(400).send("Error reading cookie");
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
