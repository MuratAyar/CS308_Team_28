require('dotenv').config(); // Add this line

const transporter = require("../config/mailConfig");

async function sendWelcomeEmail(to, username) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Welcome to Our Service!',
    text: `Hello, ${username}! Thank you for registering with us. We are excited to have you on board!`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Let the caller decide what to do with this error
  }
}

module.exports = { sendWelcomeEmail };
