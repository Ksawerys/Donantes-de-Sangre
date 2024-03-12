'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contenido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contenido.init({
    nombre: DataTypes.STRING,
    valor: DataTypes.STRING(5000)
  }, {
    sequelize,
    tableName: 'contenidos',
    modelName: 'Contenido',
  });
  return Contenido;
};