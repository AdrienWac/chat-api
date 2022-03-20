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

        // io.to(socket.handshake.user.id).except(socket.id).emit('signout', socket.handshake.user);
        io.to(socket.handshake.user.id).emit('signout', socket.handshake.user);

        socket.broadcast.emit('user disconected', socket.handshake.user);

        try {

            const findUser = await db.User.findOne({ where: { id: socket.handshake.user.id } });

            if (findUser === null) {
                throw new Error(`Error during disconnect. User is not found`);
            }

            findUser.is_connected = false;

            await findUser.save();

        } catch (error) {

            console.log(`Error during disconnect. ${error.message}`);

        }

    });

    // J'emet un event lorsque je me déconnecte
    socket.on('disconnect', async () => {

        const matchingSockets = await io.in(socket.handshake.user.id).allSockets();

        if (matchingSockets.size === 0) {

            socket.broadcast.emit('user disconected', socket.handshake.user);

            try {

                const findUser = await db.User.findOne({ where: { id: socket.handshake.user.id } });

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
