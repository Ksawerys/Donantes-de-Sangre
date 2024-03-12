'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      mensaje: {
        type: Sequelize.STRING
      },
      galeriaPeticionID: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      idUsuarioRegistrado: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      idUsuarioAdministrador: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      leido : {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notificaciones');
  }
};