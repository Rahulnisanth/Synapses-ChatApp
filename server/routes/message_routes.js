import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import {
  getMessages,
  getSignedUrl,
} from "../controllers/messages_controller.js";
import { addFiles } from "../controllers/messages_controller.js";
import upload from "../multer.js";

const message_route = Router();

message_route.post("/get-messages", verifyToken, getMessages);
message_route.post(
  "/upload-files",
  verifyToken,
  upload.single("file"),
  addFiles
);
message_route.get("/generate-signed-url/:fileUrl", getSignedUrl);
export default message_route;
