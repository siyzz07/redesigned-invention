const express=require('express')
const user_rout=express();
 
const session=require('express-session')

// session 
const userSession=require('../middleware/userSession')

user_rout.set("view engine","ejs")
user_rout.set('views',"./views/user")



user_rout.use(
    session({
        secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    })
)

// --------------------- CONTROLLERS ----------------------------
const userController=require('../controller/userController')
const categoryController=require('../controller/categoryController')
const partiesController=require('../controller/partiesController')
const cashbookController=require('../controller/cashBookController')


// login 
user_rout.get('/login',userController.loginGet)
user_rout.post('/login',userController.loginPost)


// signup
user_rout.get('/signup',userController.signupGet)
user_rout.post('/signup',userController.signupPost)


// otp veryfiction
user_rout.get('/otpVerification',userController.otpPageGet)
user_rout.post('/otpVerification',userController.otpVerificatioPost)
user_rout.get('/resendOtp',userController.resedOtp)


//home
user_rout.get('/home',userSession,userController.homeGet)


//category
user_rout.get('/category',userSession,categoryController.categoryGet)
user_rout.post('/category',categoryController.categoryAddPost)



// parties
user_rout.get('/parties',userSession,partiesController.partiesPageGet)
user_rout.post('/addcustomer',partiesController.customerAddPost)

user_rout.get('/deleteParties',partiesController.deleteParties)

user_rout.get('/sendMessage',partiesController.msgSend)


// customres in parties
user_rout.get('/person',userSession,partiesController.partiesPersonGet)
user_rout.post('/youGot',partiesController.youGotPost)
user_rout.post('/youGave',partiesController.youGavePost)

user_rout.get('/deleteTransaction',partiesController.deleteTransaction)


// cash book
user_rout.get('/cashBook',cashbookController.cashBookGet)
user_rout.post('/in',cashbookController.cashBookIn)
user_rout.post('/out',cashbookController.cashBookOut)
user_rout.get('/deleteinCashBook',cashbookController.deleteInCahsBook)
user_rout.get('/history',cashbookController.history)
user_rout.get('/deleteinhistory',cashbookController.deleteinHistory)


module.exports=user_rout
