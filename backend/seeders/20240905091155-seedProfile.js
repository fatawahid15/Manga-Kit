'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        username: "user1",
        UserId: 1,
      },
      {
        username: "user2",
        UserId: 2,
      },{
        username: "user3",
        UserId: 3,
      },{
        username: "user4",
        UserId: 4,
      },
    ];

    const profile = data.map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert('Profiles', profile)
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete('Profiles' , null, {})
  }
};
