const models = require('../../models/index.js');


getMemoria = async (id) => {
    const memoria = await models.Memoria.findByPk(id);

    return memoria;
}


getMemorias = async () => {
    const memorias = await models.Memoria.findAll({ order: [['anio', 'ASC']] });

    return memorias;
}


insertOrUpdateMemoria = async (memoria) => {
    try {

        const [mem, creada] = await models.Memoria.findOrCreate({
            where: { id: memoria.id },
            defaults: {
                id: null,
                anio: memoria.anio,
                imagen: memoria.imagen,
                documento: memoria.documento
            }
        });

        const resp = creada
            ? mem
            : await mem.update({
                anio: memoria.anio,
                imagen: memoria.imagen ? memoria.imagen : null,
                documento: memoria.documento ? memoria.documento : null,
            });

        return resp;

    } catch (err) {
        throw err;
    }
}


deleteMemoria = async (id) => {
    try {
        return await models.Memoria.destroy({ where: { id: id } });

    } catch (err) {
        throw err;
    }
}


deleteImgMemoria = async (id) => {
    try {

        const mem = await models.Memoria.findByPk(id);
        const resp = await mem.update({ imagen: null });

        return resp;

    } catch (err) {
        throw err;
    }
}



module.exports = {
    getMemoria,
    getMemorias,
    insertOrUpdateMemoria,
    deleteMemoria,
    deleteImgMemoria
  };