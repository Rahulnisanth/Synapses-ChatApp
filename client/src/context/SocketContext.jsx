/* eslint-disable react-refresh/only-export-components */
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { useContext, useEffect, createContext, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo && !socket.current) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { user_id: userInfo.id },
      });

      const handleMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addNotification,
        } = useAppStore.getState();
        if (
          selectedChatType &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        } else {
          addNotification(message.sender._id || message.recipient._id);
        }
      };

      const handleChannelMessage = (message) => {
        const {
          selectedChatType,
          selectedChatData,
          addMessage,
          addChannelForward,
          addNotification,
        } = useAppStore.getState();
        if (
          selectedChatType &&
          message.channelId &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        } else {
          addNotification(message.channelId);
        }
        addChannelForward(message);
      };

      // Set up event listeners for socket messages
      socket.current.on("receiveMessage", handleMessage);
      socket.current.on("receiveChannelMessage", handleChannelMessage);

      // Connection status events
      socket.current.on("connect", () => {
        console.log("Connected to the socket server");
      });
      socket.current.on("connect_error", (error) => {
        console.error("Connection error: ", error);
      });

      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleMessage);
          socket.current.off("receiveChannelMessage", handleChannelMessage);
          socket.current.disconnect();
          socket.current = null;
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
