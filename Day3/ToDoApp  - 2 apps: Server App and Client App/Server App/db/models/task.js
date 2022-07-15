'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
  };
  return Task;
};