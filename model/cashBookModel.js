const mongoose=require('mongoose')


const cashBookSchema=new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    cashBook:[{
        cashIn:{
            type:Number,
            default:0
        },
        cashOut:{
            type:Number,
            default:0
        },
        description:{
            type:String,

        },
        
        date:{
            type:Date,
            default:Date.now()
        }
    }]
})


module.exports=mongoose.model('CashBook',cashBookSchema)