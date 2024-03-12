'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Galeria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Galeria.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING(50),
    propietario: DataTypes.INTEGER
  }, {
    sequelize,
    tableName: 'galerias',
    modelName: 'Galeria',
    timestamps: true,
  });
  return Galeria;
};