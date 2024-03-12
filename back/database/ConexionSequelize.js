require('dotenv').config();
const mysql = require('mysql2');
const {Sequelize} = require('sequelize'); 

//Todo Mario
class CnxnSequelize {
    
    constructor() {
        this.db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        });
    }

    conectar = () => {
        this.db.authenticate().then(() => {
            console.log('Connection has been established successfully.');
        }).catch((error) => {
            console.error('Unable to connect to the database: ', error);
        });
    }

    desconectar = () => {
        process.on('SIGINT', () => conn.close())
    }

    sync = () => {
        this.db.sync().then(() => {
            console.log('Table created successfully!');
        }).catch((error) => {
            console.error('Unable to create table : ', error);
        });
    }
}

const sequelize = new CnxnSequelize();
sequelize.conectar();


module.exports = sequelize;
