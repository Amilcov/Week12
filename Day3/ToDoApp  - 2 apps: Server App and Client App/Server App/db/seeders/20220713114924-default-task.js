'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert("Tasks", [
    {
      name: "Running in the Park",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Study Data Structures",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: "Cook delicios meal",
      createdAt: new Date(),
      updatedAt: new Date()
    },
   ],{});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tasks", null, {});
  }
};
