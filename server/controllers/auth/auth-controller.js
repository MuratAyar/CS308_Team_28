require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require('../../models/User')

const { sendWelcomeEmail } = require("../../services/mailService");
const { sendPasswordResetEmail } = require('../../services/passwordResetService');

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
      /*  res.status(200).json({
            success : true,
            message : 'Registration Successful!'
        }) */

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
            email: checkUser.email,
            userName: checkUser.userName

        }, 'CLIENT_SECRET_KEY', {expiresIn: '60m'})
        console.log(token);
        
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

const resetPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Generate a random 8-character password
      const newPassword = Math.random().toString(36).slice(-8);
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
  
      // Update the password in the database
      const user = await User.findOneAndUpdate({ email }, { password: hashedPassword });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Send the new password via email
      await sendPasswordResetEmail(email, newPassword);
  
      res.status(200).json({
        success: true,
        message: "Password has been reset and sent to the user's email."
      });
  
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while resetting the password."
      });
    }
  };
  const confirmDeletion = (req, res) => {
    const { confirmation } = req.body;

    // Step 1: Check for the "delete" confirmation keyword
    if (confirmation !== "delete") {
        return res.status(400).json({
            success: false,
            message: "Please type 'delete' to confirm account deletion"
        });
    }

    // Keyword confirmed, prompt for password in the next step
    res.status(200).json({
        success: true,
        message: "Confirmation keyword accepted. Please provide your password to continue."
    });
};
const deleteUserAccount = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Step 2: Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      // Step 3: Verify the password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
          return res.status(401).json({
              success: false,
              message: "Incorrect password"
          });
      }

      // Step 4: Delete the user account
      await User.deleteOne({ email });

      res.status(200).json({
          success: true,
          message: "User account deleted successfully"
      });
  } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({
          success: false,
          message: "An error occurred while deleting the account"
      });
  }
};
  

module.exports = { registerUser };

//authmiddleware
module.exports = { registerUser, loginUser, resetPassword, confirmDeletion, deleteUserAccount };
