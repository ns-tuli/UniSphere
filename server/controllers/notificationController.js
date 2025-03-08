import {
  sendNotification,
  getNotifications,
} from "../services/notificationService.js";
import nodemailer from "nodemailer";

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Schedule a new notification
 */
export function schedule(req, res) {
  try {
    const { email, subject, message, htmlMessage, scheduledTime } = req.body;

    if (!email || !subject || !message || !scheduledTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(
      `📤 Received request to schedule notification for ${email} at ${scheduledTime}`
    );

    const notificationId = scheduleNotification({
      to: email,
      subject,
      text: message,
      html: htmlMessage || undefined,
      scheduledTime: new Date(scheduledTime),
    });

    res.status(201).json({
      success: true,
      id: notificationId,
      nextRunTime: new Date(scheduledTime).toLocaleString(),
    });
  } catch (error) {
    console.error("❌ Error scheduling notification:", error);
    res.status(500).json({ error: "Failed to schedule notification" });
  }
}

export async function send(req, res) {
  try {
    const { to, subject, text, html, name } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email",
      details: error.message,
    });
  }
}

/**
 * Cancel a notification
 */
export function cancel(req, res) {
  const { id } = req.params;
  const cancelled = cancelNotification(id);

  if (cancelled) {
    res.status(200).json({ success: true, message: "Notification cancelled" });
  } else {
    res.status(404).json({ error: "Notification not found" });
  }
}

/**
 * Get all scheduled notifications
 */
export function list(req, res) {
  const notifications = getScheduledNotifications();
  res.status(200).json({ notifications });
}
