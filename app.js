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
const verifyRoles = require("./src/middleware/verifyRoles");
const { Admin } = require("./src/config/roles");
const roles = require("./src/config/roles");
const winston = require("winston");

const app = express();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});
app.use(express.json());

app.use((req, res, next) => {
  // Log request details
  logger.info({
    message: "Request received",
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    headers: req.headers,
  });

  // Log response details after sending the response
  res.on("finish", () => {
    logger.info({
      message: "Response sent",
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    });
  });

  next();
});

//connect to mongo DB
mongoose
  .connect("mongodb://127.0.0.1:27017/users")
  .catch((err) => console.log(err));

app.get(
  "/hello",
  //authenticateUser,
  // verifyRoles(roles.Admin),
  async (req, res) => {
    console.log("Route Hit");
    res.json({ msg: "Hello from authorized route" });
  }
);

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

//updatecl
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
      res.status(200).send({ msg: "password updated" });
    }
  });
});

//delete
app.delete(
  "/delete",
  authenticateUser,
  verifyRoles(roles.Admin),
  async (req, res) => {
    const email = req.body.email;
    //console.log(email);
    // await userModel.deleteOne({ email });
    res.status(200).json({ msg: "deleted" });
  }
);

module.exports = app;
