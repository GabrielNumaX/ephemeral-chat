require('dotenv').config();
const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({

    username: {
        type: String,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        default: null,
    },
    contactsNumber: {
        type: Number,
        default: 0,
    },
    contacts: [{
        contactId: {
            type: Schema.Types.ObjectId
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isContact: {
            type: Boolean,
            default: true,
        }
    }],
    requests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Requests',
        }
    ]
});

userSchema.methods.generateAuthToken = function () {

    const token = jwt.sign({ id: this._id, username: this.username }, process.env.JWT);

    return token;
}

module.exports = model('Users', userSchema);