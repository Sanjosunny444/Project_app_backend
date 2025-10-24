


const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const Token_model = require('../models/tokenModel');
const { checklimitplus_tokens } = require('./tokenController');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        console.log('User entered in:', user.username);
        console.log('User entered in:', user.password);

        const checklimit = await checklimitplus_tokens(username);
        if (checklimit) {
            return res.status(403).json({ message: 'Token limit exceeded. Please logout from other devices.' });
        }
        
        const generateToken = (user) => {
            return jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        }
        const token = generateToken(user);
        const generaterefreshToken = (user) => {
            return jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
        }
        const refreshToken = generaterefreshToken(user);
        console.log('Generated Token:', token);
        console.log('Generated Refresh Token:', refreshToken);
        //check username in token model
        const tokenEntry = await Token_model.findOne({ username });
        //console.log('Token Entry from DB:', tokenEntry);
        //add token to array if exists
        if (tokenEntry) {
            tokenEntry.token.push(token);
            tokenEntry.refreshToken.push(refreshToken);
            await tokenEntry.save();
        }
        else {
            const newToken = new Token_model({
                username: user.username,
                token: [token],
                refreshToken: [refreshToken],
            });
            await newToken.save();
        }
        res.status(200).json({ message: 'Login successful',"user":user.username, token , refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error','error':error.message || 'error creating user' });
    }
}

exports.signUp = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error','error':error.message || 'error creating user' });
    }
};

exports.logout = async (req, res) => {
    try {
        const { username, token, refreshToken } = req.body;
        const tokenEntry = await Token_model.findOne({ username });
        if (!tokenEntry) {
            return res.status(404).json({ message: 'User not found' });
        }
        const no_of_tokens_before = tokenEntry.token.length;
        const no_of_refreshTokens_before = tokenEntry.refreshToken.length;
        if(no_of_refreshTokens_before==1 && no_of_tokens_before==1){
            //delete the whole entry
            await Token_model.deleteOne({ username });
            return res.status(200).json({ message: 'Logged out successfully from all devices' });
        }else{
            //check if token and refresh token exist
            const tokenExists = tokenEntry.token.includes(token);
            const refreshTokenExists = tokenEntry.refreshToken.includes(refreshToken);
            if (!tokenExists || !refreshTokenExists) {
                return res.status(400).json({ message: 'Invalid token or refresh token' });
            }
            //remove the token and refresh token from array
            tokenEntry.token = tokenEntry.token.filter(t => t !== token);
            tokenEntry.refreshToken = tokenEntry.refreshToken.filter(t => t !== refreshToken);
            await tokenEntry.save();
            return res.status(200).json({ message: 'Logged out successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', 'error': error.message || 'error logging out user' });
    }   
};


//for testing purpose   
// safe: return username only
exports.getAllUsers = async (req, res) => {
  try {
    // all fields except password
    const users = await User.find().select('password username');
    console.log('Fetched users:', users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

