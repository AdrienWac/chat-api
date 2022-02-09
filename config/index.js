const env = process.env.NODE_ENV || 'development';

if (['development', 'test'].includes(env)) {
    require('dotenv').config({ path: '.env' });
}

const config = {
    development: {
        CLIENT_URL: process.env.CLIENT_URL,
        PORT: process.env.PORT || 3000,
        DB_HOST: process.env.MYSQL_HOST,
        DB_USER: process.env.MYSQL_USER,
        DB_PASSWORD: process.env.MYSQL_PASSWORD,
        DB_NAME: process.env.MYSQL_DATABASE,
        DB_PORT: process.env.MYSQL_PORT,
    },
    production: {
        CLIENT_URL: 'https://gtqw6qb1kj.herokuapp.com',
        PORT: process.env.PORT || 3000,
        DB_HOST: process.env.MYSQL_HOST,
        DB_USER: process.env.MYSQL_USER,
        DB_PASSWORD: process.env.MYSQL_PASSWORD,
        DB_NAME: process.env.MYSQL_DATABASE,
        DB_PORT: process.env.MYSQL_PORT,
    },
    test: {
        CLIENT_URL: process.env.CLIENT_URL,
        PORT: process.env.PORT || 3000,
        DB_HOST: '127.0.0.1',
        DB_USER: "root",
        DB_PASSWORD: "secret",
        DB_NAME: "test_chat",
        DB_PORT: 3306,
    }
}

module.exports = config[env];