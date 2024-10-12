import React, { useRef, useEffect } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { api_client } from "@/lib/api-client";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
const MessageContainer = () => {
  const scrollRef = useRef(null);
  const {
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  useEffect(() => {
    try {
      const getMessages = async () => {
        const response = await api_client.post(
          GET_MESSAGES_ROUTE,
          {
            id: selectedChatData._id,
          },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      };
      if (selectedChatData._id) {
        if (selectedChatType === "contact") {
          getMessages();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(messageDate).format("LL")}
            </div>
          )}
          {renderMessage(message)}
        </div>
      );
    });
  };

  const renderMessage = (message) => {
    const isSentByUser = message.sender === selectedChatData._id;
    return (
      <div className={`${isSentByUser ? "text-left" : "text-right"}`}>
        <div
          className={`${
            isSentByUser
              ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
              : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
        <div className="text-xs text-gray-500">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} className="h-10 w-10" />
    </div>
  );
};

export default MessageContainer;
