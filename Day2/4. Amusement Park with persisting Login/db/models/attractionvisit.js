'use strict';
module.exports = (sequelize, DataTypes) => {
  const AttractionVisit = sequelize.define('AttractionVisit', {
    visitedOn: {
      allowNull: false,
      type: DataTypes.DATEONLY
    },
    raiting: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    comments: {
      type: DataTypes.STRING
    }
  }, {});
  AttractionVisit.associate = function(models) {
    // associations can be defined here
    AttractionVisit.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
    });

    AttractionVisit.belongsTo(models.Attraction, {
      as: 'attraction',
      foreignKey: 'attractionId',
    });

  };
  return AttractionVisit;
};