'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('noticias', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      titulo: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      subtitulo: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      contenido: {
        type: Sequelize.STRING(65000),
        allowNull: false
      },
      seccion: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('noticias');
  }
};