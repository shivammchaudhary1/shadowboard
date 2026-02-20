import nodemailer from "nodemailer";
import config from "../envs/default.js";

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // You can change this to other services like 'yahoo', 'outlook'
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com", // Add to .env files
      pass: process.env.EMAIL_PASS || "your-app-password" // Add to .env files
    }
  });
};

export const sendMail = async (to, subject, message) => {
  try {
    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: {
        name: "Shadow Board",
        address: config.emailFrom || "noreply@shadowboard.com"
      },
      to: to,
      subject: subject,
      html: message, // Supports HTML content
      text: message.replace(/<[^>]*>/g, "") // Plain text fallback (removes HTML tags)
    };

    // Send email
    console.log(`📧 Sending email to: ${to}`);
    console.log(`📋 Subject: ${subject}`);

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully! Message ID: ${result.messageId}`);

    return {
      success: true,
      messageId: result.messageId,
      to: to,
      subject: subject
    };
  } catch (error) {
    console.error(`❌ Failed to send email: ${error.message}`);

    return {
      success: false,
      error: error.message,
      to: to,
      subject: subject
    };
  }
};

/**
 * Send welcome email template
 * @param {string} to - Recipient email address
 * @param {string} userName - User's name
 */
export const sendWelcomeEmail = async (to, userName) => {
  const subject = "Welcome to Shadow Board! 🎯";
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f2937; text-align: center;">Welcome to Shadow Board!</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for joining Shadow Board - the anonymous voting platform where your voice matters!</p>
      <p>You can now:</p>
      <ul>
        <li>Vote anonymously on various polls</li>
        <li>Create your own polls</li>
        <li>Share opinions without revealing your identity</li>
      </ul>
      <p>Start voting now and make your voice heard!</p>
      <p>Best regards,<br>The Shadow Board Team</p>
    </div>
  `;

  return await sendMail(to, subject, message);
};

/**
 * Send notification email template
 * @param {string} to - Recipient email address
 * @param {string} action - Action description
 */
export const sendNotificationEmail = async (to, action) => {
  const subject = "Shadow Board Notification";
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1f2937;">Shadow Board Notification</h2>
      <p>Hello,</p>
      <p>This is to notify you about the following action:</p>
      <p><strong>${action}</strong></p>
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br>The Shadow Board Team</p>
    </div>
  `;

  return await sendMail(to, subject, message);
};

export default {
  sendMail,
  sendWelcomeEmail,
  sendNotificationEmail
};

/* 
==============================================
USAGE EXAMPLES:
==============================================

// 1. Basic email sending
import { sendMail } from '../config/libraries/nodeMailer.js';

const result = await sendMail(
  'user@example.com',
  'Welcome to Shadow Board',
  '<h1>Welcome!</h1><p>Thanks for joining us!</p>'
);

// 2. Welcome email
import { sendWelcomeEmail } from '../config/libraries/nodeMailer.js';

await sendWelcomeEmail('newuser@example.com', 'John Doe');

// 3. Notification email
import { sendNotificationEmail } from '../config/libraries/nodeMailer.js';

await sendNotificationEmail('user@example.com', 'Your vote has been submitted');

// 4. In a controller/route
app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;
  
  const result = await sendMail(to, subject, message);
  
  if (result.success) {
    res.json({ message: 'Email sent successfully!' });
  } else {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

==============================================
ENVIRONMENT VARIABLES NEEDED:
==============================================

Add these to your .env.prod and .env.stage files:

EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

Note: For Gmail, you need to use an "App Password" instead of your regular password.
Generate it from: Google Account > Security > 2-Step Verification > App passwords
*/
