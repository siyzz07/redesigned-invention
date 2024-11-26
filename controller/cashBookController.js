const { default: mongoose } = require('mongoose')
const cashBook=require('../model/cashBookModel')
const User=require('../model/userModel')




// cashbook page get
const cashBookGet=async(req,res)=>{
    try{
         

        const userId=req.session.user._id

        // show only todays 
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
        const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

        const userCashBook = await cashBook.aggregate([
            {
                $match: { userId:new mongoose.Types.ObjectId(userId) }
            },
            {
                $project: {
                    todayData: {
                        $filter: {
                            input: '$cashBook', // cashBook array
                            as: 'entry',
                            cond: {
                                $and: [
                                    { $gte: ['$$entry.date', startOfDay] },
                                    { $lte: ['$$entry.date', endOfDay] }
                                ]
                            }
                        }
                    }
                }
            }
        ]);

        const todayCashBookEntries = userCashBook.length > 0 ? userCashBook[0].todayData : [];


        //--- aggrigation---

        const currentMonth=new Date().getMonth()
        const currentYear=new Date().getFullYear()

        const result = await cashBook.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId) 
                }
            },
            {
                $project: {
                    currentMontMatch: {
                        $filter: {
                            input: '$cashBook', 
                            as: 'entry', 
                            cond: {
                                $and: [ 
                                    { $eq: [{ $month: '$$entry.date' }, currentMonth + 1] }, 
                                    { $eq: [{ $year: '$$entry.date' }, currentYear] }
                                ]
                            }
                        }
                    }
                }
            }
        ]);
        
        
        const currentMonthCashArray = result.length > 0 ? result[0].currentMontMatch : [];
       //--- total Out-----

       let totalOut=await currentMonthCashArray.reduce((acc,val)=>val.cashOut+acc,0)
      
    //  --- total In
    let totalIn=await currentMonthCashArray.reduce((acc,val)=>val.cashIn+acc,0)
        
        

        
        
        //------ total out ----

        const message=req.flash('message')
        res.render('cashBook',{
            message,
            cashbookItem:todayCashBookEntries,
            totalOut,
            totalIn

        })
    }catch(error){
        console.log(error.message);
        
    }
}


// get money in cash book
const cashBookIn = async (req, res) => {
    try {
       const userId=req.session.user._id
        const {amount,description}=req.body
    const userCashbookCheck=await cashBook.findOne({userId:userId})
   

        if (userCashbookCheck){
            userCashbookCheck.cashBook.push({
                cashIn:amount,
                description:description

            })
            await userCashbookCheck.save();
            
        }else{
          const  userCashbookCheck = new cashBook({
                userId:userId,
                cashBook:[{
                    cashIn:amount,
                    description:description
                }]
            })
            await userCashbookCheck.save();     
        }
        req.flash('message','added')
        return res.json({ success: true, redirectUrl: '/cashBook' })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};




// out money in cash book

const cashBookOut = async (req, res) => {
    try {
       const userId=req.session.user._id
        const {amount,description}=req.body
    const userCashbookCheck=await cashBook.findOne({userId:userId})
   

        if (userCashbookCheck){
            userCashbookCheck.cashBook.push({
                cashOut:amount,
                description:description

            })
            await userCashbookCheck.save();
            
        }else{
          const  userCashbookCheck = new cashBook({
                userId:userId,
                cashBook:[{
                    cashOut:amount,
                    description:description
                }]
            })
            await userCashbookCheck.save();     
        }
        req.flash('message','added')
        return res.json({ success: true, redirectUrl: '/cashBook' })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
       
    }
};


// delete transactions in cashbook
const deleteInCahsBook=async(req,res)=>{
    try{
        const userId=req.session.user._id
        const Id=req.query.transactionid

        const deletein=await cashBook.updateOne(
            {userId,'cashBook._id':Id},
            {$pull:{cashBook:{_id:Id}}}
        )

        if(deletein.modifiedCount!==0){
            
            req.flash('message','deletesuccess')
            res.redirect('/cashBook')
        }


    }catch(error){
        console.log(error.message);
        
    }
}


//----------------------------- History ------------------------------------
const history=async(req,res)=>{
    try{
        const userId=req.session.user._id
        const cashBookHistory=await cashBook.findOne({userId:userId})
        const cashBookHistoryItems = cashBookHistory ? cashBookHistory.cashBook : [];
        
        const message=req.flash('message')
        res.render('cashBookHistory',{
            message,
            items:cashBookHistoryItems
        })
    }catch(error){
        console.log(error.message);    
    }
}


// deletete
const deleteinHistory=async(req,res)=>{
    try{
    
        const userId= req.session.user._id
        const id=req.query.transactionid

        const deletein=await cashBook.updateOne(
            {userId,'cashBook._id':id},
            {$pull:{cashBook:{_id:id}}}
        )


        if(deletein.modifiedCount!==0){
            
            req.flash('message','deletesuccess')
            res.redirect('/history')
        }

    }catch(error){
        console.log(error.message);
        
    }
}


module.exports={
    cashBookGet,
    cashBookIn,
    cashBookOut,
    deleteInCahsBook,
    history,
    deleteinHistory
}