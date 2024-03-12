require('dotenv').config()

const Server = require('./models/otros/server');
const server = new Server();

server.listen();