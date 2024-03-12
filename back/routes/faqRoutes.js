const { Router } = require('express');
const router = Router();
const controlador = require('../controllers/faqController');
const mid = require("../middlewares/userMiddlewares");
const vJwt = require('../middlewares/validarJwt');

//Todo Isa
router.post('/registrar',[vJwt.validarJwt, mid.midAdmin] ,controlador.registrarFaq);
router.post('/get',[vJwt.validarJwt, mid.midAdmin] ,controlador.getFaq);
router.get('/listado', controlador.getListado);
router.delete('/borrar/:id',[vJwt.validarJwt, mid.midAdmin],controlador.borrarFaq);
router.delete('/borrarseleccion',[vJwt.validarJwt, mid.midAdmin],controlador.borrarSeleccionado);
router.put('/modificar',[vJwt.validarJwt, mid.midAdmin], controlador.actualizarFaq);
router.delete('/borrar',[vJwt.validarJwt, mid.midAdmin] ,controlador.borrarTodo);

module.exports = router;