import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import {
  createChannel,
  getUserChannels,
} from "../controllers/channel_controller.js";

const channel_route = Router();

channel_route.post("/create-channel", verifyToken, createChannel);
channel_route.get("/get-user-channels", verifyToken, getUserChannels);

export default channel_route;
