const sequelize = require('../ConexionSequelize');
const fs = require("fs");
const path = require('path');
const fileUpload = require('express-fileupload');
const File = require('../../helpers/fileUpload');
const models = require('../../models/index.js');
const assets=require('../../helpers/irAssets');

//Todo Alejandro
class Queries_Galeria {

    constructor() {
        this.sequelize = sequelize; 
    }
    getGaleria_Imagenes = async() => {
        this.sequelize.conectar();
        let resultado = [];
        try {
            resultado = await models.Galeria.findAll();
            this.sequelize.desconectar();
        } catch(error) {
            this.sequelize.desconectar();
            throw error;
        }
        return resultado
    }

    insertarGaleria_Imagen = async (req) => {
        let data = "";
        this.sequelize.conectar();
        try {
            let galeria = await models.Galeria.create();
            galeria.id = null;
            const nombre = await File.subirArchivo(req.files.archivo, undefined, 'galeria');
            assets.copiarAssests('galeria', 'galeria', nombre);
            let descripcion = req.body.descripcion;
            if(descripcion.length == 0){
                descripcion = null;
            }
            let propietario = req.body.propietarioID;
            galeria.nombre = nombre;
            galeria.descripcion = descripcion;
            galeria.propietario = propietario;
            const resp = await galeria.save();
            data = {
                "id": resp.id,
                "nombre": galeria.nombre,
                "descripcion": galeria.descripcion,
                "propietario": galeria.propietario,
                "Created at": galeria.createdAt,
                "Updated at": galeria.updatedAt
            }
            
        } catch (err) {
            throw err;
        }

        this.sequelize.desconectar();
        return data;
    }


    getGaleria_Imagen = async (id) => {
        this.sequelize.conectar();
        const imagen = await models.Galeria.findByPk(id);
        this.sequelize.desconectar();
        return imagen;
    }

    deleteGaleriaImagen = async(id) => {
        this.sequelize.conectar();
        let galeria = await models.Galeria.findByPk(id);
        if (!galeria) {
            this.sequelize.desconectar();
            throw error;
        }
        else{
            let pathImagen = path.join(__dirname, '../../uploads', "galeria", galeria["nombre"]);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
            pathImagen = path.join(__dirname, '../../../front/src/assets/imagenes', "galeria", galeria["nombre"]);
            if(fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }
        
        await galeria.destroy();
        this.sequelize.desconectar();
        return galeria;
    }

    getGaleriaPeticion_Imagen = async (id) => {
        this.sequelize.conectar();
        const imagen = await models.PeticionesGaleria.findByPk(id);
        this.sequelize.desconectar();
        return imagen;
    }

    subirPeticionFoto = async (req) => {
        let data = "";
        this.sequelize.conectar();
        try {
            let peticion_galeria = await models.PeticionesGaleria.create();
            peticion_galeria.id = null;
            const nombre = await File.subirArchivo(req.files.archivo, undefined, 'peticion_galeria');
            assets.copiarAssests('peticion_galeria', 'peticion_galeria', nombre);
            let descripcion = req.body.descripcion;
            if(descripcion.length == 0){
                descripcion = null;
            }
            peticion_galeria.nombre = nombre;
            peticion_galeria.descripcion = descripcion;
            peticion_galeria.propietario = req.body.propietarioID;
            peticion_galeria.verificado = false;
            peticion_galeria.aceptado_rechazado = "No se ha decidido todavia";
            const resp = await peticion_galeria.save();

            data = {
                "id": resp.id,
                "nombre": peticion_galeria.nombre,
                "descripcion": peticion_galeria.descripcion,
                "propietario": peticion_galeria.propietario,
                "verificado": peticion_galeria.verificado,
                "aceptado_rechazado": peticion_galeria.aceptado_rechazado,
                "Created at": peticion_galeria.createdAt,
                "Updated at": peticion_galeria.updatedAt
            }
            
        } catch (err) {
            throw err;
        }

        this.sequelize.desconectar();
        return data;
    }

    aceptarPeticionFoto = async(id) => {
        this.sequelize.conectar();
        let peticion_galeria = await models.PeticionesGaleria.findByPk(id);
        if (!peticion_galeria) {
            this.sequelize.desconectar();
            throw error;
        }
        else{
            
            try{
                peticion_galeria.verificado = true;
                peticion_galeria.aceptado_rechazado = "Aceptado";
                await peticion_galeria.save();
            }catch(err){
                throw err;
            }
            let data = "";
            const path_old_Imagen = path.join(__dirname, '../../uploads', "peticion_galeria", peticion_galeria["nombre"]);
            const path_new_Imagen = path.join(__dirname, '../../uploads', "galeria", peticion_galeria["nombre"])
            // const pathImagenFront = path.join(__dirname, '../../../front/src/assets/imagenes', "peticion_galeria", peticion_galeria["nombre"]);
            // if(fs.existsSync(pathImagenFront)) {
            //     fs.unlinkSync(pathImagenFront);
            // }
            if (fs.existsSync(path_old_Imagen)) {
                fs.copyFileSync(path_old_Imagen, path_new_Imagen);
                
                let galeria = await models.Galeria.create();
                galeria.id = null;
                galeria.nombre = peticion_galeria["nombre"];
                galeria.descripcion = peticion_galeria["descripcion"];
                galeria.propietario = peticion_galeria["propietario"];
                const resp = await galeria.save();
                data = {
                    "id": resp.id,
                    "nombre": galeria.nombre,
                    "descripcion": galeria.descripcion,
                    "propietario": galeria.propietario,
                    "Created at": galeria.createdAt,
                    "Updated at": galeria.updatedAt
                }
                assets.copiarAssests('galeria', 'galeria', galeria["nombre"]);
                this.sequelize.desconectar();
                return data;
            }
        }
        
        
    }

    rechazarPeticionFoto = async(id) => {
        this.sequelize.conectar();
        let peticion_galeria = await models.PeticionesGaleria.findByPk(id);
        if (!peticion_galeria) {
            this.sequelize.desconectar();
            throw error;
        }
        else{
            try{
                peticion_galeria.verificado = true;
                peticion_galeria.aceptado_rechazado = "Rechazado";
                await peticion_galeria.save();

                const path_old_Imagen = path.join(__dirname, '../../uploads', "peticion_galeria", peticion_galeria["nombre"]);
                const path_new_Imagen = path.join(__dirname, '../../uploads/peticion_galeria', "rechazadas", peticion_galeria["nombre"])
                if (fs.existsSync(path_old_Imagen)) {
                    fs.copyFileSync(path_old_Imagen, path_new_Imagen);
                    assets.copiarAssests('peticion_galeria/rechazadas', 'peticion_galeria/rechazadas', peticion_galeria["nombre"]);
                }
            }catch(err){
                throw err;
            }
        }
        this.sequelize.desconectar();
        return peticion_galeria;
    }
}

const queries_Galeria = new Queries_Galeria();

module.exports = queries_Galeria;