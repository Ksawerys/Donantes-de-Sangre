const { response, request } = require('express');
const queriesFaqs = require("../database/queries/queriesFaq");

//Todo Isa
const registrarFaq = async (req, res = response) => {
    queriesFaqs.addFaq(req.body.pregunta, req.body.respuesta).then((faq) => {
        res.status(200).json({
            success: true,
            data: faq,
            msg: 'Registrada'
        });
    }).catch((err) => {
       
        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se ha podido registrar'
        });
    });
}

const actualizarFaq = async (req, res = response) => {
    queriesFaqs.actualizarFaq(req.body.id, req.body.pregunta, req.body.respuesta).then((faq) => {
        res.status(200).json({
            success: true,
            data: faq,
            msg: 'Faq modificado'
        });
    }).catch((err) => {
   
        res.status(203).json({
            success: false,
            data: null,
            msg: 'No se ha podido modificar'
        });
    });
}

const getFaq = async (req, res = response) => {
    queriesFaqs.getFaq(req.body.id).then((faq) => {
        if (faq !== null) {
            data = {
                "id": faq.id,
                "pregunta": faq.pregunta,
                "respuesta": faq.respuesta,
            }

            res.status(203).json({
                success: true,
                data: data,
                msg: 'Faq encontrado'
            });
        } else {
            res.status(203).json({
                success: false,
                data: null,
                msg: 'Faq no encontrado'
            });
        }
    }).catch((err) => {
    
        res.status(203).json({
            success: false,
            data: null,
            msg: 'Faq no encontrado'
        });
    });
}
const borrarFaq = async (req, res = response) => {
    queriesFaqs.borrarFaq(req.params.id).then((faq) => {
        res.status(200).json({
            success: true,
            data: faq,
            msg: 'Faq borrado'
        });
    }).catch((err) => {
     
        res.status(200).json({
            success: false,
            data: null,
            msg: "No se ha podido borrar"
        });
    });
}
const borrarTodo = async (req, res = response) => {
    queriesFaqs.borrarTodo().then((faq) => {
        res.status(200).json({
            success: true,
            data: faq,
            msg: 'Todos los faqs han sido eliminados'
        });
    }).catch((err) => {
       
        res.status(200).json({
            success: false,
            data: null,
            msg: 'Ha ocurrido un error y no se han podido eliminar'
        });
    });
}
const getListado = async (req, res = response) => {
    queriesFaqs.getListado().then((faqs) => {
        if (faqs !== null) {
            let f = [];
            let data = "";
            faqs.forEach(faq => {
                data = {
                    "id": faq.id,
                    "pregunta": faq.pregunta,
                    "respuesta": faq.respuesta,
                }
                f.push(data);
            });
            const respuesta = {
                success: true,
                data: f,
                msg: 'Faqs encontrados'
            }
            res.status(200).json(respuesta);
        }
    }).catch((err) => {
        const respuesta = {
            success: false,
            data: null,
            msg: 'Faqs no encontrados'
        }
        res.status(200).json(respuesta);
    });
}

const borrarSeleccionado = async (req, res = response) => {
    queriesFaqs.borrarSeleccionado(req.body.ids).then((faq) => {
        res.status(200).json({
            success: true,
            data: faq,
            msg: 'Todos los faqs seleccionados han sido eliminados'
        });
    }).catch((err) => {
       
        res.status(200).json({
            success: false,
            data: null,
            msg: 'Ha ocurrido un error y no se han podido eliminar'
        });
    });
}


module.exports = {
    getListado,
    getFaq,
    borrarTodo,
    registrarFaq,
    actualizarFaq,
    borrarFaq,
    borrarSeleccionado
}