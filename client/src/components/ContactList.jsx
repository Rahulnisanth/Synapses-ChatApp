import { useAppStore } from "@/store";
import React from "react";
import { Avatar } from "./ui/avatar";
import { HOST } from "../utils/constants.js";

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-5 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]/50"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex items-center gap-5 justify-start text-neutral-300">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {contact.image ? (
                <img
                  src={`${HOST}/${contact.image}`}
                  className="object-cover h-full w-full rounded-full"
                />
              ) : (
                <div className="uppercase text-lg font-bold h-8 w-8 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                  {contact.first_name
                    ? contact.first_name.split("").slice(0, 2)
                    : contact.email.split("").slice(0, 2)}
                </div>
              )}
            </Avatar>
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span>{`${contact.first_name} ${contact.last_name}`}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
