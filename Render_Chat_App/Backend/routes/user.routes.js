import { Router } from "express";
import {
  getUsersForSidebar,
  updateProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define your user-related routes here
router.get("/", protectRoute, getUsersForSidebar);
router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile,
);

export default router;
