import { scheduleNotification, cancelNotification, getScheduledNotifications } from '../services/notificationService.js';

/**
 * Schedule a new notification
 */
export function schedule(req, res) {
  try {
    const { email, subject, message, htmlMessage, scheduledTime } = req.body;

    if (!email || !subject || !message || !scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`📤 Received request to schedule notification for ${email} at ${scheduledTime}`);

    const notificationId = scheduleNotification({
      to: email,
      subject,
      text: message,
      html: htmlMessage || undefined,
      scheduledTime: new Date(scheduledTime)
    });

    res.status(201).json({ 
      success: true, 
      id: notificationId,
      nextRunTime: new Date(scheduledTime).toLocaleString()
    });
  } catch (error) {
    console.error('❌ Error scheduling notification:', error);
    res.status(500).json({ error: 'Failed to schedule notification' });
  }
}

/**
 * Cancel a notification
 */
export function cancel(req, res) {
  const { id } = req.params;
  const cancelled = cancelNotification(id);
  
  if (cancelled) {
    res.status(200).json({ success: true, message: 'Notification cancelled' });
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
}

/**
 * Get all scheduled notifications
 */
export function list(req, res) {
  const notifications = getScheduledNotifications();
  res.status(200).json({ notifications });
}
