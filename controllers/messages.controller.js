const db = require('../models');

exports.save = async (content, recipientUser, socket) => {

    // On créé l'entité Message
    const messageInstance = db.Message.build({content: content, sender_id: socket.handshake.user.id, receiver_id: recipientUser.id});
    
    // On valide l'entité Message 
    // On enregistre le message 
    // On envoi le message via le socket

    // try {
    //     const message = await db.Message.create(basicMessage);
    //     return res.code(201).
    // } catch (error) {
        
    // }

}