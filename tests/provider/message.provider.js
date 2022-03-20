const db = require("../../models");

const createBasicMessage = () => {

    return {
        'content': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        'sender_id': 1,
        'receiver_id': 1
    };
};

module.exports.createBasicMessage = createBasicMessage;