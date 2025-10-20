



const express = require('express');
const dotenv = require('dotenv'); 
const { connectDB } = require('./config/database');
const { use } = require('react');
dotenv.config();
const userRoutes = require('./routes/user.Routes');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
console.log('Database connection attempting....');
app.use(express.json());

app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
    res.send('welcome to the Express server authentication system');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});