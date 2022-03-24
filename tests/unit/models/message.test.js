const { now } = require('sequelize/dist/lib/utils');
const db = require('../../../models');
const provider = require('../../provider');


describe('Save simple message', () => {

    beforeAll(async () => {
        // On initialise la bdd
        try {
            await db.sequelize.sync({ match: /^test_/, force: true });
        } catch (error) {
            console.log('Before All Error', error.message);   
        }
    });

    // afterEach(async () => {
    //     await db.sequelize.truncate();
    // });

    it('Should save message in database', async () => {
        try {
            const basicMessage = provider.message.createBasicMessage();
            const user = await db.User.create({sessionId: 1, username: 'jDoe'});
            const message = await db.Message.create({content: 'test', sender_id: 1, receiver_id: 1, created: now(), updated: now()}); 
            const tessFind = await db.Message.findOne({where: {id: message.id}});
            const testGetSender = await tessFind.getSender();
            console.log('testGetSender', testGetSender);           
        } catch (error) {
            console.log('ERROR', error.message);
        }
    });



});