export const create_chat_slice = (set, get) => ({
  // Single chat management =>
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
  // New message adding management
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
        },
      ],
    });
  },
  // File uploading & downloading management
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsDownloading: (isDownloading) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),
  // Channel management
  channels: [],
  setChannels: (channels) => set({ channels }),
  addChannels: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },
  addChannelForward: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );
    if (index !== -1 && index !== undefined) {
      channels.splice(index, 1);
      channels.unshift(data);
    }
  },
  // Notifications management
  notificationChats: [],
  addNotification: (chatId) => {
    const { notificationChats } = get();
    if (!notificationChats.includes(chatId)) {
      set({ notificationChats: [...notificationChats, chatId] });
    }
  },
  removeNotification: (chatId) => {
    const { notificationChats } = get();
    set({ notificationChats: notificationChats.filter((id) => id !== chatId) });
  },
});
