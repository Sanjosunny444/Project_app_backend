



const bcrypt = require('bcrypt');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');

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
        console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded ✅' : 'Missing ❌');
        const generateToken = (user) => {
            return jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
        }
        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful'," user":user, token });
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

