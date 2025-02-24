const valiator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("All fields are required");
  }
  if (firstName.length < 3) {
    throw new Error("First name should be atleast 3 characters long");
  }
  if (!valiator.isEmail(emailId)) {
    throw new Error("Email is invalid");
  }
  if (!valiator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};


const validateEditProfile = (req) => {
  const allowedEdits = ["firstName", "lastName","gender", "emailId", "age", "photoUrl", "skills"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) => allowedEdits.includes(update));

  return isValidOperation
}

module.exports = { validateSignUp, validateEditProfile };