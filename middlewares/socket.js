const db = require('../models');

exports.handleSession = async (socket, next) => {

    const sessionId = socket.handshake.auth.sessionId;

    if (sessionId) {
        
        const session = await db.User.findOne({where: {sessionId: sessionId}});
        
        if (session !== null) {
            ({ sessionId: socket.sessionId, id: socket.userId, username: socket.username } = session);
            return next();
        }

    }

    // const { username } = socket.handshake.auth;

    // if (!username) {
    //     return next(new Error('Invalid username'));
    // }

    // socket.username = username;

    // next();
    
    // const sessionId = socket.handshake.auth.sessionId;

    // if (sessionId) {

    //     const session = await db.User.findOne({ where: { sessionId: sessionId } });
        
    //     if (session !== null) {
    //         // Set socket property with datas of session founded
    //         ({ sessionId: socket.sessionId, id: socket.userId, username: socket.username } = session);
    //         return next();
    //     }

    // }
    
        

    // If is not unique Username
        // return next(new Error)

    // Create Session
        // sessionId/userId/username=...
    // Set socket property
        // socket.sessionId//socket.userId//socket.username = ...
}