const db = require('../models');

exports.handleSession = async (socket, next) => {

    const sessionId = socket.handshake.auth.sessionId;
    
    if (sessionId) {
        
        const userFindBySession = await db.User.findOne({where: {sessionId: sessionId}});
        
        if (userFindBySession !== null) {

            userFindBySession.is_connected = true;
            
            await userFindBySession.save();

            socket.handshake.user = userFindBySession.dataValues;

            return next();
        }

    }

    return next(new Error(`User is not found`));

}

