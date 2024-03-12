const {response, request} = require('express');
const queries_AptoSangre = require('../database/queries/queriesAptoSangre');
//Todo Alejandro
const mostrarPreguntas = (req = request, res = response) => {
    
    queries_AptoSangre.getPreguntas()
    .then( msg => {
        res.status(200).json(msg);
    });
}

const mostrarPregunta = (req = request, res = response) => {
    
    queries_AptoSangre.getPregunta(req.params.id)
    .then( msg => {
        res.status(200).json(msg);
    });
}

const generarPregunta = (req, res = response) => {
    
    queries_AptoSangre.generarPregunta(req)
    .then( msg => {
        res.status(201).json(msg);
    }).catch((err) => {
        res.status(400).json(err);
    });
}

const modificarPregunta = (req, res = response) => {
    
    queries_AptoSangre.actualizarPregunta(req).then( msg => {
        res.status(202).json(msg);
    }).catch((err) => {
        res.status(400).json("Error al modificar la pregunta");
    })
}

const borrarPregunta = (req, res = response) => {
const {response, request} = require('express');
const queries_AptoSangre = require('../database/queries/queriesAptoSangre');
//Todo Alejandro
const mostrarPreguntas = (req = request, res = response) => {
    
    queries_AptoSangre.getPreguntas()
    .then( msg => {
        res.status(200).json(msg);
    });
}

const mostrarPregunta = (req = request, res = response) => {
    
    queries_AptoSangre.getPregunta(req.params.id)
    .then( msg => {
        res.status(200).json(msg);
    });
}

const generarPregunta = (req, res = response) => {
    
    queries_AptoSangre.generarPregunta(req)
    .then( msg => {
        res.status(201).json(msg);
    }).catch((err) => {
        res.status(400).json(err);
    });
}
    

    queries_AptoSangre.eliminarPregunta(req.params.id).then( msg => {
        res.status(202).json(msg);
    }).catch((err) => {
        res.status(400).json("Error al borrar la pregunta");
    })
}

module.exports = {
    mostrarPreguntas,
    mostrarPregunta,
    generarPregunta,
    modificarPregunta,
    borrarPregunta
}
module.exports = {
    mostrarPreguntas,
    mostrarPregunta,
    generarPregunta,
    modificarPregunta,
    borrarPregunta
}