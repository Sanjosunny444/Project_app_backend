



const express = require('express');
const { signUp, getAllUsers } = require('../controller/userController');
const { login } = require('../controller/userController');
const { verifyToken } = require('../config/isAuth');
const {verifyrefereshTokeninDB} = require('../controller/tokenController');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get("/getall", verifyToken, getAllUsers);
router.get("/verifyrefreshtoken", verifyrefereshTokeninDB);
module.exports = router;