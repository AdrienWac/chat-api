const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require('./config');
const SocketMiddleware = require('./middlewares/socket');
const db = require('./models');

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: config.CLIENT_URL
    }
});

let socketsByUserId = {};

io.use(SocketMiddleware.handleSession);

io.on('connection', async (socket) => {

    socketsByUserId[socket.handshake.user.id] = { ...socketsByUserId[socket.handshake.user.id], ...{[socket.id]: socket}};

    // On rejoins ma room. Si d'autres onglet sont ouverts pour un même user, toutes les instances rejoindront la même room et pourront recevoir les messages
    socket.join(socket.handshake.user.id);
    
    let usersFindAll = await db.User.findAll();

    socket.emit('users', usersFindAll);

    // Emet un évènement de connexion aux autres connectés avec les informations de l'utilisateur
    socket.broadcast.emit('user connected', socket.handshake.user);

    // Reception d'un événement message privé
    socket.on('private message', ({content, recipientUser}) => {
        // On créé un channel privé(to()) et on émet un évènement private message
        socket.to(recipientUser.id).to(socket.handshake.user.id).emit('private message', {
            content,
            from: socket.handshake.user,
            to: recipientUser
        });
    });

    socket.on('user typing', ({ content, userSender, userReceiver}) => {

        if (content.length > 0) {
            socket.to(userReceiver.id).emit('start typing', { user: userSender, state: true });
        }

        if (content.length == 0) {
            socket.to(userReceiver.id).emit('end typing', { user: userSender, state: false });
        }

    });

    // J'emet un event lorsque je me déconnecte
    socket.on('disconnect', async () => {

        const getBroOfSocket = await getBro(socket.handshake.user.id, io);

        if (getBroOfSocket.size === 0) {
            notifyOtherSocket({ socket, eventName: 'user disconected', params: socket.handshake.user });
            const UserController = require('./controllers/users.controller');
            await UserController.setUserConnectedState(socket.handshake.user.id);
        }
        
    });

    

});

httpServer.listen(config.PORT);

const notifyOtherSocket = ({ socket, eventName, params }) => {
    socket.broadcast.except(socket.handshake.user.id).emit(eventName, params);
};

const notifyBro = ({io, allSockets, currentSocket, eventName, params}) => {

    Object.getOwnPropertyNames(allSockets).forEach(socketId => {

        if (socketId !== currentSocket.id) {
            console.log('NOTIFY BRO CURRENT SOCKET', currentSocket.id);
            console.log('NOTIFY BRO ELEMENT', socketId);
            // socket.to(socket.handshake.user.id).except(socket.id).emit(eventName, params);
            io.to(socketId).emit(eventName, params);
        }

    });
    
    
}

const hasBro = async (userId, io) => {
    const matchingSockets = await io.in(userId).allSockets();
    return matchingSockets.size > 1;
};

const getBro = async (userId, io) => {
    const matchingSockets = await io.in(userId).allSockets();
    return matchingSockets;
}

exports.notifyOtherSocket = notifyOtherSocket;
exports.notifyBro = notifyBro;
exports.hasBro = hasBro;
exports.getSocket = (userId = null, socketId = null) => {

    if (userId && socketId) {
        return socketsByUserId[userId][socketId];
    }

    if (userId) {
        return socketsByUserId[userId];
    }

    return socketsByUserId;
}
exports.getIo = () => {
    return io;
};

