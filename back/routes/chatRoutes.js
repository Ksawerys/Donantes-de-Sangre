const { Router } = require('express');
const router = Router();
const controlador = require('../controllers/chatController');
const mid = require("../middlewares/userMiddlewares");
const vJwt = require('../middlewares/validarJwt');

//Todo Isa
router.get('/listado',[vJwt.validarJwt],controlador.Listado);//mensajes
router.get('/listadobloqueados',[vJwt.validarJwt, mid.midAdmin],controlador.ListadoBloqueados);
router.get('/listadodesbloqueados',[vJwt.validarJwt, mid.midAdmin],controlador.ListadoDesbloqueados);
router.post('/comprobarestado',[vJwt.validarJwt],controlador.ComprobarEstado);
router.post('/actualizarestadochat',[vJwt.validarJwt, mid.midAdmin],controlador.actulizarEstadoChat);
router.get('/estadochat',controlador.obtenerEstadoChat);
module.exports = router;