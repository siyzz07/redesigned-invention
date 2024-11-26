const mongoose=require('mongoose')

const expenceControlSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    expence:[{
        expenceType:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        },
        description:{
            type:String
        },
        date:{
            type:Date,
            default:Date.now()
        }
    }]
})