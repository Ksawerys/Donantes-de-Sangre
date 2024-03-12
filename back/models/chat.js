'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.User, {as: 'User', foreignKey: 'idUser'});
    }
  }
  Chat.init({
    idUser: DataTypes.BIGINT,
    nombreUser:DataTypes.STRING,
    mensaje: DataTypes.STRING(65000),
    
  }, {
    sequelize,
    tableName: 'chats',
    modelName: 'Chat',
  });
  return Chat;
};