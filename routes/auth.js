var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');

router.get('/test', authController.test);

module.exports = router;
