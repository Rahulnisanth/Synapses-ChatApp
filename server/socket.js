import { Message } from "./models/message_model.js";
import { Server } from "socket.io";

export const setUpSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
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

      // Emit the message to the recipient and sender as before
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

    // Handle socket disconnection
    socket.on("disconnect", () => disconnect(socket));
  });
};
