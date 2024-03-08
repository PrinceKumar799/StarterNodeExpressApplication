const userModel = require("../model/userModel");

const verifyRoles = (...allowedRoles) => {
  //   console.log("roles:", allowedRoles);
  //   return (req, res, next) => next();
  return (req, res, next) => {
    const dbRoles = [...allowedRoles] || []; // Default to empty array if roles not found
    const tokenRoles = req.roles || []; // Default to empty array if roles not found

    console.log("dbroles:", dbRoles, "email:", req.userEmail);
    console.log("tokenRoles", tokenRoles);

    if (allowedRoles.some((role) => tokenRoles.includes(role))) {
      // Check if all allowedRoles are present in tokenRoles
      next();
    } else {
      return res.sendStatus(401); // Unauthorized
    }
  };
};

module.exports = verifyRoles;
