const { Router } = require('express');
const router = Router();

const checkJwt = require('../middleware/tokenCheck');

const {
    signUpVal,
    valResult,
    changePassVal,
    changeUserVal,
    imageVal,
} = require('../middleware/validation');

const {
    getUserData,
    getImage,
    signUp,
    login,
    checkUsername,
    updatePassword,
    updateUsername,
    userImageUpdate,
} = require('../controllers/userController');

const upload = require('../middleware/imageUpload');

router.post('/signup', signUpVal(), valResult, signUp);
router.post('/login', login);
router.get('/users', checkJwt, getUserData);
router.get('/users/image', checkJwt, getImage)
router.get('/users/check-username/:username', checkUsername);
router.put('/users/change-password', checkJwt, changePassVal(), valResult, updatePassword);
router.put('/users/change-username', checkJwt, changeUserVal(), valResult, updateUsername);
router.put('/users/profile-image', checkJwt, upload.single('profileImg'),
    imageVal(), valResult, userImageUpdate)

module.exports = router;
