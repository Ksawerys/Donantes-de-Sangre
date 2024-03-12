'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cancion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cancion.init({
    nombre: DataTypes.STRING,
    titulo: DataTypes.STRING,
    letra: DataTypes.STRING(10000),
  }, {
    sequelize,
    tableName: 'canciones',
    modelName: 'Cancion',
  });
  return Cancion;
};