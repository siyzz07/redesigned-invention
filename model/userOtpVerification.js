const mongoose = require('mongoose');

const userOtpSchema = new mongoose.Schema({
    userId: String,
    otp: String,
    otpExpire: {
        type: Date,
        required: true,
        expires: 60  // Expires after 60 seconds
    }
});

module.exports = mongoose.model('UserOtp', userOtpSchema);
