import * as actionTypes from './actionTypes'

const initialState = {
    showHeader: false,
    isLoggedIn: false,
    username: localStorage.getItem('username') ? localStorage.getItem('username') : localStorage.getItem('ephemeral-username') ? localStorage.getItem('ephemeral-username') : null,
    contactsNumber: Number.isNaN(parseInt(localStorage.getItem('contacts-amount'))) ? (parseInt(localStorage.getItem('contacts-amount')) === 0 ? null : parseInt(localStorage.getItem('contacts-amount'))) : null,
    userImage: localStorage.getItem('user-image') ? localStorage.getItem('user-image') : null,
    contacts: false,
    onlineUsers: false,
    selectedContact: null,
    isTyping: false,
    allChats: [],
    toast: {
        showToast: false,
        message: '',
        type: '',
    },
    hasRequests: false,
    requestsAmount: 0,
    requests: [],
}
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TOGGLE_HEADER:
            return { ...state, showHeader: action.payload }
        case actionTypes.SET_LOG_IN_OUT:
            return { ...state, isLoggedIn: action.payload }
        case actionTypes.SET_USER:
            return {
                ...state,
                username: action.payload.username,
                userImage: action.payload.image,
                contactsNumber: action.payload.contactsNumber
            }
        case actionTypes.SET_ALL_CONTACTS:
            return { ...state, contacts: [...action.payload] }
        case actionTypes.SET_ONLINE_USERS:
            return { ...state, onlineUsers: [...action.payload] }
        case actionTypes.SET_SELECTED_CONTACT:
            return { ...state, selectedContact: action.payload }
        case actionTypes.IS_TYPING:
            return { ...state, isTyping: action.payload }
        case actionTypes.SET_ALL_CHATS:

            const user = state.allChats.find(item => item.contact === action.payload.contact);

            // no contact FOUND in allChats state
            if (!user) {
                const obj = {
                    contact: action.payload.contact,
                    messages: [
                        {
                            sender: action.payload.sender,
                            message: action.payload.message,
                            date: action.payload.date,
                            image: action.payload.image,
                        }
                    ]
                }

                return { ...state, allChats: [...state.allChats, obj] }
            }
            // contacts FOUND in allChats state
            else {

                const newMessage = {
                    contact: action.payload.contact,
                    messages: {
                        sender: action.payload.sender,
                        message: action.payload.message,
                        date: action.payload.date,
                        image: action.payload.image,
                    }
                }

                for (let i in state.allChats) {

                    if (state.allChats[i].contact === newMessage.contact) {

                        state.allChats[i].messages = [...state.allChats[i].messages, newMessage.messages];

                        break;
                    }
                }
                
                // here we UPDATE state for EXISTING contact
                return { ...state, allChats: [...state.allChats] }
            }
        case actionTypes.SET_TOAST:
            // this handles SHOWING toast on receive MESSAGE for users NOT SELECTED
            if (action.payload.type === 'chat' && action.payload.message !== state.selectedContact) {

                return { ...state, toast: { ...action.payload } }
            }
            else if (!action.payload.showToast) {

                return { ...state, toast: { ...action.payload } }
            }
            else if (action.payload.type === 'error') {

                return { ...state, toast: { ...action.payload } }
            }
            else if (action.payload.type === 'success') {

                return { ...state, toast: { ...action.payload } }
            }
            return { ...state }
        case actionTypes.INCREASE_REQUESTS:

            const incAmount = parseInt(state.requestsAmount) + parseInt(action.payload);

            return { ...state, hasRequests: true, requestsAmount: incAmount };

        case actionTypes.DECREASE_REQUESTS:

            const decAmount = parseInt(state.requestsAmount) - parseInt(action.payload);

            if (decAmount < 0) return { ...state, hasRequests: false, requestsAmount: 0 };

            if (decAmount === 0) return { ...state, hasRequests: false, requestsAmount: decAmount };

            return { ...state, hasRequests: true, requestsAmount: decAmount };

        case actionTypes.HANDLE_REQUESTS:

            if (!(Array.isArray(action.payload.requests) && action.payload.requests.length)) {

                return { ...state, requests: [], requestsAmount: 0, hasRequests: false }
            }

            return {
                ...state,
                requests: [...action.payload.requests],
                requestsAmount: action.payload.requests.length,
                hasRequests: true,
            };

        case actionTypes.SET_USER_IMAGE:

            return { ...state, userImage: action.payload }

        default:
            return state
    }
}

export default appReducer;