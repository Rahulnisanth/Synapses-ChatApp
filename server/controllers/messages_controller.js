import { Message } from "../models/message_model.js";
import { uploadToCloudinary } from "../cloudinary.js";

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

// Updated addFiles Controller with additional debugging
export const addFiles = async (request, response, next) => {
  try {
    console.log("File in request:", request.file);
    if (!request.file) {
      console.log("No file found in the request");
      return response.status(400).json({ message: "File is required" });
    }
    const date = Date.now().toString();

    const result = await uploadToCloudinary(request.file, `files/${date}`);
    console.log("File uploaded to Cloudinary:", result);

    return response.status(200).json({
      filePath: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Error occurred in adding files:", err);
    return response.status(500).send("Internal server error!");
  }
};
