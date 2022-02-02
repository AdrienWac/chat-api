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
console.log('config', config.PORT);
httpServer.listen(config.PORT);
