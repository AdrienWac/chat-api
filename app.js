'use strict'

const express = require('express');

const PORT = process.env.API_CONTAINER_PORT;

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: `Hello world!!! ${process.env.DB_NAME}` });
});

app.listen(process.env.PORT || 3000);

