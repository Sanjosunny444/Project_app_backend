



const express = require('express');
const { signUp } = require('../controller/userController');
const { login } = require('../controller/userController');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
module.exports = router;