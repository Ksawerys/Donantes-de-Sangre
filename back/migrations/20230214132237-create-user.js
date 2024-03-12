'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gSanguineo: {
        type: Sequelize.STRING(3),
        allowNull: true
      },
      passwd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      codRecPasswd: {
        type: Sequelize.STRING,
        allowNull: true
      },
      codSeguridad: {
        type: Sequelize.STRING,
        allowNull: false
      }, 
      dni: {
        type: Sequelize.STRING,
        allowNull: true
      },
      nDonante: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bloqueado: {
        type: Sequelize.TINYINT,
        allowNull: false
      },
      notificacion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};