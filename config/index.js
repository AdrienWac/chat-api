const env = process.env.NODE_ENV || 'development';

if (['development, test'].includes(env)) {
    require('dotenv').config({ path: '.env' });
}

const config = {
    development: {
        CLIENT_URL: process.env.CLIENT_URL
    },
    production: {
        CLIENT_URL: 'https://gtqw6qb1kj.herokuapp.com'
    },
    test: {
        CLIENT_URL: process.env.CLIENT_URL
    }
}

module.exports = config[env];