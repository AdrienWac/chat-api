const provider = require('../../provider');
const db = require('../../../models');
const UserController = require('../../../controllers/users.controller');

const mockRequest = (objectBodyDatas) => {
    return {
        body: objectBodyDatas,
    };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

let nextFunction = jest.fn(); 


describe('Add user', () => {

    beforeAll(async () => {
        // On initialise la bdd
        await db.sequelize.sync({ match: /^test_/, force: true });
    });

    afterEach(async () => {
        // On vide la base de donnée
        await db.sequelize.truncate();
    });

    it('Should add user in database', async () => {
        
        let user =provider.user.createSampleUser();
        
        const req = mockRequest(user);
        const res = mockResponse();

        try {
            
            await UserController.add(req, res, nextFunction);
            
            const findUser = await db.User.findOne({where: {username: user.username}});
            
            expect(findUser).not.toBeNull();

        } catch (error) {

            throw new Error(`Error ${error.message}`);    

        }
        
    });

    it ('Should return the user data', async () => {

        let user = provider.user.createSampleUser();

        const req = mockRequest(user);
        const res = mockResponse();

        const findUser = async () => {
            return await db.User.findOne({ where: { username: user.username } });
        };

        expect(await findUser()).toBeNull();

        await UserController.add(req, res, nextFunction);

        expect(res.send).toBeCalledWith(
            expect.objectContaining({
                code: expect.any(Number),
                message: expect.any(String),
                result: expect.any(Object)
            })
        );

    });

});