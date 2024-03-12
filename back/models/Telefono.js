'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telefono extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Telefono.init({
    numero: DataTypes.STRING(20),
    extension: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:'telefonos',
    modelName: 'Telefono',
  });
  return Telefono;
};