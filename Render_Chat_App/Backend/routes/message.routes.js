import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getMessages,
  sendMessage,
  deleteMessage,
  markAsSeen,
} from "../controllers/message.controller.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);
router.delete("/delete/:id", protectRoute, deleteMessage);
router.put("/seen/:id", protectRoute, markAsSeen);

export default router;
