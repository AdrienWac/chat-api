const { now } = require('sequelize/dist/lib/utils');
const db = require('../../../models');
const provider = require('../../provider');


describe('Message model tests', () => {

    let user, message, findMessage, senderMessage = null;
    
    beforeAll(async () => {
        // On initialise la bdd
        try {
            await db.sequelize.sync({ match: /^test_/, force: true });
            user = await db.User.create({ sessionId: 1, username: 'jDoe' });
        } catch (error) {
            console.log('ERRORRR', error.message);   
        }
    });

    // afterAll(async () => {
    //     await db.sequelize.truncate();
    // });

    it('Should save message in database', async () => {

        try {

            const basicMessage = provider.message.createBasicMessage();
            message = await db.Message.create({ content: 'test', sender_id: 1, receiver_id: 1, created: now(), updated: now() });
            
        } catch (error) {
            console.log('ERROR', error.message);
        }

        expect(message).not.toBeNull();
        
    });
    
    it('Should get the message from db', async () => {
        findMessage = await db.Message.findOne({ where: { id: message.id } });
        expect(findMessage).not.toBeNull();
    });
    
    it('Should get the sender from message', async () => {
        senderMessage = await findMessage.getSender();
        expect(senderMessage).not.toBeNull();
        expect(senderMessage.username).toBe(user.username);
    });

    it('Shouldn\'t create message because user doesn\'t exist', async () => {

        const newMessageFromProvider = provider.message.createBasicMessage();
        newMessageFromProvider.sender_id = 2;
        // TODO Modifier ce test. Comment tester qu'une promesse retourne une erreur ?
        // expect(() => {db.Message.create(newMessageFromProvider)}).rejects().toThrow() Ne fonctionne pas
        let message = null;
        try {
            message = await db.Message.create(newMessageFromProvider);
        } catch (error) {
            
        } finally {
            expect(message).toBeNull();
        }

    });

    it.todo('Shouldn\'t not update message because user doesn\'t exist');

});