'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Horario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.DiaHora, {as: 'DiaHora', foreignKey: 'codDia'});
    }
  }
  Horario.init({
    dia: DataTypes.STRING,
    codDia: DataTypes.CHAR,
    hEntrada: DataTypes.TIME,
    hSalida: DataTypes.TIME
  }, {
    sequelize,
    tableName: 'horarios',
    modelName: 'Horario',
  });
  return Horario;
};