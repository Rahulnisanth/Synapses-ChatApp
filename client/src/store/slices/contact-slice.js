export const create_chat_slice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  setSelectedChatType: (selectedChatType) =>
    set({ selectedChatType: selectedChatType }),
  setSelectedChatData: (selectedChatData) =>
    set({ selectedChatData: selectedChatData }),
  setSelectedChatMessages: (selectedChatMessages) =>
    set({ selectedChatMessages: selectedChatMessages }),
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
});
