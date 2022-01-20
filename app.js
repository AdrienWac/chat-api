'use strict'

const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: `Hello world!!!` });
});

app.listen(process.env.PORT || 3000);

app.post('/user', async (req, res) => {
    try {

        const databaseConnection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        await databaseConnection.execute(`CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255), password VARCHAR(255)) `);

        console.log('ici', process.env.MYSQL_HOST);

        const [rows, fields] = await databaseConnection.execute(`INSERT INTO users(email,password) VALUES ('adrien', '123456')`);

    } catch (error) {
        console.log('error', error);
    } finally {

        return res.json({ message: 'ouioui' });
    }



})