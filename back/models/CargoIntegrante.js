'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CargoIntegrante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CargoIntegrante.belongsTo(models.CargoJunta, {
        foreignKey: 'idCargo',
        targetKey: 'id',
        as: 'CargoJunta'
      });


      CargoIntegrante.belongsTo(models.IntegranteJunta, {
        foreignKey: 'idIntegrante',
        targetKey: 'id'
      });
    }
  }
  CargoIntegrante.init({
    idCargo: DataTypes.BIGINT,
    idIntegrante: DataTypes.BIGINT
  }, {
    sequelize,
    paranoid: true,
    tableName: 'cargointegrante',
    modelName: 'CargoIntegrante',
    timestamps: true,
  });

  
  CargoIntegrante.removeAttribute('id');
  
  return CargoIntegrante;
};