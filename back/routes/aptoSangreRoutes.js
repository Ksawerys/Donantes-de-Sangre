//Todo Alejandro

const { Router } = require('express');
const controlador = require('../controllers/aptoSangreController');
const mids = require('../middlewares/apto_sangreMiddlewares');
const router = Router();
router.get('/mostrarPreguntas', controlador.mostrarPreguntas);
router.get('/mostrarPregunta/:id', controlador.mostrarPregunta);
router.post('/generarPregunta',[mids.obligatorio, mids.Si_No], controlador.generarPregunta);
router.put('/modificarPregunta/:id', [mids.obligatorio, mids.Si_No], controlador.modificarPregunta);
router.delete('/borrarPregunta/:id', controlador.borrarPregunta);

module.exports = router;
