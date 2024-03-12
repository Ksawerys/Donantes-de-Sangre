'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RolUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      RolUser.belongsTo(models.User, {
        foreignKey: 'idUser',
        targetKey: 'id'
      });
    }
  }
  RolUser.init({
    idRol: DataTypes.BIGINT,
    idUser: DataTypes.BIGINT
  }, {
    sequelize,
    timestamps: false,
    tableName: 'roluser',
    modelName: 'RolUser',
  });

  RolUser.removeAttribute('id');

  return RolUser;
}; 