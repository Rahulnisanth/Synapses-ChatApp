import { Message } from "../models/message_model.js";
import { mkdirSync, renameSync } from "fs";

// Search contacts controller:
export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.user_id;
    const user2 = request.body.id;
    if (!user1 || !user2) {
      return response.status(400).send("Both users are required.");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return response.status(200).json({ messages });
  } catch (err) {
    console.error("Error occurred in getting messages", err);
    return response.status(500).send("Internal server error!");
  }
};

// Upload files controller
export const addFiles = async (request, response, next) => {
  try {
    if (!request.file) {
      return response.status(400).message("File is required");
    }
    const date = Date.now().toString();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${request.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(request.file.path, fileName);
    return response.status(200).json({ filePath: fileName });
  } catch (err) {
    console.error("Error occurred in adding files", err);
    return response.status(500).send("Internal server error!");
  }
};
