const express = require('express');
const router = express.Router();
const { joinWaitlist, getWaitlist } = require('../controller/waitlistcontroller');


router.post('/', joinWaitlist);
router.get('/', getWaitlist);

module.exports = router;
