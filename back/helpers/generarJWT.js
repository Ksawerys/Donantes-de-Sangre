require('dotenv').config();
const jwt = require('jsonwebtoken');

//Todo Mario
const generarJWT = (id, nombre) => {
            
    const token = jwt.sign({id: id, nombre: nombre}, process.env.JWT_PRIVATEKEY, {
        expiresIn: '24h'
    });

    return token;
}

module.exports = generarJWT;