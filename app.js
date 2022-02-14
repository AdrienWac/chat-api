'use strict'

const express = require('express');
const db = require('./models');
const cors =  require('cors');
const config = require('./config');

db.sequelize.sync({force: false});

const app = express();

var corsOptions = {
    origin: config.CLIENT_URL
};

app.use(cors(corsOptions));

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: `Hello world!!!` });
});

app.use('/user', require('./routes/user'));

module.exports = app;