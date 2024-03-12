const { Sequelize } = require('sequelize');
const models = require('../../models/index.js');

const getDonaciones = async() => {
    const resp = await models.Donacion.findAll({
        order: [['fecha', 'DESC']]
    });
    
    return resp;
}


const insertDonacion = async(donacion) => { 
    
    try {
        
        const resp = await models.Donacion.create({
            id: null,
            nDonante: donacion.nDonante ? donacion.nDonante : null,
            gSanguineo: donacion.gSanguineo,
            donacion: donacion.tipoDonacion,
            genero: donacion.genero,
            fecha: donacion.fecha
        });
        
        return resp;

    } catch (err) {
        
        throw err;
    }
}



module.exports = {
    getDonaciones,
    insertDonacion
};