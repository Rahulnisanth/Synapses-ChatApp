import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

const MessageBar = () => {
  const emojiRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect(() => {
    function handleEmojiPickerClose(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleEmojiPickerClose);
    return () => {
      document.removeEventListener("mousedown", handleEmojiPickerClose);
    };
  }, [emojiRef]);

  const handleEmoji = (emoji) => {
    setMessage((message) => message + emoji.emoji);
  };

  const sendMessage = async () => {
    console.log(message);
    setMessage("");
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
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* Attachment Button */}
        <button className="text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all">
          <GrAttachment className="text-xl sm:text-2xl" />
        </button>
        {/* Emoji Button */}
        <div className="relative mt-2">
          <button
            onClick={() => setEmojiPickerOpen(true)}
            className="text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all"
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
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
        onClick={sendMessage}
        className="bg-[#8417ff] flex items-center rounded-lg hover:bg-[#741bda] justify-center p-4 sm:p-5 text-xl sm:text-2xl focus:outline-none duration-300 transition-all"
      >
        <IoSend />
      </button>
    </div>
  );
};

export default MessageBar;
