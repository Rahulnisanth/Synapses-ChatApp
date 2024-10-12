import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import { getMessages } from "../controllers/messages_controller.js";

const message_route = Router();

message_route.post("/get-messages", verifyToken, getMessages);

export default message_route;
