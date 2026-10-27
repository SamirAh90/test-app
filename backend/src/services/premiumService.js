const User = require("../models/User");

const grantPremium = async (userId, { transaction = null } = {}) => {
  const user = await User.findByPk(userId, {
    transaction,
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isPremium) {
    return user;
  }

  await user.update(
    {
      isPremium: true,
    },
    {
      transaction,
    },
  );

  return user;
};

module.exports = {
  grantPremium,
};
