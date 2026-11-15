import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

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
