'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Noticia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { 
      Noticia.hasMany(models.Imagen, {as: 'Imagen', foreignKey: 'idNoticia', targetKey: 'id'});
    }
  }
  Noticia.init({
    titulo: DataTypes.STRING,
    subtitulo: DataTypes.STRING,
    contenido: DataTypes.STRING(65000),
    seccion: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'noticias',
    modelName: 'Noticia',
  });
  return Noticia;
}; 