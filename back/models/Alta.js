'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Alta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Alta.init({
    fecha: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Alta',
    tableName: 'altas'
  });
  return Alta;
};