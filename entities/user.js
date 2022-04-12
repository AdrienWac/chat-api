const db = require('../models');

exports.getAllUsersConnected = () => {
    return db.User.findAll({where: {is_connected: true}});
}

exports.getListOfConnectedUser = async (currentUser, sort = false) => {
    
    const getAllUsersConnected = await this.getAllUsersConnected();

    const allUsersConnected = getAllUsersConnected.map((element) => {
        element.dataValues.self = element.dataValues.id === currentUser.id;
        return element.dataValues;
    });

    if (sort && allUsersConnected.size > 1) {

        allUsersConnected = allUsersConnected.sort((a,b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            if (a.username < b.username) return -1;
            return a.username > b.username ? 1 : 0;
        });

    }
    
    return allUsersConnected;

}

