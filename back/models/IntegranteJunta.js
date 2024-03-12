'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class IntegranteJunta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      IntegranteJunta.hasOne(models.CargoIntegrante, {
        foreignKey: 'idIntegrante',
        targetKey: 'id'
      });
    }
  }
  IntegranteJunta.init({
    nombre: DataTypes.STRING,
  }, {
    sequelize,
    paranoid: true,
    tableName: 'integrantesjunta',
    modelName: 'IntegranteJunta',
  });
  return IntegranteJunta;
};