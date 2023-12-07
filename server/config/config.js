require('dotenv').config();

const config = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_development',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
    test: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_test',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_production',
        host: '127.0.0.1',
        dialect: 'postgres',
    },
};

// console.log(config);
module.exports = config;
