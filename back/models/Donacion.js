'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Donacion.init({
    nDonante: DataTypes.BIGINT,
    gSanguineo: DataTypes.STRING(3),
    donacion: DataTypes.ENUM('sangre', 'plasma', 'órganos', 'médula'),
    fecha: DataTypes.DATE,
    genero: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Donacion',
    tableName: 'donaciones'
  });
  return Donacion;
};