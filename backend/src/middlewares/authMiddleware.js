const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Du måste vara inloggad.",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Inloggningstoken saknas.",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decodedToken.userId, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Användaren finns inte längre.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Ditt konto är inaktiverat. Kontakta administratören.",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Din inloggning har gått ut. Logga in igen.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Inloggningstoken är ogiltig.",
      });
    }

    return res.status(401).json({
      message: "Ogiltig eller saknad inloggning.",
    });
  }
};

module.exports = authMiddleware;
