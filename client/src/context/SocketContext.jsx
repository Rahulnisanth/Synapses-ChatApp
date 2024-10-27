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
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo && !socket.current) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { user_id: userInfo.id },
      });

      const handleMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.recipient._id)
        ) {
          addMessage(message);
        }
      };

      const handleChannelMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage } =
          useAppStore.getState();
        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          addMessage(message);
        }
      };

      // receiving modules
      socket.current.on("receiveMessage", handleMessage);
      socket.current.on("receiveChannelMessage", handleChannelMessage);
      //   connection module
      socket.current.on("connect", () => {
        console.log("Connected to the socket server");
      });
      //   error handling
      socket.current.on("connect_error", (error) => {
        console.error("Connection error: ", error);
      });
      //   disconnection module
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
