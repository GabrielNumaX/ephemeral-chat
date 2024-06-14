const userModel = require('../models/userModel');

const contactsController = {};

contactsController.contactGetAll = async (req, res) => {

    const {
        user
    } = req;

    let allContacts = await userModel.findById(user.id)
        .select('username image contactsNumber')
        .select('contacts.isBlocked contacts.isContact')
        .populate({
            path: 'contacts.contactId',
            select: 'username image',
            // this DOES NOT works in MONGOOSE
            // options: {
            //     sort: 'contacts.contactId.username'
            // }
        })

    let contactsSorted = null;

    if (Array.isArray(allContacts.contacts) && allContacts.contacts.length) {
        const contactsToSort = [...allContacts.contacts];

        contactsSorted = contactsToSort.sort((a, b) => {

            if (a.contactId.username > b.contactId.username)
                return 1;
            if (a.contactId.username < b.contactId.username)
                return -1;
            return 0;
        });
    }

    if (Array.isArray(contactsSorted) && contactsSorted.length) {

        allContacts.contacts = [...contactsSorted]
    }

    return res.status(200).send(allContacts);

}

// handle REMOVE contacts for ContactId
contactsController.contactRemove = async (req, res) => {

    const {
        contactId
    } = req.body;

    const {
        user
    } = req;

    const userRemoveContact = await userModel.findByIdAndUpdate(user.id, {
        $pull: {
            contacts: {
                contactId: contactId
            }
        },
        $inc: {
            'contactsNumber': -1,
        }
    }, { new: true });

    const contactRemoveUser = await userModel.findByIdAndUpdate(contactId, {
        $pull: {
            contacts: {
                contactId: user.id
            }
        },
        $inc: {
            'contactsNumber': -1,
        }
    }, { new: true });

    // I should not return updated HERE
    // instead get query for all contacts ON FRONT END
    return res.status(200).send({ message: 'Contact Removed' });
};

contactsController.contactBlockUnblock = async (req, res) => {

    const {
        contactId,
        block
    } = req.body;

    const {
        user
    } = req;

    const userBlockUnblockContact = await userModel.findOneAndUpdate({
        '_id': user.id, 'contacts.contactId': contactId
    }, {
        $set: {
            'contacts.$.isBlocked': block
        }
    }, { new: true })

    // I should not return updated HERE
    // instead get query for all contacts 
    return res.status(200).send({ message: 'Contact Block or Unblock' });
};

module.exports = contactsController;