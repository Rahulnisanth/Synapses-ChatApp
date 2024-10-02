import { disconnect } from "mongoose";
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
    console.log(`USer disconnected from socket of ${socket.id}`);
    for (const [user_id, socket_id] of userSocketMap.entries()) {
      if (socket_id === socket.id) {
        userSocketMap.delete(user_id);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const user_id = socket.handshake.query.user_id;
    if (user_id) {
      userSocketMap.set(user_id, socket.id);
      console.log(`User of ${user_id} connected in socket of ${socket.id}`);
    } else {
      console.log("User if required for the socket connection");
    }

    socket.on("disconnect", () => disconnect(socket));
  });
};
