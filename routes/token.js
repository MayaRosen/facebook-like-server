const express = require('express');
var router = express.Router();
const tokenController = require('../controllers/user');
// router.route('/')
router.post('/', tokenController.getToken);
module.exports = router;