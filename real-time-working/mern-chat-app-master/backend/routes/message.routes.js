import express from "express";
import { getMessages, getStarredMessage, sendMessage, starMessage, unStarMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/starred/", protectRoute, getStarredMessage);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);
router.put("/star/:message", protectRoute, starMessage);
router.delete("/star/:message", protectRoute, unStarMessage);

export default router;