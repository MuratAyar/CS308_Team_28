require('dotenv').config();
const transporter = require("../config/mailConfig");
const welcomeTemplate = require("../templates/welcomeTemplate");

async function sendWelcomeEmail(to, username) {
  // Use the welcomeTemplate to get the subject and HTML content
  const { subject, html } = welcomeTemplate(username);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject, // Use the subject from the template
    html: html,       // Use the HTML content from the template
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
