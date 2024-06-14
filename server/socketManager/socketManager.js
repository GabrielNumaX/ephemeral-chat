const io = require('../index');

const userModel = require('../models/userModel');

const {
    VERIFY_USER,
    USER_CONNECTED,
    USER_DISCONNECTED,
    IS_TYPING,
    USER_TYPING,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    SEND_ALL_ONLINE_USERS,
    SEND_REQUEST,
    RECEIVE_REQUEST,
} = require('../../src/socketEvents/socketEvents');

let usersConnected = [];

module.exports = function async(socket) {

    // verify USERNAME not TAKEN-> also REGISTERED users TODO
    socket.on(VERIFY_USER, async (username, callback) => {

        // handle DB check for REGISTERED username
        const userCheck = await regUserCheck(username)

        if (!userCheck) {

            return callback(true)
        }

        if (isUserTaken(usersConnected, username)) {

            return callback(true);
        }

        // set to user list->send user list to CLIENT
        callback(false);
    })

    // add verified USER
    socket.on(USER_CONNECTED, ({ user, isRegistered }) => {

        // handle ADD user for REGISTERED
        // can ADD default values in PARAMS
        // overwrite them from REGIS users
        addUser(usersConnected, user, socket.id, isRegistered);

        // bug on language CHANGE it was ADDING same user AGAIN
        //filter unique USERS with this

        usersConnected = Array.from(new Set(usersConnected.map(a => a.socketId)))
            .map(socketId => {
                return usersConnected.find(a => a.socketId === socketId)
            })

            try {
                io.emit(SEND_ALL_ONLINE_USERS, usersConnected);
            }
            catch(serverError) {
                console.log({serverError});
            }
    })

    // disconnect USER from Room->LogOut
    // on LogOut user loses socket.id and CANNOT login AGAIN
    // without REFRESHING browser
    // FIXED this with window.location.reload() on handleLogout
    // to get a new socket.id again for THAT browser 
    socket.on(USER_DISCONNECTED, (user) => {

        usersConnected = removeUser(usersConnected, user);
        io.emit(SEND_ALL_ONLINE_USERS, usersConnected);
    })

    // disconnect USER from Browser->OnClose
    socket.on('disconnect', () => {
        // remove by socket.id;
        usersConnected = removeById(usersConnected, socket.id);

        io.emit(SEND_ALL_ONLINE_USERS, usersConnected);
    })

    socket.on(IS_TYPING, ({ userTypingId, isTyping, userWhoIsTyping }) => {

        io.to(userTypingId).emit(USER_TYPING, ({ isTyping, userWhoIsTyping }))
    })

    socket.on(SEND_MESSAGE, ({ message, messageSender, messageSocketId, image }) => {

        io.to(messageSocketId).emit(RECEIVE_MESSAGE, ({ message, messageSender, image }))
    })

    socket.on(SEND_REQUEST, ({ receiverSocketId, sender }) => {

        io.to(receiverSocketId).emit(RECEIVE_REQUEST, ({ sender }))
    })
}

const regUserCheck = async (username) => {

    const userCheck = await userModel.findOne({ username })

    if (userCheck) return false;

    return true;
}

// implement DB check for REG users -> on ANOTHER FUNCTION
const isUserTaken = (usersArr, username) => {

    return usersArr.find(user => user.username === username);
}

// optional/default PARAMETER
const addUser = (usersArr, username, socketId, isRegistered = false) => {

    return usersArr.push({ username, isOnline: true, socketId, isRegistered: isRegistered })
}

const removeUser = (usersArr, username) => {

    return usersArr.filter(user => user.username !== username);
}

const removeById = (usersArr, socketId) => {

    return usersArr.filter(user => user.socketId !== socketId);
}

