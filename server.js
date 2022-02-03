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
            username: socket.username
        });
    }

    socket.emit('users', users);

    // Emet un évènement de connexion aux autres connectés avec les informations de l'utilisateur
    socket.broadcast.emit('user connected', {
        userId: socket.id,
        username: socket.username
    });

});

httpServer.listen(config.PORT);
