import { create } from "zustand";

const useConversationStore = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation: selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages: messages }),
}));

export default useConversationStore;
