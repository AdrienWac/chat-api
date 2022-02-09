const db = require('../../../models');
const SocketMiddleware = require('../../../middlewares/socket');


// const db = jest.mock();

describe('Handle session', () => {
    let mockSocket;
    let nextFunction;
    beforeAll(() => {

        // await db.sequelize.sync({ force: true })
        nextFunction = jest.fn();

        mockSocket = {
            handshake: {
                auth: {
                    username: 'Jdoe'
                }
            }
        };

    })


    it('Should find session', async () => {

        const mockValue = {
            id: 1,
            sessionId: '123456',
            username: 'Jdoe'
        };
        // On mock un obj socket avec une session
        let test = JSON.parse(JSON.stringify(mockSocket));
        test.handshake.auth.sessionId = mockValue.sessionId;
        // On mock le modèle user avec une méthode find qui retourne un user 
        jest.mock('../../../models', () => {
            return {
                User: {
                    findOne: jest.fn().mockReturnValueOnce({ sessionId: mockValue.sessionId, username: mockValue.username})
                }
            }
        });
        // On appel la méthode du middleware
        SocketMiddleware.handleSession(test, nextFunction);
        // On vérifie que la fonction next est appelé sans paramètre
        expect(nextFunction).toHaveBeenCalled();
    });

    // it('Should create new session', () => {

    // });

    // it('Should return an error', () => {
    //     SocketMiddleware.handleSession(mockSocket, nextFunction);
    //     console.log('nextFunction.mock.calls[0][0]', nextFunction.mock.calls[0][0].constructor === Error);
    // });


})