const db = require('../models');

exports.handleSession = async (socket, next) => {

    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {
        
        const userFindBySession = await db.User.findOne({where: {sessionId: sessionId}});
        
        if (userFindBySession !== null) {

            userFindBySession.is_connected = true;
            
            await userFindBySession.save();

            ({ sessionId: socket.sessionId, id: socket.userId, username: socket.username } = userFindBySession);

            return next();
        }

    }

    if (socket.handshake.auth.username === null) {
        return next(new Error(`Provide a username please`));
    }

    try {

        const findUser = await db.User.findOne({ where: { username: socket.handshake.auth.username}});

        findUser.sessionId = randomId();

        await findUser.save();

        ({username: socket.username, sessionId: socket.sessionId, id: socket.userId} = findUser.dataValues);

        next();

    } catch (error) {

        return next(new Error(`Error occuring during the session generation.${error.message}`));

    }
}

function randomId() {
    const crypto = require('crypto');
    return crypto.randomBytes(8).toString("hex");


}