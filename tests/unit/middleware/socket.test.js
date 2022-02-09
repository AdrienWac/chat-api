
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


    it('Should call next method', async () => {
        
        db.User.findOne.mockImplementation(() => {
            return { id: 1, sessionId: '123456', username: 'Jdoe' }
        });

        let mockSocket = mockSocketFactory({username: 'Jdoe', sessionId: '123456'});

        await SocketMiddleware.handleSession(mockSocket, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
    });

    it('Should return an error', () => {


        
        // db.User.findOne.mockImplementation(() => {
        //     return null;
        // });

        // let mockSocket = mockSocketFactory({ username: 'Jdoe', sessionId: '123456' });

        // SocketMiddleware.handleSession(mockSocket, nextFunction);

        // console.log('nextFunction.mock.calls[0][0]', nextFunction.mock.calls[0][0].constructor === Error);

    });


})