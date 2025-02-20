const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUp } = require("./utils/validations");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

// signup api
app.post("/signup", async (req, res) => {
  try {
    validateSignUp(req);

    const { password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

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
        "",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      res.send("Login successful");
    }
  } catch (err) {
    res.status(400).send("Error logging in");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decoded = jwt.verify(token, "");

    const { userId } = decoded;
    const user = req.user;
    res.send("Reading cookie");
  } catch (err) {
    res.status(400).send("Error reading cookie");
  }
});

app.post("/createConnectionReq", userAuth, (req, res) => {
  const user = req.user;

  console.log("Request sent successfully");

  res.send(user.firstName + "Connection request sent successfully");
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
