const requireEditor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Du måste vara inloggad.",
    });
  }

  const allowedRoles = ["editor", "admin"];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: "Du har inte behörighet att hantera innehåll.",
    });
  }

  return next();
};

module.exports = requireEditor;
