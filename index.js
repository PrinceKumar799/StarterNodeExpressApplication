const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateUser = require("./src/middleware/authenticateUser");
require("dotenv").config();
const userModel = require("./src/model/userModel");
const signupController = require("./src/controller/signupController");
const loginController = require("./src/controller/loginController");
const passwordUpdateController = require("./src/controller/passwordUpdateController");
const app = express();

app.use(express.json());

//connect to mongo DB
mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .catch((err) => console.log(err));

// read all the users
app.get("/", async (req, res) => {
  const data = await userModel.findOne({});
  console.log("data is:", data);
  res.send(data);
});

//create
app.post("/signup", signupController);

//login
app.post("/login", loginController);

//update
app.patch("/update", authenticateUser, async (req, res) => {
  const newPassword = req.body.password;
  const email = req.body.email;
  console.log(newPassword, email);
  bcrypt.hash(newPassword, 10, async (err, hashedPass) => {
    if (err) res.status(500).send("Internal Server Error");
    else {
      console.log("Password encrypted");
      await userModel
        .findOneAndUpdate(
          { email },
          {
            password: hashedPass,
          }
        )
        .catch((err) => console.log(err));
      res.status(200).send({ msg: "password" });
    }
  });
});

//delete
app.delete("/delete", authenticateUser, async (req, res) => {
  const email = req.body.email;
  //console.log(email);
  await userModel.deleteOne({ email });
  res.status(200).json({ msg: "deleted" });
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
