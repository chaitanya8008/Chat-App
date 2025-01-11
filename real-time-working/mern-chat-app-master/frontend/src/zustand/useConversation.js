import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	messages: [],
	setMessages: (messages) => set({ messages }),
	starredMessages: [],
	starredMessagesLoadTime: null,
	setStarMessages: (messages) => set({ starredMessages: messages, starredMessagesLoadTime: Date.now() }),
}));

export default useConversation;
