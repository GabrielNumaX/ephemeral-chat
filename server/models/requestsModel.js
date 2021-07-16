const { Schema, model } = require('mongoose');

const requestSchema = new Schema({

    // it has to have ref: 'Users'
    // or populated DOES NOT WORKS
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

module.exports = model('Requests', requestSchema);