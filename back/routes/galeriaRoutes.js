const { Router } = require('express');
const controlador = require('../controllers/galeriaController');
const router = Router();

//Todo Alejandro

router.get('/mostrarGaleria_Imagenes', controlador.getGaleria_Imagenes);
router.get('/mostrarPeticionGaleria/:peticionGaleriaID', controlador.getPeticionGaleria_Imagen)
router.post('/insertarGaleria_imagen', controlador.insertar_Galeria_Imagen);
router.get('/upload/:id', controlador.mostrar_Galeria_Imagen);
router.delete('/borrarGaleria_Imagen/:id', controlador.borrarGaleria);

//Para aplicarlo bien en el front hay que seguir un procedimiento.
//La otra route que tambien que hay que seguir es "notificacionRoutes.js"

//1º Primero dar subir peticion en esta ruta Galeria
router.post('/peticion_subidaFoto', controlador.peticionSubirFoto);
router.get('/mandarCorreo_fotoPeticion/:id', controlador.mandarCorreoAdministradores);

//3º Mandar correos una vez elegido o aceptar la foto o rechazar la foto;
router.get('/mandarCorreo_aceptacionPeticion/:id', controlador.mandarCorreoAceptacion);
router.get('/mandarCorreo_rechazoPeticion/:id', controlador.mandarCorreoRechazo);

//5º y ultimo paso, ahora vamos mover los datos de la base de datos y colocar nuevas fotos O eliminar fotos
router.put('/aceptarPeticionFoto/:id', controlador.aceptarPeticionFoto);
router.put('/rechazarPeticionFoto/:id', controlador.rechazarPeticionFoto);

module.exports = router;