const jwt = require("jsonwebtoken");

const User = require("../models/User");

const optionalAuth = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.userId, {
      attributes: ["id", "firstName", "lastName", "email", "role", "isActive"],
    });

    if (!user || !user.isActive) {
      req.user = null;
      return next();
    }

    req.user = user;

    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

module.exports = optionalAuth;
