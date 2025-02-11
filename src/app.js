const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Naga",
    lastName: "Sun",
    emailId: "naga@gmail.com",
    password: "password",
  });
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send("Error creating the user");
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
