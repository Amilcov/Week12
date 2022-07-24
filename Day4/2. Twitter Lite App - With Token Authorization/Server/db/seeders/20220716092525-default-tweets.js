'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    const users = await queryInterface.bulkInsert("Users", [
        { username: 'ana',
          email: 'ana@y.com',
          hashedPassword: bcrypt.hashSync('ana'),
          createdAt: new Date(),
          updatedAt: new Date()
        },

        { username: 'adri',
          email: 'adr@y.com',
          hashedPassword: bcrypt.hashSync('adri'),
          createdAt: new Date(),
          updatedAt: new Date()
        },

    ], { returning: true });

     return queryInterface.bulkInsert("Tweets", [
        {
          message: "The Martian was awesome!",
          userId: users[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          message: "Has anyone seen Ready Player One?",
          userId: users[1].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          message: "Harry Potter and the Sorcerer's Stone is the best out of all seven HP books :).",
          userId: users[0].id,  
          createdAt: new Date(),
          updatedAt: new Date(),
        },
         {
          message: 'Ana are mere',
          userId: users[0].id,  
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          message: 'Ana are pere',
          userId: users[0].id,  
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          message: 'Adri are trotineta',
          userId: users[1].id,  
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});
  
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tweets", null, {});
    return queryInterface.bulkDelete("Users", null, {});
  }
};
