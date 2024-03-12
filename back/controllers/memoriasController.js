const fs = require('fs');
const path = require('path');
const { response, request } = require('express');
const { subirArchivo, borrarArchivo } = require('../helpers/fileUpload');
const queriesMemorias = require('../database/queries/queriesMemorias');
const urlApiUpload = '/api/upload/';
const urlUploadMemorias = '../uploads/memorias/';
const carpetaMems = 'memorias';
const carpetaImgs = 'imagenes';
const carpetaDocs = 'documentos';


const getMemorias = (req, res = response) => {
    queriesMemorias.getMemorias()
        .then(memorias => {

            memorias.forEach(m => {
                const nombreImg = m.imagen
                    && fs.existsSync(path.join(__dirname, urlUploadMemorias, carpetaImgs, m.imagen))
                    ? m.imagen
                    : null;

                m.imagen = process.env.URL_PETICION + process.env.PORT + `${urlApiUpload}img/${nombreImg}`;
                m.documento = m.documento
                    && fs.existsSync(path.join(__dirname, urlUploadMemorias, carpetaDocs, m.documento))
                    ? process.env.URL_PETICION + process.env.PORT + `${urlApiUpload}doc/${m.documento}`
                    : null;
            });

            const resp = {
                success: true,
                msg: 'Registros encontrados',
                data: memorias
            }

            res.status(200).json(resp);

        }).catch(err => {

            const resp = {
                success: false,
                msg: 'No hay registros',
            }

            res.status(200).json(resp);
        });
}


const getImagen = async (req, res = response) => {
    const pathImagen = path.join(__dirname, urlUploadMemorias, carpetaImgs, req.params.nombre);

    return fs.existsSync(pathImagen)
        ? res.sendFile(pathImagen)
        : res.sendFile(path.join(__dirname, urlUploadMemorias, `${carpetaImgs}/default.png`))
}


const getDocumento = async (req, res = response) => {
    const pathDoc = path.join(__dirname, urlUploadMemorias, carpetaDocs, req.params.nombre);

    return fs.existsSync(pathDoc)
        ? res.sendFile(pathDoc)
        : res.sendFile(path.join(__dirname, urlUploadMemorias, `${carpetaImgs}/default.png`))
}


const descargarDocumento = async (req, res = response) => {
    const pathName = path.join(__dirname, urlUploadMemorias, carpetaDocs, req.params.nombre);

    if (!fs.existsSync(pathName))
        return res.status(404).json({ msg: 'No existe el archivo' });

    return res.download(pathName);
}



const insertOrUpdateMemoria = async (req, res = response) => {
    const extImgs = ['png', 'jpg', 'jpeg', 'gif', 'tiff', 'svg', 'webp'];
    const extDocs = ['pdf', 'odt', 'doc', 'docx'];

    try {
        const memoria = { id: req.body.id, anio: req.body.anio };

        if (req.body.imgBorrar) borrarArchivo(`${carpetaMems}/${carpetaImgs}`, req.body.imgBorrar);
        if (req.body.docBorrar) borrarArchivo(`${carpetaMems}/${carpetaDocs}`, req.body.docBorrar);

        if (req.files) {
            if (req.files.imagen) memoria.imagen = await comprobarArchivo(req.files.imagen, extImgs, `${carpetaMems}/${carpetaImgs}`);
            if (req.files.documento) memoria.documento = await comprobarArchivo(req.files.documento, extDocs, `${carpetaMems}/${carpetaDocs}`);
        }

        const memResp = await queriesMemorias.insertOrUpdateMemoria(memoria);

        const nombreImg = memResp.imagen
            && fs.existsSync(path.join(__dirname, urlUploadMemorias, carpetaImgs, memResp.imagen))
            ? memResp.imagen
            : null;

        memResp.imagen = process.env.URL_PETICION + process.env.PORT + `${urlApiUpload}img/${nombreImg}`;
        memResp.documento = memResp.documento
            ? process.env.URL_PETICION + process.env.PORT + `${urlApiUpload}doc/${memResp.documento}`
            : null;

        const resp = {
            success: true,
            msg: 'Memoria guardada con éxito',
            data: memResp
        }

        res.status(200).json(resp);

    } catch (err) {

        const resp = {
            success: false,
            msg: 'Error al guardar la memoria',
        }

        res.status(200).json(resp);
    }
}


const comprobarArchivo = async (archivo, extensiones, carpeta) => {
    return (archivo.size != 0)
        ? await subirArchivo(archivo, extensiones, carpeta)
        : archivo.name;
}


const deleteMemoria = async (req, res = response) => {
    try {

        const mem = await queriesMemorias.getMemoria(req.params.id);
        let resp = await queriesMemorias.deleteMemoria(req.params.id);

        if (resp == 0) throw error;
        else {
            if (mem.imagen) borrarArchivo(`${carpetaMems}/${carpetaImgs}`, mem.imagen);
            if (mem.documento) borrarArchivo(`${carpetaMems}/${carpetaDocs}`, mem.documento);

            resp = {
                success: true,
                msg: 'Memoria eliminada con éxito',
                data: req.params.id
            }

            res.status(200).json(resp);
        }

    } catch (err) {

        const resp = {
            success: false,
            msg: 'Error al eliminar la memoria',
        }

        res.status(200).json(resp);
    }
}


module.exports = {
    getImagen,
    getDocumento,
    descargarDocumento,
    getMemorias,
    insertOrUpdateMemoria,
    deleteMemoria
}