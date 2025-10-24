



// const User = require('../models/userModels');
// const jwt = require('jsonwebtoken');
const Token_model = require('../models/tokenModel');

exports.checklimitplus_tokens = async (username) => { //check if tokens are more than 5
    try {
        const tokenEntry = await Token_model.findOne({ username });
        if (tokenEntry && tokenEntry.token.length >= 5) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking token limit:', error);
        return false;
    }
};
   

exports.verifyrefereshTokeninDB = async (req, res) => {
    const { username, refreshToken } = req.query;
    try {
        const tokenEntry = await Token_model.findOne({ username, refreshToken });
        res.status(200).json({ valid: !!tokenEntry });
        return !!tokenEntry;
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        res.status(500).json({ valid: false, error: 'Internal server error' });
        return false;
    }
};