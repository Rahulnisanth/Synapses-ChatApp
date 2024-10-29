import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import {
  createChannel,
  getChannelMessages,
  getUserChannels,
} from "../controllers/channel_controller.js";

const channel_route = Router();

channel_route.post("/create-channel", verifyToken, createChannel);
channel_route.get("/get-user-channels", verifyToken, getUserChannels);
channel_route.get(
  "/get-channel-messages/:channelId",
  verifyToken,
  getChannelMessages
);

export default channel_route;
