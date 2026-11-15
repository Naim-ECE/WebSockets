import { create } from "zustand";

const useConversationStore = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  removeMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== messageId),
    })),

  markMessageDeleted: (messageId) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId
          ? {
              ...msg,
              message: "This message was deleted",
              imageUrl: null,
              isDeleted: true,
            }
          : msg,
      ),
    })),

  markAllAsSeen: () =>
    set((state) => ({
      messages: state.messages.map((msg) => ({ ...msg, isSeen: true })),
    })),
}));

export default useConversationStore;
