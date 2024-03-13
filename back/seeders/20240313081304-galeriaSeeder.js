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
      'https://www.donantespllno.es/Contenido/2017/PAN2017_3_Despues%20de%20sociedad.JPGhttps://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755631_433.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755670_422.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755701_418.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755784_329.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755842_937.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755891_537.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755931_403.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337755966_990.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756006_532.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756036_232.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756070_739.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756161_448.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756194_984.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756226_521.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756258_221.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756298_888.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756333_852.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756366_316.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756396_206.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756430_270.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756463_632.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Visita%20al%20centro%20de%20Transfusiones%20de%20CR/img_1337756497_385.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0000.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0010.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0012.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0020.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0033.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0034.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0035.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0036.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0037.jpg',
      'https://www.donantespllno.es/Contenido/Galerias/Dia%20Mundial%20del%20Donante%202022/IMG-20220614-WA0043.jpg',
      'https://www.donantespllno.es/Contenido/2018/3Jornadas02.jpg',
      'https://www.donantespllno.es/Contenido/2018/3Jornadas04.jpg',
      'https://www.donantespllno.es/Contenido/2018/3Jornadas_Clausura.jpg',
      'https://www.donantespllno.es/Contenido/2018/3Jornadas03.jpg',
      'https://www.donantespllno.es/Contenido/2018/medula2018a_Dia%20mundial%20del%20donante.jpg',
      'https://www.donantespllno.es/Contenido/2018/fisiovital2018_1.jpg',
      'https://www.donantespllno.es/Contenido/2018/Diamundial2018_1.jpg',
      'https://www.donantespllno.es/Contenido/2018/Diamundial2018_2.jpg',
      'https://www.donantespllno.es/Contenido/2018/repsol2018_Despues%20de%20jornada%20solidaria.png',
      'https://www.donantespllno.es/Contenido/2018/Ayunt2018_Donacion%20en%20el%20ayuntamiento.jpg',
      'https://www.donantespllno.es/Contenido/2018/Convenio2018a.jpg',
      'https://www.donantespllno.es/Contenido/2018/ICampVirgenDolores.JPG',
      'https://www.donantespllno.es/Contenido/2017/PAN2017_1_Despues%20de%20nuevos.JPG',
      'https://www.donantespllno.es/Contenido/2017/PAN2017_2_Despues%20de%20nuevos.JPG',
      'https://www.donantespllno.es/Contenido/2017/PAN2017_4_Despues%20de%20gran%20acogida.JPG'
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
