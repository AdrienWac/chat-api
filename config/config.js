require('dotenv').config();

module.exports = {
    "development": {
        "url": process.env.CLEARDB_DATABASE_URL,
    },
    "test": {
        "username": "root",
        "password": "secret",
        "database": "test_chat",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "url": process.env.CLEARDB_DATABASE_URL,
    }
};

