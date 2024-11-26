const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryItems: [
        {
            name: {
                type: String
            },
            description: {
                type: String
            },
            limit: {
                type: Number,
                default: 0,
            },
            isLimited: {
                type: Boolean,
                default: false
            },
            isBlocked: {
                type: Boolean,
                default: false
            },
            createdat: {
                type: Date,
                default: Date.now ()
            },
            expireTime:{
                type:String
            }
        }
    ]
}, { timestamps: true });  

module.exports = mongoose.model('Category', categorySchema);
