"use strict";

const { hash } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        email: "user1@gmail.com",
        password: "usergmail1",
      },
      {
        email: "user2@gmail.com",
        password: "usergmail2",
      },
      {
        email: "user3@gmail.com",
        password: "usergmail3",
      },
      {
        email: "user4@gmail.com",
        password: "usergmail4",
      },
    ];

    const user = data.map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = hash(el.password);
      return el;
    });

    await queryInterface.bulkInsert('Users', user)
  },

  async down(queryInterface, Sequelize) {
   await queryInterface.bulkDelete('Users', null, {})
  },
};
