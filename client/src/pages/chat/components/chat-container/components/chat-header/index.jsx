import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  return (
    <div className="h-[10vh] md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full border-b-2 border-[#2f303b] flex items-center justify-between px-8">
      {/* Channel/Message Name */}
      <div>
        <p className="text-2xl md:text-3xl font-light tracking-wider text-neutral-300">
          Name of the channel
        </p>
      </div>

      {/* Close Button */}
      <div className="flex items-center">
        <button className="text-neutral-500 hover:text-white focus:outline-none duration-300 transition-all">
          <RiCloseFill className="text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
