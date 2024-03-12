'use strict'; 
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emails', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      emailVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      newsletterVerifiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      vKeyNewsletter: {
        type: Sequelize.STRING,
        allowNull: true
      },
      vKeyEmail: {
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('emails');
  }
};