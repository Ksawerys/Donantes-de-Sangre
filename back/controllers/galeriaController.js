const {response, request} = require('express');
const queries_Galeria = require('../database/queries/queriesGaleria');
const fs = require('fs');
const path = require('path');
const correo = require('../helpers/mail');
const queriesUsers = require('../database/queries/queriesUsers');

//Todo Alejandro

const getGaleria_Imagenes = (req = request, res = response) => {
    
    queries_Galeria.getGaleria_Imagenes()
    .then( msg => {
        res.status(200).json(msg);
    });
}

const getPeticionGaleria_Imagen = (req = request, res = response) => {
    
    queries_Galeria.getGaleriaPeticion_Imagen(req.params.peticionGaleriaID)
    .then( msg => {
        res.status(200).json(msg);
    });
}

const insertar_Galeria_Imagen = (req = request, res = response) => {
    queries_Galeria.insertarGaleria_Imagen(req)
    .then( msg => {
        res.status(201).json(msg);
    });
}


const mostrar_Galeria_Imagen = (req, res = response) => {
    
    queries_Galeria.getGaleria_Imagen(req.params.id).then((imagen) => {
        if (imagen) {
            const pathImagen = path.join(__dirname, '../uploads', 'galeria', imagen.nombre);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }
    }).catch((err) => {
        console.log("No se ha encontrado la Imagen");
    });
}

const borrarGaleria = (req, res = response) => {
    queries_Galeria.deleteGaleriaImagen(req.params.id).then((imagen) => {
        res.status(204).json("La imagen de la Galeria ha sido eliminada");
    }).catch((err) => {
        res.status(400).json("No se ha podido eliminar la imagen de la galeria");
    })
}


const peticionSubirFoto = (req = request, res = response) => {
    
    queries_Galeria.subirPeticionFoto(req).then( msg => {
        res.status(201).json(msg);
    });
}

const mandarCorreoAdministradores = (req = request, res = response) => {
    queries_Galeria.getGaleriaPeticion_Imagen(req.params.id).then((imagen) => {
        if (imagen) {
            const pathImagen = path.join(__dirname, '../uploads', 'peticion_galeria', imagen.nombre);
            if (fs.existsSync(pathImagen)) {
                    queriesUsers.getUser(imagen.propietario).then(usuario => {
                    let descripcion = `Su descripcion es: <strong>${(imagen.descripcion)}</strong>.`;
                    if(imagen.descripcion == null){
                        descripcion = "Usted no ha puesto ninguna descripcion.";
                    }
                    const contenido = {
                        asunto: 'Peticion de subida de foto',
                        cuerpoHtml: `
                            El usuario <strong>${(usuario.nombre)}</strong> ha pedido la subida de una foto.
                            ${(descripcion)}.
                            Para saber mas de ello visita a la pagina de donantes de sangre <a href="http://localhost:4200/notificacion">Pincha Aqui</a>`,
                        foto: imagen.nombre,
                        idFoto: imagen.id,
                        propietario: imagen.propietario
                    }
                    queriesUsers.getEmailsAdministradores().then( administradores => {
                        administradores.forEach(correo_administradores => {
                            correo.mandarCorreo_Foto(correo_administradores.email, contenido, pathImagen);
                        });
                    })
                    queriesUsers.aumentarNotificacionAdministrador();
                    const resp = {
                        success: true,
                        msg: 'Se ha mandado un correo a todos los admininistradores',
                        contenido: contenido
                    }
                    res.status(200).json(resp);
                });
            }
        }
        
    }).catch((err) => {
        console.log("No se ha encontrado la Imagen, con lo cual no se ha podido enviar ningun correo");
        console.log(err);
    });
}

const aceptarPeticionFoto = (req = request, res = response) => {
    
    queries_Galeria.aceptarPeticionFoto(req.params.id).then( msg => {
        res.status(202).json(msg);
    });
}

const rechazarPeticionFoto = (req = request, res = response) => {
    
    queries_Galeria.rechazarPeticionFoto(req.params.id).then( msg => {
        res.status(202).json(msg);
    });
}

const mandarCorreoAceptacion = (req = request, res = response) => {
    queries_Galeria.getGaleriaPeticion_Imagen(req.params.id).then((imagen) => {
        if (imagen) {
            //Cambiarlo luego despues
            const pathImagen = path.join(__dirname, '../uploads', 'peticion_galeria', imagen.nombre);
            if (fs.existsSync(pathImagen)) {
                
                queriesUsers.getEmailById(imagen.propietario).then(correo_usuario => {
                    queriesUsers.getUser(imagen.propietario).then((usuario) => {
                        let descripcion = `Su descripcion es: <strong>${(imagen.descripcion)}</strong>.`;
                        if(imagen.descripcion == null){
                            descripcion = "Usted no ha puesto ninguna descripcion.";
                        }
                        const contenido = {
                            asunto: 'Aceptacion de la Foto',
                            cuerpoHtml: `
                                La foto que has subido <strong>${(usuario.nombre)}</strong> ha sido aceptable.
                                ${(descripcion)}`,
                            foto: imagen.nombre
                        }
                        correo.mandarCorreo_Foto(correo_usuario.email, contenido, pathImagen);
                        queriesUsers.aumentarNotificacionUsuario(usuario.id);
                    })
                    
                    
                })
                const resp = {
                    success: true,
                    msg: 'Se ha mandado un correo al usuario con exito'
                }
                console.log("HOLLAA LLEGO AQUI 5");
                res.status(200).json(resp);
            }
        }
        
    }).catch((err) => {
        console.log("No se ha encontrado la Imagen, con lo cual no se ha podido enviar ningun correo");
        console.log(err);
    });
}

const mandarCorreoRechazo = (req = request, res = response) => {
    queries_Galeria.getGaleriaPeticion_Imagen(req.params.id).then((imagen) => {
        if (imagen) {
            const pathImagen = path.join(__dirname, '../uploads', 'peticion_galeria', imagen.nombre);
            if (fs.existsSync(pathImagen)) {
                queriesUsers.getEmailById(imagen.propietario).then(correo_usuario => {
                    queriesUsers.getUser(imagen.propietario).then((usuario) => {
                        let descripcion = `Su descripcion es: <strong>${(imagen.descripcion)}</strong>.`;
                        if(imagen.descripcion == null){
                            descripcion = "Usted no ha puesto ninguna descripcion.";
                        }
                        const contenido = {
                            asunto: 'Rechazo de la Foto',
                            cuerpoHtml: `
                                La foto que has subido <strong>${(usuario.nombre)}</strong> ha sido rechazada.
                                ${(descripcion)}`,
                            foto: imagen.nombre
                        }
                        correo.mandarCorreo_Foto(correo_usuario.email, contenido, pathImagen);
                        queriesUsers.aumentarNotificacionUsuario(usuario.id);
                    })
                    
                })
                const resp = {
                    success: true,
                    msg: 'Se ha mandado un correo al usuario con exito'
                }
        
                res.status(200).json(resp);
            }
        }
        
    }).catch((err) => {
        console.log("No se ha encontrado la Imagen, con lo cual no se ha podido enviar ningun correo");
        console.log(err);
    });
}

module.exports = {
    insertar_Galeria_Imagen,
    peticionSubirFoto,
    getPeticionGaleria_Imagen,
    mandarCorreoAdministradores,
    getGaleria_Imagenes,
    mostrar_Galeria_Imagen,
    borrarGaleria,
    aceptarPeticionFoto,
    rechazarPeticionFoto,
    mandarCorreoAceptacion,
    mandarCorreoRechazo
}