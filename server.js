const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");
const config = require('./config');

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: config.CLIENT_URL
    }
});

io.use((socket, next) => {

    const { username } = socket.handshake.auth;

    if (!username) {
        return new(new Error('Invalid username'));
    }

    socket.username = username;

    next();
    
});

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

    socket.emit('users', users);

    // Emet un évènement de connexion aux autres connectés avec les informations de l'utilisateur
    socket.broadcast.emit('user connected', {
        userId: socket.id,
        username: socket.username,
        messages: []
    });

    // Reception d'un événement message privé
    socket.on('private message', ({content, to}) => {
        // On créé un channel privé(to()) et on émet un évènement private message
        socket.to(to).emit('private message', {
            content,
            from: socket.id,
            to: to
        });
    });

});

httpServer.listen(config.PORT);
