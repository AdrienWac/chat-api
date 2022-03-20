const db = require('../../../models');
const provider = require('../../provider');


describe('Save simple message', () => {

    beforeAll(async () => {
        // On initialise la bdd
        await db.sequelize.sync({ match: /^test_/, force: true });
    });

    afterEach(async () => {
        await db.sequelize.truncate();

    });

    it('Should save message in database', async () => {
        const basicMessage = provider.message.createBasicMessage();
        const message = await db.Message.create(basicMessage);
    });



});