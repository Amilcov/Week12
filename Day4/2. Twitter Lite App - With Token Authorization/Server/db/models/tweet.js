'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    message: {
      allowNull:false,
      type: DataTypes.STRING
    }
  }, {});
  Tweet.associate = function(models) {
    // associations can be defined here
    Tweet.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId"
    });

  };
  return Tweet;
};