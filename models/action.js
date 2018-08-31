const constants = require('../modules/constants');

module.exports = (sequelize, DataTypes) => {
  const Action = sequelize.define('Action', {
    action: {
      type: DataTypes.STRING,
      values: constants.ACTIONS,
    },
  }, {});
  Action.associate = function associate(models) {
    Action.belongsTo(models.User, { onDelete: 'CASCADE' });
  };
  return Action;
};
