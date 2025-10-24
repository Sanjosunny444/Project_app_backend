//based on username save the basic token and refresh token
const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    token: {
        type: Array,
        required: true,
    },
    refreshToken: {
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model('Token_model', tokenSchema);