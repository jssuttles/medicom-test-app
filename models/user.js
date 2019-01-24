const path = require('path');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    profilePic: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('profilePic')
          ? path.resolve('profilePics', this.getDataValue('profilePic'))
          : null;
      },
    },
  }, {});
  User.associate = function associate(models) {
    User.hasMany(models.Action);
  };
  return User;
};
