import React, { useRef, useEffect, useState } from "react";
import { useAppStore } from "@/store";
import moment from "moment";
import { api_client } from "@/lib/api-client";
import {
  GET_CHANNEL_MESSAGES,
  GET_MESSAGES_ROUTE,
  HOST,
} from "@/utils/constants";
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
        console.error(err);
      }
    };

    const getChannelMessages = async () => {
      try {
        const response = await api_client.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  // TODO: To fix the download error for PDFs, and other doc files
  const handleDownload = async (fileUrl) => {
    const publicIdList = fileUrl.split("/").slice(-3); // ['files', '1731744755045', 'sgmtqhmtloekvhxwb0kd.pdf']
    const publicId = publicIdList.join("/");
    console.log(publicId);
    setIsDownloading(true);
    setFileDownloadProgress(0);

    try {
      // Request signed URL from backend
      const { data } = await api_client.get(`/generate-signed-url/${publicId}`);
      const signedUrl = data.signedUrl;
      console.log("Signed URL => ", signedUrl);

      // Fetch the file from the signed URL
      const response = await api_client.get(signedUrl, {
        responseType: "blob",
        onDownloadProgress: (event) => {
          if (event.lengthComputable) {
            const { loaded, total } = event;
            setFileDownloadProgress(Math.round((100 * loaded) / total));
          }
        },
      });

      const urlBlob = window.URL.createObjectURL(response.data);

      // Create download link
      const link = document.createElement("a");
      link.href = urlBlob;
      link.download = publicId.split("/").pop() || "download";
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error occurred while downloading the file.");
    } finally {
      setIsDownloading(false);
      setFileDownloadProgress(0);
    }
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
          {selectedChatType === "channel" &&
            message.sender._id &&
            renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderMessage = (message) => {
    const isSentByUser = message.sender !== selectedChatData._id;
    return (
      <div className={`${isSentByUser ? "text-right" : "text-left"}`}>
        {/* Text Message */}
        {message.messageType === "text" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-2 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
            style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)" }}
          >
            {message.content}
          </div>
        )}

        {/* File Message */}
        {message.messageType === "file" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-2 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
            style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)" }}
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
                  src={`${message.fileUrl}`}
                  alt="File"
                  className="max-w-full h-auto sm:max-h-[200px] md:max-h-[300px] object-contain rounded-lg"
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
        {/* Timestamp */}
        <div className="text-xs text-gray-500 mt-1">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    const isSentByUser = message.sender._id === userInfo.id;
    return (
      <div className={`${isSentByUser ? "text-right" : "text-left"} mt-2`}>
        {/* Text chat box */}
        {message.messageType === "text" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-2 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
            style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)" }}
          >
            {message.content}
          </div>
        )}
        {/* File chat box */}
        {message.messageType === "file" && (
          <div
            className={`${
              isSentByUser
                ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/50"
                : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
            } border inline-block p-3 rounded-lg my-2 max-w-full sm:max-w-[85%] md:max-w-[70%] lg:max-w-[60%] break-words`}
            style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)" }}
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
                  src={`${message.fileUrl}`}
                  alt="File"
                  className="max-w-full h-auto sm:max-h-[200px] md:max-h-[300px] object-contain rounded-lg"
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
        {/* Sender Info (for received messages) */}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 rounded-full overflow-hidden">
              {message.sender.image ? (
                <img
                  src={`${message.sender.image}`}
                  className="object-cover h-full w-full rounded-full"
                  alt="avatar"
                />
              ) : (
                <div className="uppercase text-xs font-bold h-7 w-7 rounded-full flex justify-center items-center bg-[#712a4c57] text-[#ff006e] border border-[#ff006faa] cursor-pointer">
                  {message.sender.first_name
                    ? message.sender.first_name.slice(0, 2)
                    : message.sender.email.slice(0, 2)}
                </div>
              )}
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-600">
                {`${message.sender.first_name} ${message.sender.last_name}`}
              </span>
              <span className="text-xs text-gray-500">
                {moment(message.timestamp).format("LT")}
              </span>
            </div>
          </div>
        ) : (
          // Timestamp for sent messages only
          <div className="text-xs text-gray-500 mt-1">
            {moment(message.timestamp).format("LT")}
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
                src={`${imageUrl}`}
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
