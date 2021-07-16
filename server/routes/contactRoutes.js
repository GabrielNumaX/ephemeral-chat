const { Router } = require('express');
const router = Router();

const checkJwt = require('../middleware/tokenCheck');

const {
    contactIdVal,
    valResult,
} = require('../middleware/validation');

const {
    contactRemove,
    contactGetAll,
    contactBlockUnblock,
} = require('../controllers/contactsController');


router.get('/contacts', checkJwt, contactGetAll);
router.put('/contacts/remove', checkJwt, contactIdVal(), valResult, contactRemove);
router.put('/contacts/block', checkJwt, contactIdVal(), valResult, contactBlockUnblock);

module.exports = router;