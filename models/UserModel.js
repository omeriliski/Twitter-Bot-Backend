const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: false,
    },
    userEmail: {
        type: String,
        required: true,
        uniqe: true
    },
    userPassword: {
        type: String,
        required: true,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    apiKey: {
        type: String,
        required: false,
    },
    apiSecretKey: {
        type: String,
        required: false,
    },
    accessToken: {
        type: String,
        required: false,
    },
    accessTokenSecret: {
        type: String,
        required: false,
    },
    rtCount: {
        type: Number,
        required: false,
    },
    likeCount: {
        type: Number,
        required: false,
    },
    followCount: {
        type: Number,
        required: false
    },
    popularAccountsList: {
        type: Array
    }
});

// const User = mongoose.model('user', UserSchema)
// module.exports = User
module.exports = User = mongoose.model('user', UserSchema)