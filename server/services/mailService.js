require('dotenv').config();
const transporter = require("../config/mailConfig");
const welcomeTemplate = require("../templates/welcomeTemplate");
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');


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

async function sendFeedbackEmail(feedbackText) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'twoeight.mail@gmail.com', // Replace with the email for feedback
    subject: 'User Feedback',
    html: `
      <h1>Feedback Received</h1>
      <p>${feedbackText}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Feedback email sent successfully.');
  } catch (error) {
    console.error('Error sending feedback email:', error);
    throw error;
  }
}

async function sendInvoiceEmail(to, order) {
  // Generate PDF
  const pdfPath = `./invoices/invoice_${order._id}.pdf`;
  const doc = new PDFDocument({ margin: 50 });

  // Path to images
  const logoPath = path.join(__dirname, '../images/28.png');
  const bannerPath = path.join(__dirname, '../images/twoeight_mail_signature.png');

  // Add Logo to the Center of the Page
  doc.image(logoPath, { align: 'center', valign: 'top', width: 80 }).moveDown(2);

  // Title
  doc
      .fontSize(18)
      .text('Invoice', { align: 'center', underline: true })
      .moveDown();

  // Invoice Details with Padding
  doc
      .fontSize(12)
      .text(`Invoice for Order ID: ${order._id}`, { align: 'left' })
      .text(`Order Date: ${new Date(order.orderDate).toString()}`, { align: 'left' })
      .text(`User ID: ${order.userId}`, { align: 'left' })
      .text(`Total Amount: $${order.totalAmount.toFixed(2)}`, { align: 'left' })
      .text(`Payment Method: ${order.paymentMethod}`, { align: 'left' })
      .moveDown();

  // Address Information
  doc
      .text(`Address Information:`, { underline: true })
      .text(`${order.addressInfo.address}, ${order.addressInfo.city}, ${order.addressInfo.pincode}`, { align: 'left' })
      .text(`Phone: ${order.addressInfo.phone}`, { align: 'left' })
      .moveDown();

  // Ordered Items
  doc.text('Ordered Items:', { underline: true });
  order.cartItems.forEach((item, index) => {
      doc.text(
          `${index + 1}. ${item.name} - $${item.price} each, Sale Price: $${item.salePrice}`,
          { align: 'left' }
      );
  });

  // Footer
  doc
      .moveDown()
      .fontSize(10)
      .text('Thank you for shopping with TWOEIGHT!', { align: 'center' })
      .text('Visit us at: www.twoeight.com', { align: 'center' });

  // Save PDF
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.end();

  // Email Body with Banner
  const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: 'Your Order Invoice',
      html: `
          <h1>Order Confirmation</h1>
          <p>Thank you for your order! Please find your invoice attached.</p>
          <br />
          <img src="cid:banner" alt="Banner" style="width: 100%; height: auto;" />
      `,
      attachments: [
          {
              filename: `invoice_${order._id}.pdf`,
              path: pdfPath,
          },
          {
              // Inline banner for the email body
              filename: 'twoeight_mail_signature.png',
              path: bannerPath,
              cid: 'banner', // Use content ID to embed the image in the email
          },
      ],
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log('Invoice email sent successfully.');
  } catch (error) {
      console.error('Error sending invoice email:', error);
      throw error;
  }
}

module.exports = { sendWelcomeEmail, sendFeedbackEmail, sendInvoiceEmail };
