const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { response, request } = require('express');
const queriesContenidos = require('../database/queries/queriesContenidos');


//Todo Alicia
const getHistoria = async (req, res = response) => {
    queriesContenidos.getHistoria()
        .then(historia => {

            const resp = {
                success: true,
                msg: 'Registros encontrado',
                data: historia.dataValues
            };

            res.status(200).json(resp);

        }).catch(err => {

            const resp = { success: false, msg: 'No hay registros' };

            res.status(200).json(resp);
        });
}


const getHorarios = (req, res = response) => {
    queriesContenidos.getHorarios()
        .then(horarios => {

            horarios.map(h => {
                h.hEntrada = moment(h.hEntrada, "HH:mm:ss").format('HH:mm');
                h.hSalida = moment(h.hSalida, "HH:mm:ss").format('HH:mm');
            })

            const resp = {
                success: true,
                data: horarios,
            }

            res.status(200).json(resp);

        }).catch(err => {
            const resp = { success: false, msg: 'No hay registros' };

            res.status(200).json(resp);
        });
}


const getTelefonos = (req, res = response) => {
    queriesContenidos.getTelefonos()
        .then(telefonos => {

            const resp = {
                success: true,
                msg: 'Registros encontrados',
                data: telefonos
            }

            res.status(200).json(resp);

        }).catch(err => {

            const resp = { success: false,  msg: 'No hay registros' };

            res.status(200).json(resp);
        });
}


const getDirecciones = (req, res = response) => {
    queriesContenidos.getDirecciones()
        .then(direcciones => {

            const resp = {
                success: true,
                data: direcciones
            }

            res.status(200).json(resp);

        }).catch(err => {

            const resp = { success: false,  msg: 'No hay registros' };

            res.status(200).json(resp);
        });
}


const getImgTutorial = async (req, res = response) => {
    return res.sendFile(path.join(__dirname, '../uploads/tutorialGoogleMaps/', req.params.img));
}


const getCargosJunta = (req, res = response) => {
    queriesContenidos.getCargosJunta()
        .then(listadoCargos => {

            const resp = {
                success: true,
                msg: 'Registos encontrados',
                data: listadoCargos
            }

            res.status(200).json(resp);

        }).catch(err => {

            const resp = {  success: false, msg: 'No hay registros' };

            res.status(200).json(resp);
        });
}


const getIntegrantesCargo = (req, res = response) => {
    queriesContenidos.getCargoIntegrantes()
        .then(listadoJunta => {

            const resp = {
                success: true, 
                msg: 'Registos encontrados',
                data: listadoJunta
            }

            res.status(200).json(resp);

        }).catch(err => {

            const resp = { success: false, msg: 'No hay registros' };

            res.status(200).json(resp);
        });
}


const updateHistoria = async (req, res = response) => {
    let resp = { success: false, msg: 'Se ha producido un error' };

    try {

        const historia = await queriesContenidos.updateHistoria(req.body);
       
        if (historia) {
            resp = {
                success: true,
                msg: 'Historia actualizada con éxito',
                data: historia
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const insertOrUpdateTfno = async (req, res = response) => { 
    let resp = { success: false, msg: 'Se ha producido un error' };
    let tfno;

    try {

        if (req.body.id == null) tfno = await queriesContenidos.insertTfno(req.body);
        else tfno = await queriesContenidos.updateTfno(req.body);
       
        if (tfno) {
            resp = {
                success: true,
                msg: 'Teléfono actualizado con éxito',
                data: tfno
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const insertHorarios = async (req, res = response) => { 
    let resp = { success: false, msg: 'Se ha producido un error' };

    try {

        let promesas = [];
        for (let i = 0; i < req.body.length; i++) { 
            promesas.push(() => queriesContenidos.insertHorario(req.body[i]));
        }

        let horarios = await Promise.all(promesas.map(p => p()));
       
        if (horarios) {
            resp = {
                success: true,
                msg: 'Horarios añadidos con éxito',
                data: horarios
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        
        res.status(200).json(resp);
    }
}


const updateHorarios = async (req, res = response) => { 
    let resp = { success: false, msg: 'Se ha producido un error' };
    let promesas = [];
    const hGuardar = req.body.hGuardar;
    const hBorrar = req.body.hBorrar;
    
    try {

        for (let i = 0; i < hGuardar.length; i++) { 
            promesas.push(() => (hGuardar[i].id == -1)
                ? queriesContenidos.insertHorario(hGuardar[i])
                : queriesContenidos.updateHorario(hGuardar[i]));
        }

        for (let i = 0; i < hBorrar.length; i++) { 
            promesas.push(() => (queriesContenidos.deleteHorario(hBorrar[i])));
        }

        let horarios = await Promise.all(promesas.map(p => p()));

        if (horarios) {
            resp = {
                success: true,
                msg: 'Horarios actualizados con éxito',
                data: horarios
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        
        res.status(200).json(resp);
    }
}


const insertOrUpdateDir = async (req, res = response) => { 
    let resp = { success: false, msg: 'Se ha producido un error' };
    let dir;
  
    try {

        if (req.body.id == null) dir = await queriesContenidos.insertDir(req.body);
        else dir = await queriesContenidos.updateDir(req.body);
       
        if (dir) {
            resp = {
                success: true,
                msg: 'Dirección actualizada con éxito',
                data: dir
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const insertCargo = async (payload) => { 
    let resp = { success: false, msg: 'Se ha producido un error' };

    try {
        const cargo = await queriesContenidos.insertCargo(payload);
       
        if (cargo) {
            resp = {
                success: true,
                msg: 'Cargo actualizado con éxito',
                data: cargo
            }
        }

    } catch (err) {}

    return resp;
}


const insertOrUpdateIntegranteJunta = async (req, res = response) => { 
    let resp = { success: false, msg: 'Se ha producido un error' };
    let intJunta;

    try {

        if (req.body.id == -1) intJunta = await queriesContenidos.insertIntegranteJunta(req.body);
        else intJunta = await queriesContenidos.updateIntegranteJunta(req.body);
       
        if (intJunta) {
            resp = {
                success: true,
                msg: 'Integrante actualizado con éxito',
                data: intJunta
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const deleteTfno = async (req, res = response) => {
    let resp = { success: false, msg: 'Se ha producido un error' }

    try {

        const tfno = await queriesContenidos.deleteTfno(req.params.id);

        if (tfno == 1) {
            resp = {
                success: true,
                msg: 'Teléfono eliminado con éxito',
                data: req.params.id
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const deleteCargo = async (req, res = response) => {
    let resp = { success: false, msg: 'Se ha producido un error' }

    try {

        const cargo = await queriesContenidos.deleteCargo(req.params.id);

        if (cargo == 1) {
            resp = {
                success: true,
                msg: 'Cargo eliminado con éxito',
                data: req.params.id
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const deleteIntegranteJunta = async (req, res = response) => {
    let resp = { success: false, msg: 'Se ha producido un error' }

    try {

        const integrante = await queriesContenidos.deleteIntegranteJunta(req.params.id);
        
        if (integrante == 1) {
            resp = {
                success: true,
                msg: 'Integrante eliminado con éxito',
                data: req.params.id
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}


const deleteHorarios = async (req, res = response) => {
    let resp = { success: false, msg: 'Se ha producido un error' }

    try {
        
        let promesas = [];
        for (let i = 0; i < req.body.length; i++) {
            promesas.push(() => queriesContenidos.deleteHorario(req.body[i].id));
        }
        let horarios = await Promise.all(promesas.map(p => p()));

        if (horarios.includes(0)) { //Si alguno falla, vuelvo a insertar los que se han borrado.
            promesas = [];
            for (let i = 0; i < horarios.length; i++) {
                if (horarios[i] == 1) promesas.push(() => queriesContenidos.insertHorario(req.body[i]));
            }
            horarios = await Promise.all(promesas.map(p => p()));

        } else {
            resp = {
                success: true,
                msg: 'Horario eliminado con éxito',
                data: horarios
            }
        }

        res.status(200).json(resp);

    } catch (err) {
        res.status(200).json(resp);
    }
}



module.exports = {
    getHistoria,
    getHorarios,
    getTelefonos,
    getDirecciones,
    getImgTutorial,
    getCargosJunta,
    getIntegrantesCargo,
    updateHistoria,
    insertOrUpdateTfno,
    insertHorarios,
    updateHorarios,
    insertOrUpdateDir,
    insertCargo,
    insertOrUpdateIntegranteJunta,
    deleteTfno,
    deleteCargo,
    deleteIntegranteJunta,
    deleteHorarios
}