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

io.use(SocketMiddleware.handleSession);

io.on('connection', async (socket) => {

    exports.getSocket = () => {
        return socket;
    }

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

    socket.on('signout', async () => {

        // io.to(socket.handshake.user.id).emit('signout', socket.handshake.user);

        console.log('EMIT SIGNOUT EVENT FROM BRO');

    });

    // J'emet un event lorsque je me déconnecte
    socket.on('disconnect', async () => {

        const getBroOfSocket = await getBro(socket.handshake.user.id, io);

        if (getBroOfSocket.size === 0) {

            console.log('SOCKET IS DISCONNECTED WITHOUT BRO', socket.handshake.user.id);
            notifyOtherSocket({ socket, eventName: 'user disconected', params: socket.handshake.user });
            const UserController = require('./controllers/users.controller');
            await UserController.setUserConnectedState(socket.handshake.user.id);
            
        }
        
    });

    

});

httpServer.listen(config.PORT);

const notifyOtherSocket = ({ socket, eventName, params }) => {
    console.log(`EMIT ${eventName} EVENT TO OTHER SOCKET`);
    socket.broadcast.emit(eventName, params);
};

const notifyBro = ({io, socket, eventName, params}) => {
    console.log(`EMIT ${eventName} EVENT TO ALL BRO`);
    io.to(socket.handshake.user.id).emit(eventName, params);
}

const hasBro = async (userId, io) => {
    const matchingSockets = await io.in(userId).allSockets();
    console.log('HAS BRO ? ', matchingSockets.size > 1);
    return matchingSockets.size > 1;
};

const getBro = async (userId, io) => {
    const matchingSockets = await io.in(userId).allSockets();
    return matchingSockets;
}

exports.notifyOtherSocket = notifyOtherSocket;
exports.notifyBro = notifyBro;
exports.hasBro = hasBro;
exports.getIo = () => {
    return io;
};

