const nodemailer = require('nodemailer');
const { logger } = require('../../utils/logger');
require('dotenv').config();

// Create a test transporter that doesn't actually connect
let transporter;
if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // we use no secure port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // Use ethereal email for development/testing
  transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025,
    secure: false,
    auth: {
      user: 'test',
      pass: 'test',
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  logger.log("info", "Using development email transport");
}

// Commenting out verification to avoid connection errors
// transporter.verify((error, success) => {
//   if (error) {
//     logger.log("error", "Email transporter not reading for mailing:", error);
//   } else {
//     logger.log("info", 'Transporter ready for mailing.');
//   }
// });

// Function to send a verification email with a verification link
const sendVerificationEmail = async (email, verificationLink) => {
  const mailOptions = {
    from: 'no-reply@snz.ark',
    to: email,
    subject: 'Welcome! Please verify your Email :)',
    html: `<p>Click on the link to confirm your registration</p><a href="${verificationLink}">HERE</a>`,
  };
  try {
    // Returning success without actually sending in development
    if (process.env.NODE_ENV !== 'production') {
      logger.log("info", `Would send verification email to ${email}`);
      return { success: true, message: 'Mail sent successfully (dev mode)' };
    }
    
    const result = await transporter.sendMail(mailOptions);
    return { success: true, message: 'Mail sent successfully' };
  } catch (error) {
    logger.log("error", "Failed to send verification email:", error);
    return { success: false, message: 'Failed to send Mail' };
  }
};

// Function to send a customizable email
const sendEmail = async (sender, to, subject, text, html) => {
  try {
    // Returning success without actually sending in development
    if (process.env.NODE_ENV !== 'production') {
      logger.log("info", `Would send email to ${to} with subject ${subject}`);
      return {
        message: 'email sent successfully (dev mode)',
        accepted: [to],
        rejected: [],
        pending: [],
      };
    }
    
    const mailOptions = {
      from: sender,
      to,
      subject,
      text,
      html,
    };
    const info = await transporter.sendMail(mailOptions);

    if (info.accepted) {
      return {
        message: 'email sent successfully',
        accepted: info.accepted,
        rejected: info.rejected,
        pending: info.pending,
      };
    }
    if (info.pending) {
      return {
        message: 'sending email ...',
        pending: info.pending,
        rejected: info.rejected,
      };
    }
    return { message: 'failed to send email' };
  } catch (error) {
    logger.log("error", "Failed to send email:", error);
    return { message: 'Failed to send Mail', error: error.message };
  }
};

module.exports = { sendVerificationEmail, sendEmail };
