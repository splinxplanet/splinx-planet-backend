const User = require("../models/User");
// import message model
const Message = require("../models/MessagingModel");

// post new message and store controller
exports.postMessage = async (req, res) => {
  try {
    const { senderId, recipientId, messageType, messageText, imageUrl } = req.body;

    const newMessage = new Message({
      senderId,
      recipientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? imageUrl : null,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get userDetails controller
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recipientDetails = await User.findById(userId);

    res.json(recipientDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// fetch messages between user controller
exports.fetchMessages = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// delete single message controller
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required" });
    }

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// mark message as read controller
exports.markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required" });
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true } // Return the updated document
    );  
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message marked as read successfully", updatedMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
