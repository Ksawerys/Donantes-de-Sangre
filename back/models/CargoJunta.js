'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CargoJunta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CargoJunta.hasOne(models.CargoIntegrante, {
        foreignKey: 'idCargo',
        targetKey: 'id',
        as: 'CargoIntegrante'
      });
    }
  }
  CargoJunta.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'cargosjunta',
    modelName: 'CargoJunta',
  });
  return CargoJunta;
}; 