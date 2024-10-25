require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../../models/User')

const { sendWelcomeEmail } = require("../../services/mailService");


//register
const registerUser = async(req, res) => {
    const {userName, email, password} = req.body

    try{

        const checkUser = await User.findOne({email});
        if(checkUser) return res.json({success : false,
             message:"This email is already taken! Please try again."})

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName, email, password: hashPassword,}
        ) 

        await newUser.save()
        res.status(200).json({
            success : true,
            message : 'Registration Successful!'
        })

        console.log("Email User:", process.env.EMAIL_USER);
        console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

        try {
            await sendWelcomeEmail(email, userName);
            // Email sent successfully
            return res.status(201).json({
              success: true,
              message: "User registered and email sent!"
            });
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            // If email fails, return a successful registration message without failing
            return res.status(201).json({
              success: true,
              message: "User registered, but email failed to send."
            });
          }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Some error occured!'
        })
    }
}


//login
const loginUser = async(req, res) =>{
    const {email, password} = req.body
    try{
        const checkUser = await User.findOne({email});    
        if(!checkUser) return res.json({
            success : false,
            message: "User doesn't exists! Please register first!"
        })

        const checkPasswordMatch = await bcrypt.compare(password, checkUser.password)
        if(!checkPasswordMatch) return res.json({
            success : false,
            message: "Ivalid Password! Please try again!"
        });

        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email

        }, 'CLIENT_SECRET_KEY', {expiresIn: '60m'})

        res.cookie('token', token, {httpOnly:true, secure: false}).json({
            success: true,
            message: "Logged in successfully!",
            user:{
                email: checkUser.email,
                role: checkUser.role,
                id : checkUser._id
            }
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Some error occured!'
        })
    }
}


//logout

module.exports = { registerUser };

//authmiddleware
module.exports = {registerUser, loginUser};
