import * as actionTypes from './actionTypes';

export const toggleHeader = (bool) => dispatch => {
    dispatch({
        type: actionTypes.TOGGLE_HEADER,
        payload: bool,
    })
}

export const setLogInOut = (bool) => dispatch => {
    dispatch({
        type: actionTypes.SET_LOG_IN_OUT,
        payload: bool,
    })
}

export const setUser = (user) => dispatch => {

    dispatch({
        type: actionTypes.SET_USER,
        payload: user,
    })
}

export const setUserImage = (image) => dispatch => {

    dispatch({
        type: actionTypes.SET_USER_IMAGE,
        payload: image,
    })
}

export const setAllContacts = (contacts) => dispatch => {
    dispatch({
        type: actionTypes.SET_ALL_CONTACTS,
        payload: contacts,
    })
}

export const setOnlineUsers = (users) => dispatch => {
    dispatch({
        type: actionTypes.SET_ONLINE_USERS,
        payload: users,
    })
}

export const setSelectedContact = (contact) => dispatch => {
    dispatch({
        type: actionTypes.SET_SELECTED_CONTACT,
        payload: contact,
    })
}

export const setIsTyping = (isTyping) => dispatch => {
    dispatch({
        type: actionTypes.IS_TYPING,
        payload: isTyping,
    })
}

export const setAllChats = (chatObj) => dispatch => {

    dispatch({
        type: actionTypes.SET_ALL_CHATS,
        payload: chatObj,
    })
}

export const setToast = (toastData) => dispatch => {

    dispatch({
        type: actionTypes.SET_TOAST,
        payload: toastData,
    })

    setTimeout(() => {
        dispatch({
            type: actionTypes.SET_TOAST,
            payload: {
                message: '',
                showToast: false,
                type: '',
            }
        });
    }, 3000)
}

export const closeToast = () => dispatch => {

    const data = {
        message: '',
        showToast: false,
        type: '',
    }

    dispatch({
        type: actionTypes.SET_TOAST,
        payload: data
    })
}

export const populateRequests = (requests) => dispatch => {

    dispatch({
        type: actionTypes.HANDLE_REQUESTS,
        // validate THESE and proceed accordingly in REDUCER
        payload: {
            requests: requests,
            ammount: requests.length,
        }
    })
}