const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;

    const notification = new Notification({
      title,
      message,
      type,
      userId
    });

    await notification.save();

      // Emit the notification event to the user
    //   req.io.to(userId).emit('receive-notification', notification);
      
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send notification to multiple users
exports.sendNotificationToMultipleUsers = async (req, res) => {
  try {
    const { title, message, type, userIds } = req.body;

    // Create notifications for each user in the userIds array
    const notifications = await Promise.all(userIds.map(async (userId) => {
      const notification = new Notification({
        title,
        message,
        type,
        userId
      });
      await notification.save();
      return notification;
    }));

    // Send real-time notifications using Socket.IO
    // userIds.forEach((userId) => {
    //   req.io.to(userId).emit('receive-notification', { title, message, type });
    // });

    res.status(201).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Resend an existing notification
exports.resendNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Emit the notification event again using Socket.IO
    // req.io.to(notification.userId).emit('receive-notification', {
    //   title: notification.title,
    //   message: notification.message,
    //   type: notification.type
    // });

    res.status(200).json({ success: true, message: 'Notification resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const Event = require('../models/Event');

// Fetch all system notifications
exports.getSystemNotifications = async (req, res) => {
  try {
    // Find notifications with type 'system'
    const systemNotifications = await Notification.find({ type: 'system' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: systemNotifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Fetch notifications for a user
exports.getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a notification by ID
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

