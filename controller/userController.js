const { log } = require("util");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userOtpStore = require("../model/userOtpVerification");
const transporter = require("../config/nodemalerConfig");

// ----------- login page get----------

const loginGet = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      const msg = req.flash("msg");
      const fail = req.flash("fail");
      res.render("login", {
        msg,
        fail,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// verifi login
const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    console.log(user);

    if (user && user.isVerified == true) {
      if (user.isBlocked == false) {
        const matchPassword = await bcrypt.compare(password, user.password);
        if (matchPassword) {
          req.session.user = { email: user.email, _id: user.id };
          res.redirect("/home");
        } else {
          req.flash("fail", "Invalied Password");
          res.redirect("/login");
        }
      } else {
        req.flash("fail", "Your Accound Blocked by Admin");
      }
    } else {
      req.flash("fail", "Invalied Email");
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ------- signup Page get ------------------
const signupGet = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      const fail = req.flash("fail");
      res.render("signup", {
        fail,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//------- signup page post --------------

const signupPost = async (req, res) => {
  try {
    const email = req.body.email;
    const existUser = await User.findOne({ email: email });
    if (existUser && existUser.isVerified == true) {
      req.flash("fail", "User Already Exist");
      res.redirect("/signup");
    } else {
      if (existUser && existUser.isVerified == false) {
        await User.deleteOne({ email: email });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const otp = crypto.randomInt(100000, 999999).toString();
      console.log(hashedPassword);

      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      const userData = await user.save();
      const userId = userData.email;

      const userOtp = new userOtpStore({
        userId: userId,
        otp: otp,
        otpExpire: new Date(Date.now() + 60 * 1000), // Set 60 seconds in the future
      });

      const a = await userOtp.save();

      // sending the otp to user gmail

      await transporter.sendMail({
        from: "testbrocamp@gmail.com",
        to: email,
        subject: "Secure Your Account with This Code",
        text: `your OTP is ${otp}`,
      });

      res.redirect(`/otpVerification?email=${email}`);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ------------- OTP verification Page Get ----------

const otpPageGet = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/home");
    } else {
      const email = req.query.email;
      const fail = req.flash("fail");
      if (!email) {
        req.flash("fail", "Fill signup details");
        return res.redirect("/signup");
      }
      res.render("OTPverifiecation", {
        id: email,
        fail,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//-------- otpVerification post -------
const otpVerificatioPost = async (req, res) => {
  try {
    const { id, userotp } = req.body;
    const user = await User.findOne({ email: id });
    const userOTP = await userOtpStore.findOne({ userId: id });

    if (!user) {
      req.flash("fail", "Fill the Signup details");
      res.redirect("/signup");
    } else {
      if (!userOTP) {
        req.flash("fail", "OTP Expired");
        res.redirect(`/otpVerification?email=${id}`);
      } else {
        if (userotp == userOTP.otp) {
          await User.updateOne({ email: id }, { isVerified: true });
          await userOtpStore.deleteMany({ userId: id });

          req.flash("msg", "Account created Successfully");
          res.redirect("/login");
        } else {
          req.flash("fail", "Invalied OTP");
          res.redirect(`/otpVerification?email=${id}`);
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ---------- resent otp --------
const resedOtp = async (req, res) => {
  try {
    const newOtp = crypto.randomInt(100000, 999999).toString();
    const id = req.query.id;
    let userOTP = await userOtpStore.findOne({ userId: id });
    const user = await User.findOne({ email: id });
    if (user) {
      if (!userOTP) {
        userOTP = new userOtpStore({
          userId: id,
          otp: newOtp,
          otpExpire: new Date(Date.now() + 60 * 1000),
        });
        await userOTP.save();
      } else {
        userOTP.otp = newOtp;
        userOTP.otpExpire = new Date(Date.now() + 60 * 1000);

        await userOTP.save();

        await transporter.sendMail({
          from: "testbrocamp@gmail.com",
          to: id,
          subject: "Secure Your Account with This Code",
          text: `your OTP is ${newOtp}`,
        });

        res.redirect(`/otpVerification?email=${id}`);
      }
    } else {
      req.flash("fail", "Fill the Signup Details");
      res.redirect("/signup");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ---------------------------------------------------- HOME ----------------------------------------------------

// -------- home page load-----------
const homeGet = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loginGet,
  loginPost,
  signupGet,
  signupPost,
  otpPageGet,
  otpVerificatioPost,
  resedOtp,
  homeGet,
};
