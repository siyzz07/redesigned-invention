const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    number:{
        type:Number
    },
    email:{
        type:String
    },

    password:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    
},{ timestamps: true },)


module.exports=mongoose.model('User',userSchema)