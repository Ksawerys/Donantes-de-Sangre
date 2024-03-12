'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PeticionesGaleria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PeticionesGaleria.belongsTo(models.User, {
        foreignKey: 'propietario',
        targetKey: 'id'
      });
    }
  }
  PeticionesGaleria.init({
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING(50),
    propietario: DataTypes.INTEGER,
    verificado: DataTypes.BOOLEAN,
    aceptado_rechazado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PeticionesGaleria',
    tableName: 'peticionesgaleria'
  });
  return PeticionesGaleria;
};