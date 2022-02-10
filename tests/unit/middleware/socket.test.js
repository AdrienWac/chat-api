
const SocketMiddleware = require('../../../middlewares/socket');
const provider = require('../../provider');

jest.mock('../../../models');

const mockDb = require('../../../models');

const nextFunction = jest.fn();

let mockSocketFactory = (authObject) => {
    return {
        handshake: {
            auth: authObject
        }
    };
};


describe('Handle session with id', () => {

    it('Should call next method', async () => {
        
        mockDb.User.findOne.mockImplementation(() => {
            return { id: 1, sessionId: '123456', username: 'Jdoe' }
        });

        let mockSocket = mockSocketFactory({username: 'Jdoe', sessionId: '123456'});

        await SocketMiddleware.handleSession(mockSocket, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

});

describe('Handle session without id', () => {
    
    let originalDb;

    beforeAll(async () => {
        originalDb = jest.requireActual('../../../models');
        // On initialise la bdd
        await originalDb.sequelize.sync({ match: /^test_/, force: true });
    });

    afterAll(async () => {
        // On vide la base de donnée
        await originalDb.sequelize.truncate();
    });

    it.skip('Should update user record', async () => {

        try {
            
            const userFromProvider = provider.user.createSampleUser();

            const createResult = await originalDb.User.create(userFromProvider);

            let mockSocket = mockSocketFactory(userFromProvider);

            await SocketMiddleware.handleSession(mockSocket, nextFunction);

            const { dataValues: userFind } = await originalDb.User.findOne({ where: { username: userFromProvider.username } });

            expect(userFind.sessionId).not.toBeNull();
            
        } catch (error) {
            throw new Error(error.message);
        }

    })

    it.skip('Should not found user', () => {

    });

});
