const express = require('express');
// const body_parser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const citasController = require('../../controllers/citasController');
const { conexion, sequelize } = require('../../database/Conexion');
const fileupload = require("express-fileupload");
const { startSocketServer } = require('./socket-server');

//Mario
class Server {

    constructor() {
        this.app = express();
        this.path = '/api/';

        this.pathAptoSangre = "/api/test-apto";
        this.pathNoticias = '/api/noticias/';
        this.pathGaleria = "/api/galeria";
        this.pathMusica = "/api/musica";
        this.pathFaq = "/api/faq";
        this.pathChat = "/api/chat";
        this.pathNotificacion = "/api/notificacion";

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    middlewares() {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
        this.app.use(express.static("../../uploads/"));
    }

    routes() {
        this.app.use(this.path, require('../../routes/routes'));
        this.app.use(this.pathAptoSangre, require('../../routes/aptoSangreRoutes'));
        this.app.use(this.pathGaleria, require('../../routes/galeriaRoutes'));
        this.app.use(this.pathNoticias, require('../../routes/noticiasRoutes'));
        this.app.use(this.pathMusica, require('../../routes/cancionRoutes'));
        this.app.use(this.pathFaq, require('../../routes/faqRoutes'));
        this.app.use(this.pathChat, require('../../routes/chatRoutes'));
        this.app.use(this.pathNotificacion, require('../../routes/notificacionRoutes'));
    }

    
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`Servidor escuchando en: ${process.env.PORT}`);
        })
    }
}

cron.schedule('0 0 8 * * *', () => {citasController.recordarCitaTresDias()});

startSocketServer() // Inicia el servidor de Socket.io

module.exports = Server;