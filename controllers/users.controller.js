const db = require('../models');

exports.add = async (req, res) => {
    
    try {
        
        const user = await db.User.create(req.body);
        
        return res.status(201).send({ code: 201, message: `Account created successfully`, result: user.dataValues });

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

        return res.status(201).send({ code: 201, message: `Login succesfully`, result: user.dataValues });
        
    } catch (error) {

        return res.status(500).send({ code: 500, message: `Error during user login. ${error.message}`, result: {} });

    }

}