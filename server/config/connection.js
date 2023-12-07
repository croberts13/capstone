const { Sequelize } = require('sequelize');

// make a sequelize connection using environment variables and pooling
// then export it
console.log(process.env.DATABASE_URL);
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: false,
    },
});

sequelize
    .authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch((/** @type {Error}*/ err) => {
        console.error(err);
        console.log('Unable to connect to the database: ' + err.stack);
    });

module.exports = { sequelize };
