const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const SALT = 10;
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');


const userController = {};

userController.getUserData = async (req, res) => {

    const { user } = req;

    // Model.find()
    //     .populate({
    //         path: 'replies',
    //         populate: [{
    //             path: 'user',
    //             select: 'displayName username'
    //         }, {
    //             path: 'replies',
    //             populate: {
    //                 path: 'user',
    //                 select: 'displayName username'
    //             }
    //         }]
    //     }).exec(...

    const userData = await userModel.findById(user.id)
        .select('username image contactsNumber requests')
        // this DOES the trick for populating 
        // senderId and SELECTING which data I want to display
        .populate({
            path: 'requests',
            populate: [{
                path: 'senderId',
                select: 'username image'
            }]
        });

    return res.status(200).send(userData);
}

userController.getImage = async (req, res) => {

    const {
        user
    } = req;

    const userImage = await userModel.findById(user.id)
        .select('image');

    return res.status(200).send({ image: userImage.image })
}

userController.checkUsername = async (req, res) => {

    const {
        username
    } = req.params;

    const userCheck = await userModel.findOne({ username });

    if (userCheck) return res.status(406).send({ message: 'Username not available' });

    return res.status(200).send({ message: 'Username Available' });
}

userController.signUp = async (req, res) => {

    const {
        username,
        email,
        password,
    } = req.body;

    const salt = await bcrypt.genSalt(SALT);

    const hashPass = await bcrypt.hash(password, salt);

    await userModel({
        username,
        email,
        password: hashPass,
    }).save();

    return res.status(200).send({ message: 'User Created' });
}

userController.login = async (req, res) => {

    const {
        email,
        password,
    } = req.body;

    if (!email || !password) return res.status(404).send({ message: 'No data' });

    const checkEmail = await userModel.findOne({ email: email })
        .populate({
            path: 'requests',
            populate: [{
                path: 'senderId',
                select: 'username image'
            }]
        });

    if (!checkEmail) {

        const checkUser = await userModel.findOne({ username: email })
            .populate({
                path: 'requests',
                populate: [{
                    path: 'senderId',
                    select: 'username image'
                }]
            });;

        if (!checkUser) return res.status(400).send({ message: 'Invalid User or Password' })

        const checkPass = await bcrypt.compare(password, checkUser.password);

        if (!checkPass) return res.status(400).send({ message: 'Invalid User or Password' });

        const token = checkUser.generateAuthToken();

        return res.status(200).send({
            token: token,
            username: checkUser.username,
            contactsNumber: checkUser.contactsNumber,
            image: checkUser.image,
            requests: checkUser.requests,
        });
    }

    const checkPass = await bcrypt.compare(password, checkEmail.password);

    if (!checkPass) return res.status(400).send({ message: 'Invalid User or Password' });

    const token = checkEmail.generateAuthToken();

    return res.status(200).send({
        token: token,
        username: checkEmail.username,
        contactsNumber: checkEmail.contactsNumber,
        image: checkEmail.image,
        requests: checkEmail.requests,
    })
}

userController.updateUsername = async (req, res) => {

    const {
        newUsername,
    } = req.body;

    const {
        user,
    } = req;

    // this is ALREADY DONE in VALIDATION Middleware
    const userCheck = await userModel.findOne({ username: newUsername });

    if (userCheck) return res.status(406);

    const updateUsername = await userModel.findByIdAndUpdate(user.id, {
        username: newUsername,
    }, { new: true });

    return res.status(200).send({ username: updateUsername.username });
}

userController.updatePassword = async (req, res) => {

    const {
        password,
        newPassword
    } = req.body;

    const {
        user,
    } = req;

    const userToUpdate = await userModel.findById(user.id);

    if (!userToUpdate) return res.status(400).send({ message: 'Invalid User Data' });

    const checkPass = await bcrypt.compare(password, userToUpdate.password);

    if (!checkPass) return res.status(409).send({ message: 'Incorrect password' });

    const salt = await bcrypt.genSalt(SALT);

    const newPassHash = await bcrypt.hash(newPassword, salt);

    userToUpdate.password = newPassHash;

    await userToUpdate.save();

    return res.status(200).send({ message: 'Password changed' });


}

userController.userImageUpdate = async (req, res) => {

    const {
        user
    } = req;

    const fileCheck = await userModel.findById(user.id)
        .select('image');

    // console.log('fileCheck.image', fileCheck.image);
    // this checks that image is NOT null
    // so it has an image to delete
    // otherwise it saves image below
    if (fileCheck.image) {
        if (fs.existsSync(path.join(__dirname, '..', '..', fileCheck.image))) {
            // console.log('FILE EXISTS -> DELETE');
            fs.unlink(path.join(__dirname, '..', '..', fileCheck.image), (err) => {
                if (err) throw err;
                // console.log('file deleted');
            })
        }
    }

    const folder = './uploads';
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    const formatedName = req.file.originalname.split(' ').join('-');

    const fileName = `${Date.now()}-${formatedName}`

    await sharp(req.file.buffer)
        .resize({ width: 150 })
        .jpeg()
        .toFile(
            path.resolve(folder, fileName)
        )

    const imageUrl = `/uploads/${fileName}`;

    const userNewImage = await userModel.findByIdAndUpdate(user.id, {
        image: imageUrl
    }, { new: true })

    return res.status(201).send({
        message: 'Image uploaded',
        image: userNewImage.image
    })

}



module.exports = userController;