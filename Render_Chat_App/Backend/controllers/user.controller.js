import User from "../models/user.model.js";

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
