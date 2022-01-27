exports.add = async (req, res) => {

    return res.status(201).send({ code: 201, message: `Account created successfully`, result: {username: 'Jdoe'} });

};