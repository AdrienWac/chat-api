'use strict'

const express = require('express');
const db = require('./models');

db.sequelize.sync({force: false});

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json({ message: `Hello world!!!` });
});

app.use('/user', require('./routes/user'));

app.listen(process.env.PORT || 3000);


// app.post('/user', async (req, res) => {

//     try {
//         await db.User.create({ sessionId: 'sqqsqs', email: 'test@test.com', password: '21545', username: 'test', lastname: 'test', firstname: 'test', is_active: true });
//         return res.json({ message: 'ouioui' });
//     } catch (error) {
//         return res.json({ message: `User.create failed to execute. ${error}` })
//     }

// })