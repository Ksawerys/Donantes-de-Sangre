const models = require('../../models/index.js');


// Isa y Alicia
getImagen = async (nombre) => {
    const imagen = await models.Imagen.findOne({
        where: { nombre: nombre }
    });

    return imagen;
}


getImagenById = async (id) => {
    const imagen = await models.Imagen.findOne({
        where: { id: id }
    });
    
    return imagen;
}


deleteImagen = async (id) => {
    try {

        const resp = await models.Imagen.destroy({
            where: { id: id }
        });

        return resp;

    } catch (err) {
        throw err;
    }
}



module.exports = {
    getImagen,
    getImagenById,
    deleteImagen
};