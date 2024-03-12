const { Router } = require('express');
const router = Router();
const controlador = require('../controllers/musicaController');
const mid = require("../middlewares/userMiddlewares");
const vJwt = require('../middlewares/validarJwt');

//Todo Isa
router.post('/insertar', [vJwt.validarJwt, mid.midAdmin], controlador.registrarCancion);
router.get('/upload/:id', controlador.obtenerCancion);
router.post('/get', [vJwt.validarJwt, mid.midAdmin], controlador.getCancion);
router.get('/listado', controlador.Listado);
router.delete('/borrar/:id', [vJwt.validarJwt, mid.midAdmin], controlador.borrarCancion);
router.get('/download/:id', controlador.descargar);
router.put('/modificar', [vJwt.validarJwt, mid.midAdmin], controlador.editarCancion);
router.delete('/borrar', [vJwt.validarJwt, mid.midAdmin], controlador.borrarTodo);

module.exports = router;