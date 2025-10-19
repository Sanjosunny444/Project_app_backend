



const express = require('express');
const { signUp, getAllUsers } = require('../controller/userController');
const { login } = require('../controller/userController');
const { verifyToken } = require('../config/isAuth');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get("/getall", verifyToken, getAllUsers);
module.exports = router;