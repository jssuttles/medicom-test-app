const path = require('path');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    profilePic: {
      type: DataTypes.STRING,
      get() {
        return this.profilePic ?
          path.resolve('profilePics', this.profilePic) :
          null;
      },
    },
  }, {});
  User.associate = function associate(models) {
    User.hasMany(models.Action);
  };
  return User;
};
