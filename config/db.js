const Sequelize = require('sequelize');
//require('dotenv').config({ path: '../variables.env'});
require('dotenv').config();

const db = new Sequelize(
    process.env.BD_Nombre, 
    process.env.BD_User,
    process.env.BD_Password, 
    {
        host: process.env.BD_Host,
        dialect: 'mysql',
        port: process.env.DB_Port,
        define: {
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
);

  module.exports = db;
