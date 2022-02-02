const env = process.env.NODE_ENV || 'development';

if (['development, test'].includes(env)) {
    require('dotenv').config({ path: '.env' });
}

const config = {
    development: {
        CLIENT_URL: process.env.CLIENT_URL,
        PORT: process.env.PORT || 3000
    },
    production: {
        CLIENT_URL: 'https://gtqw6qb1kj.herokuapp.com',
        PORT: process.env.PORT || 3000
    },
    test: {
        CLIENT_URL: process.env.CLIENT_URL,
        PORT: process.env.PORT || 3000
    }
}

module.exports = config[env];