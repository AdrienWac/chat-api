
const SocketMiddleware = require('../../../middlewares/socket');

jest.mock('../../../models');

const db = require('../../../models');

let mockSocketFactory = (authObject) => {
    return {
        handshake: {
            auth: authObject
        }
    };
};


describe('Handle session', () => {

    let nextFunction;
    
    beforeAll(() => {

        // await db.sequelize.sync({ force: true })
        nextFunction = jest.fn();

    })


    it.only('Should call next method', async () => {
        
        db.User.findOne.mockImplementation(() => {
            return { id: 1, sessionId: '123456', username: 'Jdoe' }
        });

        let mockSocket = mockSocketFactory({username: 'Jdoe', sessionId: '123456'});

        await SocketMiddleware.handleSession(mockSocket, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

});

describe('Mise à jour de l\'enregistrementu du user', () => {

    beforeAll(async () => {
        // On initialise la bdd
        await db.sequelize.sync({ match: /^test_/, force: true });
    });

    afterAll(async () => {
        // On vide la base de donnée
        await db.sequelize.truncate();
    });


    it('Should update user', async () => {
        
        try {
            
            // Création d'un utilisateur 
            await db.User.create({username: 'Jdoe'});
            
            let mockSocket = mockSocketFactory({ username: 'Jdoe', sessionId: '123456' });
            
            await SocketMiddleware.handleSession(mockSocket, nextFunction);

            const {dataValues: userFind} = await db.User.findOne({where: {username: 'Jdoe'}});

            expect(userFind.sessionId).not.toBeNull();


        } catch (error) {
            console.log(`Error ${error.message}`);
        }

    });

    it('Should not found user', () => {

    });

});

describe('Mise à jour de l\'objet socket', () => {
    // socket = mockSocketFactory...
    // const { Server } = require("socket.io");
    // Création d'un mock de Server.use qui appel le middleware avec le mock de socket et de la fonction next()
    // But est de vérifier les nouvelles propriétés sur l'objet socket

});
