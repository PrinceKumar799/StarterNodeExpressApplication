const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const passwordUpdateController = (req, res) => {
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
};

module.exports = passwordUpdateController;
