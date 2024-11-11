import { useAppStore } from "@/store";
import React from "react";
import { Avatar } from "./ui/avatar";
import { HOST } from "../utils/constants.js";
import { TbBellRingingFilled } from "react-icons/tb";

const ContactList = ({
  contacts,
  isChannel = false,
  notificationChats,
  onChatSelect,
}) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
    // Clear notification for the selected contact
    onChatSelect(contact._id);
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-5 pr-9 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 justify-start text-neutral-300">
              {!isChannel && (
                <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                  {contact.image ? (
                    <img
                      src={`${contact.image}`}
                      className="object-cover h-full w-full rounded-full"
                    />
                  ) : (
                    <div className="uppercase text-xs font-bold h-8 w-8 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                      {contact.first_name
                        ? contact.first_name.split("").slice(0, 2)
                        : contact.email.split("").slice(0, 2)}
                    </div>
                  )}
                </Avatar>
              )}
              {isChannel && (
                <div className="font-bold h-8 w-8 rounded-full flex justify-center items-center bg-[#683c8c57] text-purple-500 border-[1px] border-purple-500">
                  #
                </div>
              )}
              {/* Name */}
              <span>
                {isChannel
                  ? contact.name
                  : `${contact.first_name} ${contact.last_name}`}
              </span>
            </div>
            <div>
              {/* Notification badge */}
              {notificationChats.includes(contact._id) && (
                <TbBellRingingFilled className="text-purple-500 text-xl" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
