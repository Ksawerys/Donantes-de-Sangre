const models = require('../../models/index.js');


const getAltas = async() => {
    const resp = await models.Alta.findAll({
        order: [['fecha', 'DESC']]
    });
    
    return resp;
}


const insertAltas = async(alta) => { 
    try {

        const resp = await models.Alta.create({
            id: null,
            fecha: alta.fecha
        });

        return resp;

    } catch (err) {
        
        throw err;
    }
}


module.exports = {
    getAltas,
    insertAltas
};