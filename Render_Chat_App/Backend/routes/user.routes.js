import { Router } from "express";
import {
  acceptFriendRequest,
  getFriendRequests,
  getFriends,
  getUsersForSidebar,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Define your user-related routes here
router.get("/", protectRoute, getUsersForSidebar);
router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile,
);

// New Friend Routes
router.get("/friends", protectRoute, getFriends);
router.get("/search", protectRoute, searchUsers);
router.get("/requests", protectRoute, getFriendRequests);
router.post("/request/:id", protectRoute, sendFriendRequest);
router.post("/accept/:id", protectRoute, acceptFriendRequest);
router.post("/reject/:id", protectRoute, rejectFriendRequest);

export default router;
