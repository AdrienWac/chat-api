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
    // Génère la liste des utilisateurs
    let users = [];

    let usersFindAll = await db.User.findAll();

    users = usersFindAll.map((user) => {
        return {
            userId: user.userId,
            username: user.username,
            is_connected: user.is_connected,
            messages: []
        }
    });

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
        userId: socket.userId,
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
    socket.on('disconnect', async () => {

        const matchingSockets = await io.in(socket.userId).allSockets();

        if (matchingSockets.size === 0) {

            socket.broadcast.emit('user disconected', socket.userId);

            try {

                const findUser = await db.User.findOne({ where: { id: socket.userId } });

                if (findUser === null) {
                    throw new Error(`Error during disconnect. User is not found`);
                }

                findUser.is_connected = false;

                await findUser.save();

            } catch (error) {

                console.log(`Error during disconnect. ${error.message}`);

            }

        }
        
    });

});

httpServer.listen(config.PORT);
