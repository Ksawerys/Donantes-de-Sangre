'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('direcciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lugar: {
        type: Sequelize.STRING
      },
      calle: {
        allowNull: false,
        type: Sequelize.STRING
      },
      numero: {
        type: Sequelize.TINYINT(3)
      },
      ciudad: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      provincia: {
        allowNull: false,
        type: Sequelize.STRING
      },
      urlMapa: {
        type: Sequelize.TEXT
      },
      cp: {
        allowNull: false,
        type: Sequelize.SMALLINT(5)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('direcciones');
  }
};