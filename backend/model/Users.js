const { number } = require("joi");
const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
       
    },
    region_state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    confirm_password: {
        type: String,
        required: true
    },
    profile_picture: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }

});

const User = mongoose.model("user", usersSchema);

module.exports = User;