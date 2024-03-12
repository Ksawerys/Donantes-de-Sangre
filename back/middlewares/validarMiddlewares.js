const { validationResult } = require('express-validator');


const validarCampos = ( req, res, next ) => {
    const errors = validationResult(req);
   
    if( !errors.isEmpty() ){
        return res.status(400).json({ success: false, msg: 'Datos no válidos' });
    }

    next();
}


module.exports = {
    validarCampos
}
