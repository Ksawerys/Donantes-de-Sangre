//Todo Alejandro
const obligatorio = (req, res, next) => {
    const body = req.body;
    if(body.enunciado != "" && body.titulo != "" && body.respuesta != ""){
        next();
    }
    else{
        res.status(400).json({ msg: 'Los elementos: enunciado, titulo, respuesta son OBLIGATORIAS'})
    }
}

const Si_No = (req, res, next) => {
    const respuesta = req.body.respuesta
    if(respuesta == 1 || respuesta == 0){
        next();
    }
    else{
        res.status(400).json({ msg: 'Solo se permite los numeros "1"(Si) o "0"(No).' });
    }
}

module.exports = {
    obligatorio,
    Si_No
}