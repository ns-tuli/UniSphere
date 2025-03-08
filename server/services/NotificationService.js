import schedule from "node-schedule";
import nodemailer from "nodemailer";

const scheduledJobs = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.example.com",
  port: 587,
  secure: "false",
  auth: {
    user: process.env.SMTP_USER || "bhuiyansiyam294@gmail.com",
    pass: process.env.SMTP_PASS || "dnvg izhz xfvw mrji",
  },
});

/**
 * Send an email notification.
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log(`📩 Sending email to: ${to}`);
    console.log(`📌 Subject: ${subject}`);

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email: ${error.message}`);
    throw error;
  }
}

/**
 * Schedule a notification
 */
export function scheduleNotification({
  to,
  subject,
  text,
  html,
  scheduledTime,
}) {
  const id = `notification-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  console.log(`⏳ Scheduling notification ID: ${id} at ${scheduledTime}`);

  const job = schedule.scheduleJob(scheduledTime, async () => {
    console.log(`🚀 Executing job for notification ID: ${id}`);

    try {
      await sendEmail({ to, subject, text, html });
      console.log(`✅ Notification ${id} sent successfully.`);
      scheduledJobs.delete(id);
    } catch (error) {
      console.error(`❌ Failed to send notification ${id}:`, error);
    }
  });

  scheduledJobs.set(id, job);
  return id;
}

/**
 * Cancel a scheduled notification
 */
export function cancelNotification(id) {
  const job = scheduledJobs.get(id);
  if (job) {
    job.cancel();
    scheduledJobs.delete(id);
    console.log(`🛑 Notification ${id} cancelled.`);
    return true;
  } else {
    console.log(`⚠️ No notification found with ID: ${id}`);
    return false;
  }
}

/**
 * Get all scheduled notifications
 */
export function getScheduledNotifications() {
  console.log(
    "📜 Currently scheduled notifications:",
    Array.from(scheduledJobs.keys())
  );
  return Array.from(scheduledJobs.keys());
}

export const sendNotification = async (userId, message, type) => {
  try {
    // TODO: Implement notification logic
    return {
      success: true,
      message: "Notification sent successfully",
    };
  } catch (error) {
    throw new Error("Failed to send notification: " + error.message);
  }
};

export const getNotifications = async (userId) => {
  try {
    // TODO: Implement fetch notifications logic
    return [];
  } catch (error) {
    throw new Error("Failed to fetch notifications: " + error.message);
  }
};
