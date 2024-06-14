const requestModel = require('../models/requestsModel');
const userModel = require('../models/userModel');

const requestController = {};

requestController.getRequests = async (req, res) => {

    const {
        user
    } = req;

    const requests = await requestModel.find({ receiverId: user.id })
        .populate('senderId');

    const filteredRequests = requests.map(req => {

        const obj = {
            _id: req._id,
            senderId: {
                username: req.senderId.username,
                image: req.senderId.image,
            }
        }

        return obj
    })

    return res.status(200).send({ requests: filteredRequests });
}

// this HAS to BE PUT
requestController.sendRequest = async (req, res) => {

    const {
        username
    } = req.body;

    const {
        user
    } = req;

    const requestReceiver = await userModel.findOne({ username: username });

    if (!requestReceiver) return res.status(404).send({ message: 'No user found' });

    const hasRequestFromSender = await requestModel.findOne({ 'senderId': user.id, 'receiverId': requestReceiver._id });

    if (hasRequestFromSender) return res.status(406).send({ message: 'Request already sent' });

    const hasRequestFromReceiver = await requestModel.findOne({ 'senderId': requestReceiver._id, 'receiverId': user.id });

    if (hasRequestFromReceiver) return res.status(406).send({ message: 'Request sent by contact' });

    const newRequest = await requestModel({
        senderId: user.id,
        receiverId: requestReceiver._id
    }).save();

    await userModel.findByIdAndUpdate(requestReceiver._id, {
        $push: {
            requests: newRequest._id,
        }
    }, { new: true })


    // TODO filter what I'm gonna send
    // return res.status(201).send({
    //     message: 'New request created',
    //     request: newRequest,
    //     requestReceiver: requestReceiver
    // });

    return res.status(201).send({ message: 'Request SENT' });

}


// sendRequest ADD senderId, receiverId;
// send NOTIF to FRONTEND
// handle ACCEPT with request._id
// on OPEN/REFRESH check requests API
// on ACCEPT add senderId and receiverId on contacts

requestController.requestAccept = async (req, res) => {

    const {
        requestId
    } = req.body;

    // HERE I have a request Document with sender and receiverId as well as a reference
    // in receiver.requests ARRAY
    // STEPS:
    // 01 - find request to get sender/receiver Id
    // 02 - add contact FOR BOTH sender/recevier
    // 03 - DELETE id from receiver.requests ARRAY
    // 04 - DELETE request document.

    const request = await requestModel.findById(requestId);

    if (!request) return res.status(404).send({ message: 'No request found' });

    // this can be request.senderId WITH NO POPULATE on request
    const sender = await userModel.findByIdAndUpdate(request.senderId, {
        $push: {
            contacts: {
                contactId: request.receiverId
            }
        },
        $inc: {
            'contactsNumber': 1
        }
    }, { new: true })

    const receiver = await userModel.findByIdAndUpdate(request.receiverId, {
        $push: {
            contacts: {
                contactId: request.senderId,
            }
        },
        $pull: {
            requests: request._id
        },
        $inc: {
            'contactsNumber': 1
        }
    }, { new: true })

    await request.deleteOne();

    // I should not return updated HERE
    // instead get query for all contacts on FRONT END
    // return res.status(200).send({ message: 'Contact Added', sender: sender, contact: receiver });
    return res.status(200).send({ message: 'Request Accepted' });

};


requestController.requestReject = async (req, res) => {

    const {
        requestId
    } = req.body;

    const request = await requestModel.findById(requestId);

    if (!request) return res.status(404).send({ message: 'No request found' });

    await userModel.findByIdAndUpdate(request.receiverId, {
        $pull: {
            requests: request._id
        },
    }, { new: true })

    await request.deleteOne();

    // I should not return updated HERE
    // instead get query for user DATA on FRONT END
    return res.status(200).send({ message: 'Request Rejected' });

};

module.exports = requestController;
