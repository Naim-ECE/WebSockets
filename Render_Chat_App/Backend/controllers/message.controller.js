import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      imageUrl = cldRes.secure_url;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      imageUrl,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error in sendMessage:", error.message);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({ message: "No conversation found" });
    }

    // Filter out messages that THIS user has permanently removed
    const userIdStr = senderId.toString();
    const filteredMessages = conversation.messages.filter(
      (msg) => !msg.deletedFor?.some((id) => id.toString() === userIdStr),
    );

    res.status(200).json({
      message: "Messages retrieved successfully",
      data: filteredMessages,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error in getMessages:", error.message);
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    // If message doesn't exist at all, just return success so frontend clears it
    if (!message) {
      return res
        .status(200)
        .json({ message: "Message already gone", messageId, permanent: true });
    }

    // If it's already soft-deleted, hide it ONLY for the person clicking delete
    if (message.isDeleted) {
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }

      // Tell ONLY this user's UI to remove it
      const userSocketId = getReceiverSocketId(userId);
      if (userSocketId) {
        io.to(userSocketId).emit("messagePermanentlyDeleted", messageId);
      }

      return res.status(200).json({
        message: "Removed from your view",
        messageId,
        permanent: true,
      });
    }

    // If it's a normal message, ONLY the sender can soft-delete it
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }

    message.isDeleted = true;
    message.message = "This message was deleted";
    message.imageUrl = null;
    await message.save();

    // Notify the OTHER user to update their UI to show "This message was deleted"
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }

    return res.status(200).json({
      message: "Message deleted successfully",
      messageId,
      permanent: false,
    });
  } catch (error) {
    console.error("Error in deleteMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      { senderId: senderId, receiverId: receiverId, isSeen: false },
      { $set: { isSeen: true } },
    );

    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { conversationId: senderId });
    }

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error("Error in markAsSeen:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
