const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const signupController = (req, res) => {
  const { email, password } = req.body;

  //check if user already exists
  userModel
    .exists({ email: email })
    .then((result) => {
      if (result)
        return res.status(401).json({ message: "User already exists" }).end();
    })
    .catch((err) => console.log(err));

  bcrypt.hash(password, 10, (err, hashedPass) => {
    if (err) res.status(500).send("Internal Server Error");
    else {
      const user = new userModel({
        email,
        password: hashedPass,
      });
      //console.log(users.at(users.length - 1));
      user
        .save()
        .then(() => {
          res.json({ "message ": "Registerd Successfully" });
        })
        .catch((err) => console.log(err));
    }
  });
};
module.exports = signupController;
