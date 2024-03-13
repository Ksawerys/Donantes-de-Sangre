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

    const enlaces = [
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755562_395.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755596_908.jpg',
    ]

    for (let i = 0; i < enlaces.length; i++) {
      await queryInterface.bulkInsert('galerias', [{
        nombre: enlaces[i],
        descripcion: null,
        propietario: 1
      }])
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
