const { Router } = require('express');
const router = Router();

const checkJwt = require('../middleware/tokenCheck');

const {
    requestUsernameVal,
    contactIdVal,
    requestIdVal,
    valResult,
} = require('../middleware/validation');

const {
    getRequests,
    sendRequest,
    requestAccept,
    requestReject,
} = require('../controllers/requestController');

router.get('/requests', checkJwt, getRequests)
router.post('/request', checkJwt, requestUsernameVal(), valResult, sendRequest);
router.put('/request/accept', checkJwt, requestIdVal(), valResult, requestAccept);
router.put('/request/delete', checkJwt, requestIdVal(), valResult, requestReject);

module.exports = router;