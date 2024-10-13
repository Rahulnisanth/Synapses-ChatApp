import { Router } from "express";
import { verifyToken } from "../middleware/auth_middleware.js";
import { getMessages } from "../controllers/messages_controller.js";
import multer from "multer";
import { addFiles } from "../controllers/messages_controller.js";

const message_route = Router();
const uploadFile = multer({ dest: "uploads/files/" });

message_route.post("/get-messages", verifyToken, getMessages);
message_route.post(
  "/upload-files",
  verifyToken,
  uploadFile.single("file"),
  addFiles
);
export default message_route;
