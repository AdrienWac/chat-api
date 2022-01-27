exports.add = async (req, res) => {

    res.status = 200;
    return res.json({ code: 200, message: 'Utilisateur créé avec succès' });

};