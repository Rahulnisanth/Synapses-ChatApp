import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { api_client } from "@/lib/api-client";
import { ADD_FILES_ROUTE } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    const handleEmojiPickerClose = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    if (emojiPickerOpen) {
      document.addEventListener("mousedown", handleEmojiPickerClose);
    } else {
      document.removeEventListener("mousedown", handleEmojiPickerClose);
    }

    return () => {
      document.removeEventListener("mousedown", handleEmojiPickerClose);
    };
  }, [emojiPickerOpen]);

  const handleEmoji = (emoji) => {
    setMessage((message) => message + emoji.emoji);
  };

  const handleSendMessage = () => {
    const newMessage = {
      sender: userInfo.id,
      content: message,
      messageType: "text",
      fileUrl: undefined,
      timestamp: new Date(),
    };
    if (selectedChatType === "contact") {
      newMessage.recipient = selectedChatData._id;
      socket.emit("sendMessage", newMessage);
    } else if (selectedChatType === "channel") {
      newMessage.channelId = selectedChatData._id;
      socket.emit("sendChannelMessage", newMessage);
    }
    useAppStore.getState().addMessage(newMessage);
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const response = await api_client.post(ADD_FILES_ROUTE, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });
        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            const newMessage = {
              sender: userInfo.id,
              recipient: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              timestamp: new Date(),
            };
            socket.emit("sendMessage", newMessage);
            useAppStore.getState().addMessage(newMessage);
          } else if (selectedChatType === "channel") {
            const newMessage = {
              sender: userInfo.id,
              channelId: selectedChatData._id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              timestamp: new Date(),
            };
            socket.emit("sendChannelMessage", newMessage);
            useAppStore.getState().addMessage(newMessage);
          }
        }
      }
    } catch (err) {
      setIsUploading(false);
      console.log(err);
    }
  };

  return (
    <div className="h-[10vh] flex items-center justify-between bg-[#1c1d25] px-4 sm:px-6 md:px-8 md:mb-5 gap-3 sm:gap-4 md:gap-6">
      {/* Message Input Field */}
      <div className="flex flex-1 bg-[#2a2b33] rounded-md items-center gap-3 sm:gap-4 md:gap-5 pr-2 sm:pr-3 md:pr-5">
        <input
          type="text"
          className="flex-1 p-3 sm:p-4 md:p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-sm sm:text-base md:text-lg"
          placeholder="Enter the message here"
          value={message}
          onChange={(e) =>
            setMessage(
              e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
            )
          }
        />
        {/* Attachment Button */}
        <button
          onClick={handleAttachmentClick}
          className="text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all"
        >
          <GrAttachment className="text-xl sm:text-2xl" />
        </button>
        <input
          className="hidden"
          type="file"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
          name="file"
        />
        {/* Emoji Button */}
        <div className="relative mt-2">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </button>
          <div
            className="absolute bottom-16 -right-12 md:bottom-16 md:right-0"
            ref={emojiRef}
          >
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        className="bg-[#8417ff] flex items-center rounded-lg hover:bg-[#741bda] justify-center p-4 sm:p-5 text-xl sm:text-2xl focus:outline-none duration-300 transition-all"
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageBar;
