const jwt = require("jsonwebtoken");
const authenticateUser = (req, res, next) => {
  //check token
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  // console.log(token);
  if (token) {
    try {
      const user = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      // console.log("authenticated", user);
      if (!user) return res.status(401).end();
      const email = user.userInfo.email;
      const roles = user.userInfo.roles;
      if (!email || !roles) throw new Error();
      req.userEmail = email;
      req.roles = roles;
      next();
    } catch (error) {
      //casan
      res.status(401).end();
    }
  } else res.status(404).end();
};

module.exports = authenticateUser;
