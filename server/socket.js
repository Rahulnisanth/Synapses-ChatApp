import { Channel } from "./models/channel_model.js";
import { Message } from "./models/message_model.js";
import { Server } from "socket.io";

export const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`User disconnected from socket ${socket.id}`);
    for (const [user_id, socket_id] of userSocketMap.entries()) {
      if (socket_id === socket.id) {
        userSocketMap.delete(user_id);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      const createdMessage = await Message.create(message);
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email first_name last_name image")
        .populate("recipient", "id email first_name last_name image");

      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageSent", messageData);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageError", { error: err.message });
      }
    }
  };

  const sendChannelMessage = async (message) => {
    const { sender, channelId, content, messageType, fileUrl, timestamp } =
      message;

    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      fileUrl,
      timestamp,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "_id email first_name last_name image")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");
    const finalData = { ...messageData._doc, channelId: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receiveChannelMessage", finalData);
        }
      });

      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receiveChannelMessage", finalData);
      }
    }
  };

  io.on("connection", (socket) => {
    const user_id = socket.handshake.query.user_id;

    if (user_id) {
      userSocketMap.set(user_id, socket.id);
      console.log(`User ${user_id} connected with socket ${socket.id}`);
    } else {
      console.log("User ID is required for the socket connection");
    }

    // Listen for the "sendMessage" event and handle it
    socket.on("sendMessage", sendMessage);

    // Listen for the "sendChannelMessage" and handle it
    socket.on("sendChannelMessage", sendChannelMessage);

    // Handle socket disconnection
    socket.on("disconnect", () => disconnect(socket));
  });
};
