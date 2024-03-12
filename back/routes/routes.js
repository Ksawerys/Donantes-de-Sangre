const { Router } = require('express');
const router = Router();
const midsUser = require('../middlewares/userMiddlewares');
const midsCitas = require('../middlewares/citasMiddlewares');
const vJwt = require('../middlewares/validarJwt');
const midsValidar = require('../middlewares/validarMiddlewares');
const auth = require('../controllers/authController');
const contenido = require('../controllers/contenidoController');
const citas = require('../controllers/citasController');
const stats = require('../controllers/statsController');
const users = require('../controllers/userController');
const memorias = require('../controllers/memoriasController');
const qr = require('../controllers/qrController');
const { check } = require('express-validator');
const { mismaHora } = require('../helpers/validators/contacto-validators');

// Mario y Alicia
// auth routes
router.post('/login', auth.login); //Mario
router.post('/register', auth.register); //Mario
router.post('/login_Google', auth.googleSignin); //Alejandro y Mario
router.get('/activarCorreo/:id/:vKey', auth.activarCorreo); //Mario
router.get('/puedeModificar/:id', [ vJwt.validarJwt ], auth.puedeModificar); //Alicia
router.post('/solicitarrecpasswd', auth.mandarEmailRecuperarPasswd); //Mario
router.post('/recuperarpasswd/:id', auth.recuperarPasswd); //Mario
router.post('/suscripcionNewsletter', [
    check('email', 'Formato de correo no válido').isEmail(),
    midsValidar.validarCampos
], auth.mandarEmailNewsletter); //Alicia
router.get('/activarNewsletter/:id/:vKey', auth.activarNewsletter); //Alicia
router.get('/desactivarNewsletter/:id/:vKey', auth.desactivarNewsletter); //Alicia


// Usuarios routes
// Mario
router.put('/cambiarpasswd', [vJwt.validarJwt, midsUser.mismoUser, midsUser.midUser], auth.modContrasena);
router.put('/users/updateuserperfil', [vJwt.validarJwt, midsUser.mismoUser, midsUser.midUser], users.updateUserPerfil);
router.get('/users/getinfouser/:id', [vJwt.validarJwt, midsUser.midUser], auth.getInfoUser);
router.get('/users/getinfousers', [vJwt.validarJwt, midsUser.midAdmin], users.getUsers);
router.put('/users/updateuseradmin', [vJwt.validarJwt, midsUser.midAdmin], users.updateUserAdmin);

// Contenido routes
// Todo Alicia
// Historia
router.get('/getHistoria', contenido.getHistoria);
router.put('/updateHistoria', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.updateHistoria);

// Junta
router.get('/getCargosJunta', contenido.getCargosJunta);
router.get('/getIntegrantesCargo', contenido.getIntegrantesCargo);
router.post('/insertCargo', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.insertCargo);
router.put('/insertOrUpdateIntegranteJunta', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.insertOrUpdateIntegranteJunta);
router.delete('/deleteIntegranteJunta/:id', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.deleteIntegranteJunta);
router.delete('/deleteCargo/:id', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.deleteCargo);

// Teléfonos
router.get('/getTelefonos', contenido.getTelefonos);
router.put('/insertOrUpdateTfno', [ 
    vJwt.validarJwt,
    midsUser.midAdmin,
    check('numero', 'Número de teléfono no válido')
        .not().isEmpty()
        .matches(/^(\(?(\+34|0034|34)\)?[ -]+)?([0-9][ -]*){9}/),
    check('extension', 'Extensión no válida').matches(/^[0-9]*$/),
    midsValidar.validarCampos,
], contenido.insertOrUpdateTfno)
router.delete('/deleteTfno/:id', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.deleteTfno);


// Memorias
router.get('/getMemorias', memorias.getMemorias);
router.get('/upload/img/:nombre', memorias.getImagen);
router.get('/upload/doc/:nombre', memorias.getDocumento);
router.get('/download/:nombre', memorias.descargarDocumento);
router.put('/insertOrUpdateMemoria', [ 
    vJwt.validarJwt, 
    midsUser.midAdmin, 
    check('anio', 'El año es obligatorio').not().isEmpty(),
    midsValidar.validarCampos 
], memorias.insertOrUpdateMemoria);
router.delete('/deleteMemoria/:id', [ vJwt.validarJwt, midsUser.midAdmin ], memorias.deleteMemoria);


// Direcciones
router.get('/getDirecciones', contenido.getDirecciones);
router.put('/insertOrUpdateDir', [ 
    vJwt.validarJwt, 
    midsUser.midAdmin, 
    check('lugar', 'El lugar debe tener un máximo de 255 caracteres').isLength({ max: 255 }),
    check('calle', 'La calle es obligatoria').not().isEmpty(),
    check('calle', 'La calle debe tener un máximo de 255 caracteres').isLength({ max: 255 }),
    check('numero', 'Debe ser un número de un máximo de 3 caracteres.').optional().matches(/^[0-9]{0,3}$/),
    check('ciudad', 'La ciudad es obligatoria').not().isEmpty(),
    check('ciudad', 'La ciudad debe tener un máximo de 255 caracteres').isLength({ max: 255 }),
    check('provincia', 'La provincia es obligatoria').not().isEmpty(),
    check('provincia', 'La provincia debe tener un máximo de 255 caracteres').isLength({ max: 255 }),
    check('cp', 'La provincia es obligatoria').not().isEmpty(),
    check('cp', 'Debe ser un número de 5 caracteres.').matches(/^[0-9]{5}$/),
    midsValidar.validarCampos,
], contenido.insertOrUpdateDir);
router.get('/tutorial/:img', contenido.getImgTutorial);


// Horarios
router.get('/getHorarios', contenido.getHorarios);
router.post('/insertHorarios/', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.insertHorarios);
router.put('/updateHorarios/', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.updateHorarios);
router.put('/deleteHorarios/', [ vJwt.validarJwt, midsUser.midAdmin ], contenido.deleteHorarios);


// citas routes
router.get('/citas/gethorasdisponibles/:fecha', [vJwt.validarJwt, midsUser.midUser],citas.getHorasDisponibles);
router.get('/citas/gethorascitas',[vJwt.validarJwt, midsUser.midAdmin], citas.getHorasCitas);
router.post('/citas/pedircita', [vJwt.validarJwt, midsCitas.yaHaPedidoUnaCita, midsCitas.hayCapacidad, midsUser.midUser], citas.pedirCita);
router.put('/citas/cancelarcita/', [vJwt.validarJwt, midsUser.midUser], citas.cancelarCita);
router.get('/citas/usernotienecita/:id', [vJwt.validarJwt, midsUser.midUser], citas.userNoTieneCita);
router.get('/citas/hayhuecohora/:fecha', [vJwt.validarJwt, midsUser.midUser], citas.hayHuecoHora);
router.get('/citas/getcitapendienteuser/:id', [vJwt.validarJwt, midsUser.midUser], citas.getCitaPendienteUser);
router.get('/citas/getcitaspasadasuser/:id', [vJwt.validarJwt, midsUser.midUser], citas.getCitasPasadasUser);
router.get('/citas/getcitaspendientes', [vJwt.validarJwt, midsUser.midAdmin],citas.getCitasPendientes);
router.get('/citas/getcitaspasadas', [vJwt.validarJwt, midsUser.midAdmin],citas.getCitasPasadas);
router.put('/citas/aplazarcita', [vJwt.validarJwt, midsUser.midAdmin],citas.updateFechaCita);
router.put('/citas/updatehadonado',[vJwt.validarJwt, midsUser.midAdmin], citas.confirmarHaDonado);
router.get('/citas/yatienecita/:id', [vJwt.validarJwt, midsUser.midUser], citas.yaHaPedidoUnaCita);

router.get('/citas/gethorarios', citas.getHorarios);
router.put('/citas/updatenumpersonascita', [vJwt.validarJwt, midsUser.midAdmin], citas.modNumPersonaCita);
router.post('/citas/inserthoracita', [vJwt.validarJwt, midsUser.midAdmin], citas.insertHoraCita);
router.delete('/citas/deletehoracita/:hora', [vJwt.validarJwt, midsUser.midAdmin], citas.deleteHoraCita);

router.get('/citas/getcitasalavez', [vJwt.validarJwt, midsUser.midAdmin], citas.getNumPersonasCita);
router.put('/citas/updatecitasalavez', [vJwt.validarJwt, midsUser.midAdmin], citas.updateNumPersonascita);

router.get('/citas/obtenerultima/:id',[vJwt.validarJwt,midsUser.midUser], qr.getUltimaCita);//Isa


// Estadísticas routes
router.get('/stats/getDonaciones/', stats.getDonaciones);
router.get('/stats/getAltas/', stats.getAltas);


module.exports = router;