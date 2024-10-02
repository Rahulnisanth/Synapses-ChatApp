import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { Avatar } from "@/components/ui/avatar";
import { HOST } from "@/utils/constants";
import { useAppStore } from "@/store";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full border-b-2 border-[#2f303b] flex items-center justify-between px-8">
      {/* Channel/Message Name */}
      <div className="flex gap-3 items-center">
        <div className="relative h-10 w-10">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden">
            {selectedChatData.image ? (
              <img
                src={`${HOST}/${selectedChatData.image}`}
                className="object-cover h-full w-full rounded-full"
              />
            ) : (
              <div className="uppercase text-lg font-bold h-10 w-10 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                {selectedChatData.first_name
                  ? selectedChatData.first_name.split("").slice(0, 2)
                  : selectedChatData.email.split("").slice(0, 2)}
              </div>
            )}
          </Avatar>
        </div>
        <p className="text-2xl md:text-3xl font-medium tracking-wider text-neutral-300">
          {selectedChatType === "contact"
            ? selectedChatData.first_name && selectedChatData.last_name
              ? `${selectedChatData.first_name} ${selectedChatData.last_name}`
              : selectedChatData.email
              ? `${selectedChatData.email}`
              : ""
            : "channel name"}
        </p>
      </div>

      {/* Close Button */}
      <div className="flex items-center">
        <button
          onClick={closeChat}
          className="text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all"
        >
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
