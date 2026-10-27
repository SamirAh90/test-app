const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Du måste vara inloggad.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Endast administratörer har åtkomst.",
    });
  }

  return next();
};

module.exports = requireAdmin;
