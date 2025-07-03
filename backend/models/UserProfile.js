const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    profileType: String,
    name: String,
    phone: String,
    email: String,
    extraInfo: String,
    status: {
        type: String,
        default: 'new' // 'new', 'viewed', etc.
    }
}, { timestamps: true });


module.exports = mongoose.model('UserProfile', userProfileSchema);
