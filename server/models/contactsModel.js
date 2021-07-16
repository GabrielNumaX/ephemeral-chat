const { Schema, model } = require('mongoose');

const contactsSchema = new Schema({

    contactOwner: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    contactId: {
        type: Schema.Types.ObjectId
    },
    contactName: {
        type: String,
    },
    contactImage: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }
});

module.exports = model('Contacts', contactsSchema);