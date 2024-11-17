import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import { Player } from "@lottiefiles/react-lottie-player";
import animationSource from "@/assets/animations/circular_animation.json";

const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profile_setup) {
      toast.error("Please setup the profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);
  return (
    <div className="flex h-[100vh] overflow-hidden text-white">
      {/* Uploading */}
      {isUploading && (
        <div className="fixed h-full w-full z-[1000] flex flex-col justify-center items-center backdrop-blur-lg">
          <div className="flex flex-col justify-center items-center duration-100 transition-all">
            <Player
              src={animationSource}
              className="player block p-3 h-[300px]"
              loop
              autoplay
            />
            <div className="text-center text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-4xl text-3xl transition-all duration-300">
              <h3 className="font-bold">Uploading File</h3>
              <p className="text-xl lg:text-2xl text-gray-400 mt-2">
                {fileUploadProgress} %
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Downloading */}
      {isDownloading && (
        <div className="fixed h-full w-full z-[1000] flex flex-col justify-center items-center backdrop-blur-lg">
          <div className="flex flex-col justify-center items-center duration-100 transition-all">
            <Player
              src={animationSource}
              className="player block p-3 h-[300px]"
              loop
              autoplay
            />
            <div className="text-center text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-4xl text-3xl transition-all duration-300">
              <h3 className="font-bold">Downloading File</h3>
              <p className="text-xl lg:text-2xl text-gray-400 mt-2">
                {fileDownloadProgress} %
              </p>
            </div>
          </div>
        </div>
      )}
      <ContactsContainer />
      {selectedChatType && selectedChatData ? (
        <ChatContainer />
      ) : (
        <EmptyChatContainer />
      )}
    </div>
  );
};

export default Chat;
