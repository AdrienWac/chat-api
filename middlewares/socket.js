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

    

    // Create Session
        // sessionId/userId/username=...
    // Set socket property
        // socket.sessionId//socket.userId//socket.username = ...
}