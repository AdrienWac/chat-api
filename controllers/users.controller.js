const db = require('../models');
const server = require('../server');

exports.add = async (req, res) => {
    
    try {

        const user = db.User.build({ ...req.body, ...{ sessionId: randomId()}});
        
        await user.save();
        
        return res.status(201).send({ code: 201, message: `Account created successfully`, result: generateUser(user.dataValues) });

    } catch (error) {

        const codeStatus = error.name === 'SequelizeUniqueConstraintError' ? 403 : 500;
        
        return res.status(codeStatus).send({ code: codeStatus, message: `Error during user creation. ${error.message}`, result: {} });

    }

};

exports.login = async (req, res) => {
    
    try {
        
        const findAllUserByUsername = await db.User.findAll({where: {username: req.body.username}});

        if (findAllUserByUsername.length > 1) {
            return res.status(403).send({ code: 403, message: `Multiple accounts linked to this username`, result: {}});
        }

        const [user] = findAllUserByUsername;

        user.is_connected = true;

        await user.save();

        return res.status(201).send({ code: 201, message: `Login succesfully`, result: generateUser(user.dataValues) });
        
    } catch (error) {

        return res.status(500).send({ code: 500, message: `Error during user login. ${error.message}`, result: {} });

    }

}

exports.logout = async (req, res) => {
    try {

        const io = server.getIo();

        const hasBro = await server.hasBro(req.body.id, io);

        const user = await setUserConnectedState(req.body.id);

        const sockets = server.getSocket(user.id);

        if (hasBro) {
            server.notifyBro({ 
                io, 
                allSockets: sockets, 
                currentSocket: sockets[req.body.socketId], 
                eventName: 'signout', 
                params: user
            });
        }

        server.notifyOtherSocket({ socket: sockets[req.body.socketId], eventName: 'user disconected', params: user });
        
        if (Object.getOwnPropertyNames(sockets).length > 0) {
            for (const socketId in sockets) {
                sockets[socketId].disconnect();
            }
        }

        return res.status(201).send({ code: 201, message: `Logout succesfully`, result: user });

    } catch (error) {

        return res.status(500).send({ code: 500, message: `Error during user logout. ${error.message}`, result: {} });

    }


    return res.status(201).send({
        code: 201, 
        message: `Logout succesfully`, 
        result: {
            "id": 1,
            "sessionId": "695f1db9d802fce9",
            "username": "player1",
            "is_connected": true,
            "is_typing": false,
            "created": "2022-03-28T20:26:34.000Z",
            "updated": "2022-03-28T20:26:34.000Z"
        }
    });

}

exports.find = async (req, res) => {

    try {

        const findUser = await db.User.findOne({ where: { id: req.params.idUser } });

        if (findUser === null) {
            res.status(404).send({ code: 404, message: `User not found`, result: null});
        }

        return res.status(201).send({ code: 201, message: `User found`, result: findUser.dataValues });

    } catch (error) {

        return res.status(500).send({ code: 500, message: `Impossible to found user. ${error.message}`, result: {} });

    }


}

function randomId() {
    const crypto = require('crypto');
    return crypto.randomBytes(8).toString("hex");
}

function generateUser(userData) {
    return {...userData, ...{is_typing: false}};
}

const setUserConnectedState = async (userId, connectedState = false) => {
    
    const findUser = await db.User.findOne({ where: { id: userId } });
    
    findUser.is_connected = connectedState;
    
    return findUser.save()
        .then(result => {
            return findUser.dataValues;
        })
        .catch(error => {
            throw new Error(error.message)}
        );

};

exports.setUserConnectedState = setUserConnectedState;

