require('dotenv').config();
const transporter = require("../config/mailConfig");

async function sendPasswordResetEmail(to, newPassword) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Password Reset Request',
    text: `Hello, your password has been reset. Your new password is: ${newPassword}. We recommend you to save it. For any issues, please contact to twoeight.mail@gmail.com.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

module.exports = { sendPasswordResetEmail };
