'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: { 
     allowNull: false,
     type: DataTypes.STRING(50)
    },
    lastName:  {
     allowNull: false,
     type: DataTypes.STRING(50)
    },
    emailAddress: {
     allowNull: false,
     type: DataTypes.STRING(255),
     unique: true
    },
    hashedPassword:{ 
     allowNull: false,
     type: DataTypes.STRING.BINARY
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.AttractionVisit, {
       as: 'visits',
       foreignKey: 'userId'
    })
  };
  return User;
};