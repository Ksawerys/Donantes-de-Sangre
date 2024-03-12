const { Router } = require('express');
const router = Router();
const controlador = require('../controllers/noticiasController');
const mid = require("../middlewares/userMiddlewares");
const vJwt = require('../middlewares/validarJwt');

//Todo Isa
router.post('/get', [vJwt.validarJwt, mid.midAdmin], controlador.getNoticia);
router.get('/:seccion', controlador.getListado);
router.post('/registrar', [vJwt.validarJwt, mid.midAdmin], controlador.registrarNoticia);
router.delete('/borrar', [vJwt.validarJwt, mid.midAdmin], controlador.borrarNoticia);
router.get('/upload/:nombre', controlador.mostrarImagen);
router.put('/modificar', [vJwt.validarJwt, mid.midAdmin], controlador.modificarNoticia);

module.exports = router;