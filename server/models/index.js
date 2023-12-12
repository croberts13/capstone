'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sslConf =
    process.env.NODE_ENV == 'production'
        ? {
              ssl: true,
              dialectOptions: {
                  ssl: {
                      require: true // Set to true if SSL is required
                      // rejectUnauthorized: false // Set to false if you want to skip validation of SSL certificates
                      // You can also provide other SSL options here as needed
                  }
              }
          }
        : {};

console.log({ sslConf });
let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], {
        ...config,
        ...sslConf
    });
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME || config.database,
        process.env.DB_USER || config.username,
        process.env.DB_PASSWORD || config.password,
        {
            ...config,
            ...sslConf
        }
    );
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }

    if (db[modelName].attachScope) {
        db[modelName].attachScope(db);
    }
});

// sequelize
//     .authenticate()
//     .then(() => console.log('Connection has been established successfully.'))
//     .catch((/** @type {Error}*/ err) => {
//         console.error(err);
//         console.log('Unable to connect to the database: ' + err.stack);
//     });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize.sync({ alter: false }).catch(console.error);

/**
 *  @typedef  Models
 * @prop Role {import('./role').Role}
 * @prop User {import('./user').User}
 * @prop UserRole {import('./user_role').UserRole}
 * @prop Appointment {import('./appointment').Appointment}
 *
 *
 * @typedef {Models & ( typeof db)} DBInstance
 *
 */

module.exports = /** @type {DBInstance} */ (db);
