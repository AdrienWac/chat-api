const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require('./config');
const SocketMiddleware = require('./middlewares/socket');

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: config.CLIENT_URL
    }
});

io.use(SocketMiddleware.handleSession);

io.on('connection', (socket) => {
    // Génère la liste des utilisateurs
    const users = [];

    for (let [id, socket] of io.of('/').sockets) {
        users.push({
            userId: id,
            username: socket.username,
            messages: []
        });
    }

    // On rejoins ma room. Si d'autres onglet sont ouverts pour un même user, toutes les instances rejoindront la même room et pourront recevoir les messages
    socket.join(socket.userId);

    socket.emit('users', users);

    // Emission des informations de session
    socket.emit('session', {
        sessionId: socket.sessionId,
        userId: socket.userId
    });

    // Emet un évènement de connexion aux autres connectés avec les informations de l'utilisateur
    socket.broadcast.emit('user connected', {
        userId: socket.id,
        username: socket.username,
        messages: []
    });

    // Reception d'un événement message privé
    socket.on('private message', ({content, to}) => {
        // On créé un channel privé(to()) et on émet un évènement private message
        socket.to(to).to(socket.userId).emit('private message', {
            content,
            from: socket.id,
            to: to
        });
    });

    // J'emet un event lorsque je me déconnecte
    socket.on('disconnect', () => {
        socket.broadcast.emit('user disconected', socket.id);
    });

});

httpServer.listen(config.PORT);
