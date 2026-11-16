import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password"); // $ne means "not equal to"

    res.status(200).json({
      message: "Users fetched successfully for sidebar",
      users: filteredUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users for sidebar",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Upload to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      upload_preset: "chat-app-profile", // Added your new preset
      folder: "profilePicture",
    });

    // Update User in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: cldRes.secure_url },
      { returnDocument: "after" }, // Returns the updated user object
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "-password",
    );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Search Users
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(200).json([]);

    const currentUser = await User.findById(req.user._id);

    // Find users matching query, excluding yourself
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: req.user._id },
    })
      .select("-password")
      .limit(10);

    // Filter out people who are already friends or have pending requests
    const filteredUsers = users.filter((user) => {
      const isFriend = currentUser.friends.includes(user._id);
      const isSent = currentUser.sentRequests.includes(user._id);
      const isReceived = currentUser.receivedRequests.includes(user._id);
      return !isFriend && !isSent && !isReceived;
    });

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3. Send Friend Request
export const sendFriendRequest = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ error: "You cannot add yourself" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!receiver) return res.status(404).json({ error: "User not found" });
    if (receiver.receivedRequests.includes(senderId))
      return res.status(400).json({ error: "Request already sent" });

    sender.sentRequests.push(receiverId);
    receiver.receivedRequests.push(senderId);

    await Promise.all([sender.save(), receiver.save()]);

    // Emit socket event to the receiver instantly
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", { senderId });
    }

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 4. Accept Friend Request
export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver)
      return res.status(404).json({ error: "User not found" });

    // Add to friends list for both
    sender.friends.push(receiverId);
    receiver.friends.push(senderId);

    // Remove from pending requests
    sender.sentRequests = sender.sentRequests.filter(
      (id) => id.toString() !== receiverId.toString(),
    );
    receiver.receivedRequests = receiver.receivedRequests.filter(
      (id) => id.toString() !== senderId.toString(),
    );

    await Promise.all([sender.save(), receiver.save()]);

    // Emit socket event to the sender so their friend list updates instantly
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("friendRequestAccepted", {
        newFriend: receiver,
      });
    }

    res.status(200).json({ message: "Request accepted", newFriend: sender });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 5. Reject / Cancel Friend Request
export const rejectFriendRequest = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await User.findByIdAndUpdate(senderId, {
      $pull: { sentRequests: receiverId },
    });
    await User.findByIdAndUpdate(receiverId, {
      $pull: { receivedRequests: senderId },
    });

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// 6. Get Pending Requests
export const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "receivedRequests",
      "-password",
    );
    res.status(200).json(user.receivedRequests);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
