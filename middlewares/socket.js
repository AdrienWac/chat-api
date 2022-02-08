exports.handleSession = (socket, next) => {

    const { username } = socket.handshake.auth;

    if (!username) {
        return next(new Error('Invalid username'));
    }

    socket.username = username;

    next();
    
    // If founded session
        // Set socket property with datas of session founded
            // socket.sessionId//socket.userId//socket.username = ...
        // return next();

    // If is not unique Username
        // return next(new Error)

    // Create Session
        // sessionId/userId/username=...
    // Set socket property
        // socket.sessionId//socket.userId//socket.username = ...
}