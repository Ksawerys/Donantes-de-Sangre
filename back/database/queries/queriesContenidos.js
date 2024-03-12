const Sequelize = require('sequelize');
const models = require('../../models/index.js');

//Alicia
getHistoria = async () => {
  const historia = await models.Contenido.findOne({
    attributes: ['id', 'nombre', 'valor'],
    where: {
      nombre: 'historia'
    }
  });

  return historia;
}


getHorarios = async () => {
  return await models.Horario.findAll();
}


getTelefonos = async () => {
  return await models.Telefono.findAll();
}


getDirecciones = async () => {
  return await models.Direccion.findAll();
}


getCargosJunta = async () => {
  return await models.CargoJunta.findAll();
}


getCargoIntegrantes = async () => {
  //https://stackoverflow.com/questions/68132680/how-to-return-values-from-joined-tables-in-sequelize-at-the-same-level-as-master
  const cargosIntegrantes = await models.IntegranteJunta.findAll({
    include: [
      {
        model: models.CargoIntegrante,
        attributes: [],
        as: 'CargoIntegrante',
        include: [
          {
            model: models.CargoJunta,
            attributes: [],
            as: 'CargoJunta'
          }
        ]
      }
    ],
    attributes: ['id', 'nombre', [Sequelize.col('CargoIntegrante.CargoJunta.nombre'), 'cargo'],
      [Sequelize.col('CargoIntegrante.CargoJunta.id'), 'idCargo']]
  });

  return cargosIntegrantes;
}


insertHorario = async (horario) => {
  try {

    const resp = await models.Horario.create({
      dia: horario.dia,
      codDia: horario.codDia,
      hEntrada: horario.hEntrada,
      hSalida: horario.hSalida
    });

    return resp;

  } catch (err) {
    throw err;
  }
}


insertTfno = async (datos) => {
  try {

    return await models.Telefono.create({
      numero: datos.numero,
      extension: datos.extension
    });

  } catch (err) {
    throw err;
  }
}


insertDir = async (datos) => {
  try {

    return await models.Direccion.create({
      lugar: datos.lugar,
      calle: datos.calle,
      numero: datos.numero,
      ciudad: datos.ciudad,
      provincia: datos.provincia,
      urlMapa: datos.urlMapa,
      cp: datos.cp,
    });

  } catch (err) {
    throw err;
  }
}


insertCargo = async (datos) => {
  try {

    return await models.CargoJunta.create({ nombre: datos.nombre });

  } catch (err) {
    throw err;
  }
}


insertIntegranteJunta = async (datos) => {
  try {

    const intJunta = await models.IntegranteJunta.create({ id: null, nombre: datos.nombre });
    datos.id = intJunta.id;
    const cargoInt = await models.CargoIntegrante.create({ idCargo: datos.idCargo, idIntegrante: datos.id });
    const cargo = await models.CargoJunta.findByPk(cargoInt.idCargo, { attributes: ['nombre'] });

    return {
      cargo: cargo.nombre,
      id: intJunta.id,
      idCargo: cargoInt.idCargo,
      nombre: intJunta.nombre
    }

  } catch (err) {
    await models.IntegranteJunta.destroy({ where: { id: datos.id } });

    throw err;
  }
}


updateHistoria = async (historia) => {
  try {

    const [resp, created] = await models.Contenido.findOrCreate({
      where: { id: historia.id },
      defaults: {
        id: null,
        nombre: historia.nombre,
        valor: historia.valor
      }
    });
    
    if (!created) await resp.update({ valor: historia.valor });

    return resp;

  } catch (err) {
    throw err;
  }
}


updateIntegranteJunta = async (datos) => {
  try {

    const intJunta = await models.IntegranteJunta.findByPk(datos.id);
    const cargoInt = await models.CargoIntegrante.findOne({ where: { idIntegrante: datos.id } });
    const cargo = await models.CargoJunta.findByPk(datos.idCargo, { attributes: ['nombre'] });
    
    if (intJunta && cargoInt) {
      await Promise.all([intJunta.update({ nombre: datos.nombre }), cargoInt.update({ idCargo: datos.idCargo })]);

      return {
        cargo: cargo.nombre,
        id: intJunta.id,
        idCargo: cargoInt.idCargo,
        nombre: intJunta.nombre
      };
 
    } else return null;

  } catch (err) {
    throw err;
  }
}


updateDir = async (datos) => {
  try {

    const dir = await models.Direccion.findByPk(datos.id);
    
    if (dir) {

      return await dir.update({
        lugar: datos.lugar,
        calle: datos.calle,
        numero: datos.numero,
        provincia: datos.provincia,
        ciudad: datos.ciudad,
        urlMapa: datos.urlMapa,
        cp: datos.cp
      });

    } else return null;

  } catch (err) {
    throw err;
  }
}


updateTfno = async (datos) => {
  try {

    const tfno = await models.Telefono.findByPk(datos.id);

    if (tfno) {
      
      return await tfno.update({
        numero: datos.numero,
        extension: datos.extension
      });

    } else return null;

  } catch (err) {
    throw err;
  }
}


updateHorario = async (datos) => {
  try {

    const horario = await models.Horario.findByPk(datos.id);

    if (horario) {
      
      return await horario.update({
        nombre: datos.nombre,
        codDia: datos.codDia,
        hEntrada: datos.hEntrada,
        hSalida: datos.hSalida
      });

    } else return null;

  } catch (err) {
    throw err;
  }
}


deleteHorario = async (id) => {
  try {
    
    return await models.Horario.destroy({ where: { id: id } });

  } catch (err) {
    throw err;
  }
}


deleteTfno = async (id) => {
  try {

    return await models.Telefono.destroy({ where: { id: id } });

  } catch (err) {
    throw err;
  }
}


deleteCargo = async (id) => {
  try {

    let resp = 0;
    const cargosInts = await models.CargoIntegrante.findAll({ where: { idCargo: id } });

    if (cargosInts.length <= 0) {
      resp = await models.CargoJunta.destroy({ where: { id: id } });
    }
    
    return resp;

  } catch (err) {
    throw err;
  }
}


deleteIntegranteJunta = async (id) => {
  try {

    const integrante = await models.IntegranteJunta.destroy({ where: { id: id } });

    if (integrante == 1) {
      const cargoInt = await models.CargoIntegrante.destroy({ where: { idIntegrante: id } });

      if (cargoInt == 0) {
        await models.IntegranteJunta.restore({ where: { id: id } });
        return 0;
      }
    }
    
    return integrante;

  } catch (err) {
    throw err;
  }
}


module.exports = {
  getHistoria,
  getHorarios,
  getTelefonos,
  getDirecciones,
  getCargosJunta,
  getCargoIntegrantes,
  insertHorario,
  insertTfno,
  insertDir,
  insertCargo,
  insertIntegranteJunta,
  updateHistoria,
  updateIntegranteJunta,
  updateTfno,
  updateDir,
  updateHorario,
  deleteHorario,
  deleteTfno,
  deleteCargo,
  deleteIntegranteJunta
};