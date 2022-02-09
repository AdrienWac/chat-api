const db = require('../models');

exports.add = async (req, res) => {
    
    try {
        
        const user = await db.User.create(req.body);
        
        return res.status(201).send({ code: 201, message: `Account created successfully`, result: user.dataValues });

    } catch (error) {

        return res.status(500).send({ code: 500, message: `Error during user creation. ${error.message}`, result: {} });

    }

};