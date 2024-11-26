const { default: mongoose } = require("mongoose");
const Parties = require("../model/parties");
const parties = require("../model/parties");


// parties page get
const partiesPageGet = async (req, res) => {
  try {
        const userid=req.session.user._id
    const partiess=await Parties.findOne({userId:userid})



    const partiesCustomer=partiess? partiess.parties : [] 


    // togive fidn in and arrray
  let toGaves=[]
   const toGave=partiesCustomer.flatMap((val)=>{
    val.transactions.map((values)=>toGaves.push(values.toGave))
   });
   console.log();
    
    // tooootal to give
  let  totlToGave=toGaves.reduce((acc,val)=>val+acc,0)
    
  // to got set and array
    let toGets=[]
    const toGet=partiesCustomer.flatMap((val)=>{
     val.transactions.map((values)=>toGets.push(values.toGet))
    });
    
     
     // tooootal to get
   let  totlToGet=toGets.reduce((acc,val)=>val+acc,0)



const subTotal=totlToGet-totlToGave

    
    

    const message=req.flash('message')
    res.render("parties",{
        message,
        partiesCustomer,
        totlToGave,
        totlToGet,
        subTotal
    });
  } catch (error) {
    console.log(error.message);
  }
};

// add customer -- data come from the modal
const customerAddPost = async (req, res) => {
    try {
      const userid = req.session.user._id;
      const { name, description, phone } = req.body;

      const existParties = await Parties.findOne({
        userId: userid,
        "parties.phone": phone,
      });

      if (existParties) {
        req.flash('message', 'existPartis');
        return res.json({ success: false, message: 'existPartis' });
      } else {
        let userPartie = await Parties.findOne({ userId: userid });

        if (userPartie) {
          userPartie.parties.push({ name, description, phone });
          await userPartie.save();
          req.flash('message', 'success');
          return res.json({ success: true });  
        } else {
          const newPartie = new Parties({
            userId: userid,
            parties: [{ name, description, phone }]
          });
          await newPartie.save();
          req.flash('message', 'success');
          return res.json({ success: true });
        }
      }
    } catch (error) {
      console.log(error.message);
      req.flash('message', 'error');
      return res.json({ success: false, message: 'Error occurred.' }); 
    }
};


// delete parties

const deleteParties=async(req,res)=>{
    try{
         
         const partiesId=req.query.partiesid
         const userId=  req.session.user._id

        const deleteParties =await Parties.findOneAndUpdate({userId:userId},{$pull:{parties:{_id:partiesId}}})
          
        if(deleteParties.modifiedCount !== 0){
            req.flash('message','DeletedSuccess')
            res.redirect('/parties')
        }else{
            req.flash('message','DeletedFail')
            res.redirect('/parties')
        }
            
        
    }catch(error){
        console.log(error.message);
        
    }
}

// ------------------------------------------------ customers in partis ---------------


//  each person in parties page get
const partiesPersonGet=async(req,res)=>{
    try{

        const message=req.flash('message')
        const userid=req.session.user._id
        
        const customerid=req.query.personid
       
        const customerdata = await Parties.findOne({
            userId: userid,
            'parties._id': customerid, 
          }, {
            'parties.$': 1,  
          });
       if(!customerid || !customerdata){
        return res.redirect('/parties')
       }
        

       // total ----
    //    -----total money gave-----
      let toGaveSum = customerdata.parties[0].transactions.map((val)=>val.toGave);
      let totalGaveSum=toGaveSum.reduce((acc,val)=>val+acc,0)

   //    -----total money get-----   
      let toGetSum = customerdata.parties[0].transactions.map((val)=>val.toGet);
      let totalGetSum=toGetSum.reduce((acc,val)=>val+acc,0)
   
    // sub total

     let subTotal=totalGetSum-totalGaveSum
      


       
        res.render('customerInParties',{
           person:customerdata.parties[0], 
           message,
           totalGaveSum,
           totalGetSum,
           subTotal
        })
    }catch(error){
        console.log(error.message);
        
    }
}



// the money you got in each person 
const youGotPost = async (req, res) => {
    try {
        console.log("1");
        
        const userid = req.session.user._id;
        const { amount, description, personid } = req.body;

        // Perform the database update
        const result = await Parties.updateOne(
            {
                userId: userid,
                'parties._id': personid,
            },
            {
                $push: {
                    'parties.$.transactions': {
                        toGet: amount,
                        reason: description,
                        date: Date.now(),
                    },
                },
            }
        );
        console.log("122");
        // If no document was modified, return an error message
        if (result.modifiedCount === 0) {
            console.log("1444");
            req.flash('message', 'fail');
            return res.json({ success: false, message: 'existPartis' });
        }
        console.log("1333");
        req.flash('message', 'success');
        return res.json({ success: true });
       

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};



// the money you want to gave in each person 
const youGavePost = async (req, res) => {
    try {
        console.log("1");
        
        const userid = req.session.user._id;
        const { amount, description, personid } = req.body;

        // Perform the database update
        const result = await Parties.updateOne(
            {
                userId: userid,
                'parties._id': personid,
            },
            {
                $push: {
                    'parties.$.transactions': {
                        toGave: amount,
                        reason: description,
                        date: Date.now(),
                    },
                },
            }
        );
        console.log("122");
        // If no document was modified, return an error message
        if (result.modifiedCount === 0) {
            console.log("1444");
            req.flash('message', 'fail');
            return res.json({ success: false, message: 'existPartis' });
        }
        console.log("1333");
        req.flash('message', 'success');
        return res.json({ success: true });
       

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};


// delete transaction
const deleteTransaction=async(req,res)=>{
    try{
        const userId=req.session.user._id
        const transactionId=req.query.transactionid
        const personId=req.query.personid
        
        
        const result = await Parties.updateOne(
            { userId: userId, "parties._id": personId },  
            { $pull: { "parties.$.transactions": { _id: transactionId } } } 
          );

          if(result.modifiedCount !==0){
                req.flash('message','deletedSuccess')
                res.redirect(`/person?personid=${personId}`)
          }else{
            req.flash('message','deletedFail')
            res.redirect(`/person?personid=${personId}`)
          }

        
    }catch(error){
        console.log(error.message);
        
    }
}

//------------ send message to user ----

 let msgSend=async (req, res) => {
  const userId = req.query.userid;

  // Fetch user details (e.g., phone number) from your database
  const user = await User.findById(userId); // Replace with your database logic
  const phoneNumber = user.phone; // Assuming 'phone' field contains the user's number

  // Example: Sending a WhatsApp message using WhatsApp Cloud API
  const accessToken = 'YOUR_ACCESS_TOKEN';
  const phoneNumberId = 'YOUR_PHONE_NUMBER_ID';
  const message = `Hello ${user.name}, this is a test message!`;

  try {
    await axios.post(
      `https://graph.facebook.com/v16.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.send('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error.response.data);
    res.status(500).send('Failed to send message.');
  }
};


  
module.exports = {
  partiesPageGet,
  deleteParties,
  customerAddPost,
  partiesPersonGet,
  youGotPost,
  youGavePost,
  deleteTransaction,
  msgSend
};
