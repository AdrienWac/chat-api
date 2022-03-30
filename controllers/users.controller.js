const db = require('../models');

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
        
        const findUser = await db.User.findOne({where: {id: req.body.id}});

        findUser.is_connected = false;

        await findUser.save();

        return res.status(201).send({ code: 201, message: `Logout succesfully`, result: findUser.dataValues });

    } catch (error) {

        return res.status(500).send({ code: 500, message: `Error during user logout. ${error.message}`, result: {} });

    }

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