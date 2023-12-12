require('dotenv').config();

const config = {
    development: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_development',
        host: '127.0.0.1',
        dialect: 'postgresql',
    },
    test: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_test',
        host: '127.0.0.1',
        dialect: 'postgresql',
    },
    production: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_production',
        host: '127.0.0.1',
        dialect: 'postgresql',
        use_env_variable: 'DATABASE_URL',
    },
};

// console.log(config);
module.exports = config;
