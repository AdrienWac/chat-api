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