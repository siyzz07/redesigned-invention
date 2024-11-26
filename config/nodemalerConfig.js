const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'testbrocamp@gmail.com',
    pass: 'tfuj tkqm ghsb elvt',
  },
});


module.exports=transporter
