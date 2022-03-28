require('dotenv').config();

module.exports = {
    "development": {
        "url": "mysql://" + process.env.MYSQL_USER + ":" + process.env.MYSQL_ROOT_PASSWORD + "@" + process.env.MYSQL_HOST + "/" + process.env.DB_NAME,
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
        // "username": process.env.MYSQL_USER,
        // "password": process.env.MYSQL_PASSWORD,
        // "database": process.env.DB_NAME,
        // "host": process.env.MYSQL_HOST,
        // "dialect": "mysql"
    }
};

