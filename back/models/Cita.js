'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cita extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Cita.belongsTo(models.User, {
      //   foreignKey: 'userId',
      //   targetKey: 'id',
      //   as: 'CitaUser'
      // });

      Cita.belongsTo(models.User, {as: 'user'});
    }
  }
  Cita.init({
    userId: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    donacion: DataTypes.ENUM('sangre', 'plasma'),
    cancelada: DataTypes.TINYINT,
    haDonado: DataTypes.TINYINT
  }, {
    sequelize,
    tableName: 'citas',
    modelName: 'Cita',
  });
  return Cita;
};