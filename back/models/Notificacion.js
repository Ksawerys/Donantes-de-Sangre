'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notificacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notificacion.belongsTo(models.User, {
        foreignKey: 'idUsuarioRegistrado',
        targetKey: 'id'
      });
      Notificacion.belongsTo(models.PeticionesGaleria, {
        foreignKey: 'galeriaPeticionID',
        targetKey: 'id'
      });
    }
  }
  Notificacion.init({
    titulo: DataTypes.STRING,
    mensaje: DataTypes.STRING,
    galeriaPeticionID: DataTypes.INTEGER,
    idUsuarioAdministrador: DataTypes.INTEGER,
    idUsuarioRegistrado: DataTypes.INTEGER,
    leido: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'notificaciones',
    modelName: 'Notificacion'
    
  });
  return Notificacion;
};