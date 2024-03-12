const { Router } = require('express');
const controlador = require('../controllers/notificacionController');
const router = Router();


//Todo Alejandro

router.get('/mostrarNotificaciones', controlador.getNotificaciones);
router.get('/mostrarNotificacionUsuario/:idUser', controlador.getNotificacionUser);
router.get('/getNotificacionCantidad/:idUser', controlador.getCantidadNotificaciones);


//Este procedimiento viene del fichero "galeriaRoutes.js"
// 2º Crear Notificaciones una vez terminado de mandar correos al Administrador. Tienes que cambiar la idImagenPeticion
router.post('/crearNotificacionAdministradores', controlador.postCrearNotificacionesAdministradores);

// 4ª Crear Notificaciones a los usuarios una vez mandado el correo al usuario Dependiendo si aceptado o rechazado.
router.post('/crearNotificacionAceptarUsuario', controlador.postCrearNotificacionAceptarUsuario);
router.post('/crearNotificacionRechazarUsuario', controlador.postCrearNotificacionRechazarUsuario);



//Estas de aqui las puedes ejecutar en cualquier momento. Hay que mirarlas;
router.put('/notificacionLeida/:idNotificacion', controlador.putNotificacionLeida);
router.delete('/borrarNotificacion/:idNotificacion', controlador.borrarNotificacion);


module.exports = router;