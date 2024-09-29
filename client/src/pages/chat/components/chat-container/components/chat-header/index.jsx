import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex flex-row gap-5 items-center justify-between">
        <p className="text-3xl tracking-widest text-neutral-400 font-semibold">
          Name of the channel or message
        </p>
        <div className="flex items-center justify-center">
          <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
