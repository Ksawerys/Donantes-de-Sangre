'use strict';
const { Model } = require('sequelize');
 
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Email.belongsTo(models.User, {
        foreignKey: 'id',
        targetKey: 'id'
      });
      Email.belongsTo(models.RolUser, {
        foreignKey: 'id',
        targetKey: 'idUser'
      })
    }
  }
  Email.init({
    email: DataTypes.STRING,
    emailVerifiedAt: DataTypes.DATE,
    newsletterVerifiedAt: DataTypes.DATE,
    vKeyNewsletter: DataTypes.STRING,
    vKeyEmail: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'emails',
    modelName: 'Email',
  });
  return Email;
};