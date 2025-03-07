import nodemailer from 'nodemailer';
import User from '../models/User.js'; 
 // Import the User model
 import dotenv from 'dotenv';
dotenv.config();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nusratsiddiquetuli@gmail.com', // Your Gmail address
    pass: 'bvjb rcdm fstx dqqh' // Your Gmail password or app password
  },
});


// Controller function to send email to all users
const sendEmailToUsers = async (req, res) => {
  try {
    console.log("user",process.env.EMAIL_USER);
    const { notificationMessage } = req.body;

    // Fetch all users' emails (excluding admins)
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    // Send email to each user
    users.forEach(async (user) => {
      const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender email
        to: user.email,                // Recipient email
        subject: 'Admin Notification', // Email subject
        text: notificationMessage,     // Notification message
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
        console.log(`Notification message: ${notificationMessage} ${user.email}`);
      } catch (error) {
        console.log(`Failed to send email to ${user.email}: ${error}`);
      }
    });

    res.status(200).json({ message: 'Notification sent to all users.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendEmailToUsers };