'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiasHoras extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DiasHoras.init({
    codDia: DataTypes.CHAR,
    hora: DataTypes.TIME
  }, {
    sequelize,
    tableName: 'diashoras',
    modelName: 'DiaHora',
  });
  return DiasHoras;
};