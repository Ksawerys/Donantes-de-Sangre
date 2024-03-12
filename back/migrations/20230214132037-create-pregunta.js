'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('preguntas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      enunciado: {
        allowNull: false,
        type: Sequelize.STRING
      },
      titulo: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nombre_img: {
        allowNull: false,
        type: Sequelize.STRING
      },
      respuesta: {
        allowNull: false,
        type: Sequelize.INTEGER
      }, 
      solucion_problema: {
        allowNull: false,
        type: Sequelize.STRING(500)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('preguntas');
  }
};