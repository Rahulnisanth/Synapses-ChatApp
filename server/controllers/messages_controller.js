import { Message } from "../models/message_model.js";

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
    });
    return response.status(200).json({ messages });
  } catch (err) {
    console.error("Error occurred during contact search", err);
    return response.status(500).send("Internal server error!");
  }
};
