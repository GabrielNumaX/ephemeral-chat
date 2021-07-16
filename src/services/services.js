import axios from 'axios';

const checkUsername = async (username) => {

    return await axios({
        method: 'get',
        url: `/users/check-username/${username}`,
    })

}

const signup = async (data) => {

    return await axios({
        method: 'post',
        url: '/signup',
        data: {
            username: data.username,
            email: data.email,
            password: data.password,
        }
    })
}

const getUserData = async () => {

    return await axios({
        method: 'get',
        url: '/users',
    })
}

const login = async (data) => {

    return await axios({
        method: 'post',
        url: '/login',
        data: {
            email: data.username,
            password: data.password,
        }
    })
}

const getAllContacts = async () => {

    return await axios({
        method: 'get',
        url: '/contacts'
    })
}

const contactBlockUnblock = async (data) => {
    // console.log(data);
    return await axios({
        method: 'put',
        url: '/contacts/blockNOT',
        data: {
            contactId: data.contactId,
            block: data.block,
        }
    })
}

const contactDelete = async (data) => {
    // console.log(data);
    return await axios({
        method: 'put',
        url: '/contacts/removeNOT',
        data: {
            contactId: data.contactId,
        }
    })
}

const sendRequest = async (username) => {

    // console.log('send REQUEST');
    // console.log(username);

    return await axios({
        method: 'post',
        url: '/request',
        data: {
            username: username,
        }
    })
}

const acceptRequest = async (requestId) => {

    return await axios({
        method: 'put',
        url: '/request/accept',
        data: {
            requestId,
        }
    })
}

const rejectRequest = async (requestId) => {

    return await axios({
        method: 'put',
        url: '/request/delete',
        data: {
            requestId,
        }
    })
}

const getRequests = async () => {

    return await axios({
        method: 'get',
        url: '/requests',
    })
}

export const SERVICES = {
    checkUsername,
    signup,
    login,
    getUserData,
    getAllContacts,
    contactBlockUnblock,
    contactDelete,
    sendRequest,
    acceptRequest,
    rejectRequest,
    getRequests,
}