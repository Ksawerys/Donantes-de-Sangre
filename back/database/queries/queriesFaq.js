//Isa
const sequelize = require('../ConexionSequelize');
const models = require('../../models/index.js');

class QueriesFaqs {
    constructor() {
        this.sequelize = sequelize;
    }
    getListado = async () => {
        let preguntas = "";
        try {
            this.sequelize.conectar();
            preguntas = await models.Faq.findAll();
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        return preguntas;
    }
    getFaq = async (id) => {
        let pregunta = "";
        try {
            this.sequelize.conectar();
            pregunta = await models.Faq.findByPk(id);
            this.sequelize.desconectar();
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        return pregunta;
    }
    actualizarFaq = async (id, pregunta, respuesta) => {
        let data = "";
        this.sequelize.conectar();
        try {
            let faq = await models.Faq.findByPk(id);
            if (faq) {

                faq.id = faq.id;
                faq.pregunta = pregunta;
                faq.respuesta = respuesta;
                faq.save();

                data = {
                    "id": faq.id,
                    "pregunta": faq.pregunta,
                    "respuesta": faq.respuesta,
                }
            }
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }

        this.sequelize.desconectar();
        return data;
    }
    addFaq = async (pregunta, respuesta) => {
        let data = "";
        this.sequelize.conectar();
        try {
            let faq = await models.Faq.create({
                pregunta: pregunta,
                respuesta: respuesta,
            });

            data = {
                "id": faq.id,
                "pregunta": faq.pregunta,
                "respuesta": faq.respuesta,
            }
            this.sequelize.desconectar();

        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
        return data;
    }
    borrarFaq = async (id) => {
        this.sequelize.conectar();
        let faq = await models.Faq.findByPk(id);
        if (!faq) {
            this.sequelize.desconectar();
            throw error;
        }

        await faq.destroy();
        this.sequelize.desconectar();
        return faq;
    }
    borrarTodo = async () => {
        this.sequelize.conectar();
        let faqs = await models.Faq.findAll();
        if (!faqs) {
            this.sequelize.desconectar();
            throw error;
        }
        for (let index = 0; index < faqs.length; index++) {
            await faqs[index].destroy();
        }
        this.sequelize.desconectar();
        return faqs;
    }

    borrarSeleccionado = async (ids) => {
        
        this.sequelize.conectar();
        let eliminados = [];
        try {
            for (let index = 0; index < ids.length; index++) {
              
                let faq = await models.Faq.findByPk(ids[index]);
                if (!faq) {
                    this.sequelize.desconectar();
                    throw error;
                }
                eliminados.push(faq);
                await faq.destroy();
            }
            this.sequelize.desconectar();
            return eliminados;
        } catch (err) {
            this.sequelize.desconectar();
            throw err;
        }
    }

}

const queriesFaqs = new QueriesFaqs();
module.exports = queriesFaqs;