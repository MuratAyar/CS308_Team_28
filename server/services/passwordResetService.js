require('dotenv').config();
const transporter = require("../config/mailConfig");

async function sendPasswordResetEmail(to, newPassword) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Password Reset Request',
    text: `Hello, your password has been reset. Your new password is: ${newPassword}. Please log in and change your password as soon as possible.`,
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
