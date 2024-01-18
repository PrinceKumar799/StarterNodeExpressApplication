const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAcessTokens = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "1d",
  });
};

const loginController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await userModel.findOne({ email: email });
  const payload = {
    email: user.email,
    password: user.password,
  };
  //console.log(typeof user);
  //console.log(user.email, user.password);
  bcrypt.compare(password, user.password, async (err, matched) => {
    if (err) {
      res.send("Invalid User");
    } else {
      //console.log(password, user.password);
      const accessToken = generateAcessTokens(payload);
      const refreshToken = jwt.sign(payload, process.env.REFERSH_TOKEN_KEY, {
        expiresIn: "1d",
      });
      await userModel.findOneAndUpdate({ email }, { refreshToken });
      res.json({ accessToken, refreshToken });
    }
  });
};

module.exports = loginController;
