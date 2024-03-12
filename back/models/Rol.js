'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Rol.hasMany(models.RolUser, {as: 'RolUser', foreignKey: 'idRol'});
    }
  }
  Rol.init({
    nombre: DataTypes.STRING,
    abilities: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'roles',
    modelName: 'Rol',
  });
  return Rol;
};