'use strict';
const {  Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Pregunta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pregunta.init({
    enunciado: DataTypes.STRING,
    titulo: DataTypes.STRING,
    nombre_img: DataTypes.STRING,
    respuesta: DataTypes.INTEGER,
    solucion_problema: DataTypes.STRING(500)
  }, {
    sequelize,
    timestamps: false,
    tableName: 'preguntas',
    modelName: 'Pregunta',
  });
  return Pregunta;
}; 