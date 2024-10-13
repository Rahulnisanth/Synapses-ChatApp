export const create_chat_slice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  dmList: [],
  setSelectedChatType: (selectedChatType) =>
    set({ selectedChatType: selectedChatType }),
  setSelectedChatData: (selectedChatData) =>
    set({ selectedChatData: selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages: selectedChatMessages }),
  setDmList: (dmList) => set({ dmList: dmList }),
  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient: message.recipient._id,
          sender: message.sender._id,
        },
      ],
    });
  },
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  channels: [],
  setChannels: (channels) => set({ channels }),
  addChannels: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
});
