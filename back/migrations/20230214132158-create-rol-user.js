'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rolUser', {
      idRol: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      },
      idUser: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rolUser');
  }
};