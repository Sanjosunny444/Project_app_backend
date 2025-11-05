



const express = require('express');
const { signUp, getAllUsers, logout } = require('../controller/userController');
const { login } = require('../controller/userController');
const { verifyToken } = require('../config/isAuth');
const {verifyrefereshTokeninDB, renew_refresh_token} = require('../controller/tokenController');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.post('/logout', logout);
router.get("/getall", verifyToken, getAllUsers);
router.get("/verifyrefreshtoken", verifyrefereshTokeninDB);
router.post("/renew_refresh_token",renew_refresh_token);
module.exports = router;