'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const start = new Date('2000-01-01 12:12:12').getTime();
    const end = new Date('2023-12-30 12:12:12').getTime();

    for (let i = 0; i < 500; i++) {
      await queryInterface.bulkInsert('altas', [{
        createdAt: new Date(('2021-01-01 12:12:12').toLocaleString()),
        updatedAt: new Date(('2021-01-01 12:12:12').toLocaleString()),
        fecha: new Date(start + Math.random() * (end - start))
      }], {});
    }   
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
