'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Direccion.init({
    lugar: DataTypes.STRING,
    calle: DataTypes.STRING,
    numero: DataTypes.TINYINT(3),
    ciudad: DataTypes.STRING,
    provincia: DataTypes.STRING,
    urlMapa: DataTypes.TEXT,
    cp: DataTypes.SMALLINT(5)
  }, {
    sequelize,
    tableName: 'direcciones',
    modelName: 'Direccion',
  });
  return Direccion;
};