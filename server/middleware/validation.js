const { body, validationResult, check } = require("express-validator");
const userModel = require('../models/userModel');
const ObjectId = require('mongoose').Types.ObjectId;

const usernameVal = () => {

    return [
        body('username').notEmpty().isLength({ min: 2, max: 24 }).custom(user => {

            return userModel.findOne({ username: user }).then(user => {
                if (user) {
                    return Promise.reject('Username already in use');
                }
            });
        }),
    ]
};

const signUpVal = () => {

    return [
        body('email').notEmpty().isEmail().withMessage('Invalid Email').custom(email => {

            return userModel.findOne({ email: email }).then(email => {
                if (email) {
                    return Promise.reject('Email already in use')
                }
            })
        }),
        body('username').notEmpty().isLength({ min: 2, max: 24 }).withMessage('Invalid Username')

            .custom(user => {

                return userModel.findOne({ username: user }).then(user => {
                    if (user) {
                        return Promise.reject('Username already in use');
                    }
                });
            })
        ,
        body('password').notEmpty().isLength({ min: 8, max: 32 }).withMessage('Password not Valid'),
    ]
};

const contactIdVal = () => {

    return [
        check('contactId').isMongoId(),
    ]
}

const requestIdVal = () => {

    return [
        check('requestId').isMongoId(),
    ]
}

const changePassVal = () => {

    return [
        body('password').notEmpty().isLength({ min: 8, max: 32 }).withMessage('Password not Valid'),
        body('newPassword').notEmpty().isLength({ min: 8, max: 32 }).withMessage('Password not Valid'),
    ]
}

const changeUserVal = () => {

    return [
        body('newUsername').notEmpty().isLength({ min: 2, max: 24 }).withMessage('Invalid username')
            .custom(user => {

                return userModel.findOne({ username: user }).then(user => {
                    if (user) {
                        return Promise.reject('Username already in use');
                    }
                });
            }),
    ]
}

const imageVal = () => {

    return [
        check('profileImg')
            // Here you check that file input is required
            .custom((value, { req }) => {
                if (!req.file) return Promise.reject("Profile Image is required");
                return true;
            }),
    ]
}

const requestLinkVal = () => {

    return [
        body('email').notEmpty().isEmail().withMessage('Invalid Email')
    ]
}

const resetPassVal = () => {

    return [
        body('password').notEmpty().isLength({ min: 8, max: 32 }).withMessage('Password not Valid'),
        body('userId').notEmpty().withMessage('Invalid Data'),
        body('token').notEmpty().withMessage('Invalid Data'),
    ]
}

const requestUsernameVal = () => {

    return [
        body('username').notEmpty().isLength({ min: 2, max: 24 }).withMessage('Username Required for Request')
    ]
};
const valResult = (req, res, next) => {

    const error = validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();

    if (hasError) {
        res.status(422).json({ error: error.array() });
    } else {
        next();
    }
}


const isValidObjectId = (id) => {

    if (ObjectId.isValid(id)) {
        if ((String)(new ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

module.exports = {
    usernameVal,
    signUpVal,
    contactIdVal,
    requestIdVal,
    valResult,
    changePassVal,
    changeUserVal,
    imageVal,
    isValidObjectId,
    requestLinkVal,
    resetPassVal,
    requestUsernameVal,
};