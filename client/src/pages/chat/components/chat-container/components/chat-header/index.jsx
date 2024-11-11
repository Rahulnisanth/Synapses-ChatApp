import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full border-b border-gray-700 bg-[#1e1e2a] shadow-md flex items-center justify-between px-6 md:px-8">
      {/* Channel/Message Name */}
      <div className="flex gap-4 items-center">
        <div className="relative h-12 w-12">
          {selectedChatType === "contact" ? (
            <Avatar className="h-12 w-12 rounded-full overflow-hidden shadow-lg">
              {selectedChatData.image ? (
                <img
                  src={`${selectedChatData.image}`}
                  className="object-cover h-full w-full rounded-full"
                  alt="Chat Avatar"
                />
              ) : (
                <div className="uppercase text-lg font-bold h-12 w-12 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa]">
                  {selectedChatData.first_name
                    ? selectedChatData.first_name.substring(0, 2)
                    : selectedChatData.email.substring(0, 2)}
                </div>
              )}
            </Avatar>
          ) : (
            <div className="font-bold text-2xl h-12 w-12 rounded-full flex justify-center items-center bg-[#683c8c57] text-purple-500 border-[1px] border-purple-500">
              #
            </div>
          )}
        </div>
        <span className="text-2xl md:text-3xl font-bold text-opacity-90 text-md text-gray-400">
          {selectedChatType === "contact"
            ? selectedChatData.first_name && selectedChatData.last_name
              ? `${selectedChatData.first_name} ${selectedChatData.last_name}`
              : selectedChatData.email
              ? `${selectedChatData.email}`
              : ""
            : selectedChatData.name}
        </span>
      </div>

      {/* Close Button */}
      <div className="flex items-center">
        <button
          onClick={closeChat}
          className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors duration-200 ease-in-out"
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
