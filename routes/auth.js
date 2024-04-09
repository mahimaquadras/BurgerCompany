const express = require('express');
const authController = require('../controllers/auth')

const router = express.Router();

router.post('/register', authController.register );
router.post('/login', authController.login);

module.exports = router; //for export these router that we created and that we are giving in here for ourpages