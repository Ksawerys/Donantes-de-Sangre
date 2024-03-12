'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Memoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Memoria.init({
    anio: DataTypes.INTEGER,
    imagen: DataTypes.STRING,
    documento: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Memoria',
    tableName: 'memorias'
  });
  return Memoria;
};