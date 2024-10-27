import React, { useRef, useEffect, useState } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { api_client } from "@/lib/api-client";
import { GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import { MdFolderZip, MdOutlineDownloading } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";

const MessageContainer = () => {
  const scrollRef = useRef(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();

  const checkImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await api_client.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const handleDownload = async (fileUrl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await api_client.get(`${HOST}/${fileUrl}`, {
      responseType: "blob",
      onDownloadProgress: (event) => {
        const { loaded, total } = event;
        setFileDownloadProgress(Math.round((100 * loaded) / total));
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileUrl.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };

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
          {selectedChatType === "contact" && renderMessage(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderMessage = (message) => {
    console.log("Sender details => ", message.sender._id);
    const isSentByUser = message.sender === selectedChatData._id;
    return (
      <div className={`${isSentByUser ? "text-left" : "text-right"}`}>
        {message.messageType === "text" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-4 rounded my-1 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-4 rounded my-1 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setImageModalOpen(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="File"
                  className="max-w-full h-auto sm:max-h-[200px] md:max-h-[300px] object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-2xl sm:text-3xl bg-black/20 rounded-full p-2 sm:p-3">
                  <MdFolderZip />
                </span>
                <span className="truncate max-w-[50%] sm:max-w-[65%]">
                  {message.fileUrl.split("/").slice(-1)[0]}
                </span>
                <span
                  className="text-2xl sm:text-3xl cursor-pointer"
                  onClick={() => handleDownload(message.fileUrl)}
                >
                  <MdOutlineDownloading />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-500">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    console.log(message);
    const isSentByUser = message.sender === userInfo.id;
    return (
      <div className={`${isSentByUser ? "text-right" : "text-left"}`}>
        {/* Text chat box */}
        {message.messageType === "text" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-4 rounded my-1 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
          >
            {message.content}
          </div>
        )}
        {/* {message.sender._id !== userInfo.id ? (
          <div className="flex justify-end items-center gap-2">
            <Avatar className="h-6 w-6 rounded-full overflow-hidden">
              {message.sender.image ? (
                <img
                  src={`${HOST}/${message.sender.image}`}
                  className="object-cover h-full w-full rounded-full"
                  alt="message.sender avatar"
                />
              ) : (
                <div className="uppercase text-lg font-bold h-6 w-6 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border-[1px] border-[#ff006faa] cursor-pointer">
                  {message.sender.first_name
                    ? message.sender.first_name.slice(0, 2)
                    : message.sender.email.slice(0, 2)}
                </div>
              )}
            </Avatar>
            <span className="text-sm text-gray-500">{`${message.sender.first_name} ${message.sender.last_name}`}</span>
            <span className="text-xs text-gray-500">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-gray-500">
            {moment(message.timestamp).format("LT")}
          </div>
        )} */}
        {/* File chat box */}
        {message.messageType === "file" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-4 rounded my-1 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
          >
            {checkImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setImageModalOpen(true);
                  setImageUrl(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt="File"
                  className="max-w-full h-auto sm:max-h-[200px] md:max-h-[300px] object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-2xl sm:text-3xl bg-black/20 rounded-full p-2 sm:p-3">
                  <MdFolderZip />
                </span>
                <span className="truncate max-w-[50%] sm:max-w-[65%]">
                  {message.fileUrl.split("/").slice(-1)[0]}
                </span>
                <span
                  className="text-2xl sm:text-3xl cursor-pointer"
                  onClick={() => handleDownload(message.fileUrl)}
                >
                  <MdOutlineDownloading />
                </span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      {imageModalOpen && (
        <div className="fixed z-[1000] top-0 left-0 h-full w-full flex flex-col items-center justify-center backdrop-blur-lg">
          <div className="flex w-[90%] md:w-full flex-col justify-center items-center">
            <div>
              <img
                src={`${HOST}/${imageUrl}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
            <div className="flex gap-5 mt-5">
              <button
                onClick={() => handleDownload(imageUrl)}
                className="text-white/80 text-2xl sm:text-3xl bg-black/20 rounded-full p-2 sm:p-3"
              >
                <MdOutlineDownloading />
              </button>
              <button
                onClick={() => {
                  setImageModalOpen(false);
                  setImageUrl(null);
                }}
                className="text-white/80 text-2xl sm:text-3xl bg-black/20 rounded-full p-2 sm:p-3"
              >
                <IoCloseCircle />
              </button>
            </div>
          </div>
        </div>
      )}
      <div ref={scrollRef} className="h-10 w-10" />
    </div>
  );
};

export default MessageContainer;
