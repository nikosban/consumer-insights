import { create } from 'zustand';
import type { AIConversation, AIMessage, CIHandoff } from '@/types';

type AIStore = {
  conversation: AIConversation;
  isStreaming: boolean;
  pendingHandoff: CIHandoff | null;
  addMessage: (msg: AIMessage) => void;
  updateLastAssistantMessage: (patch: Partial<AIMessage>) => void;
  setStreaming: (v: boolean) => void;
  setPendingHandoff: (h: CIHandoff | null) => void;
  clearHandoff: () => void;
  reset: () => void;
};

const initialConversation: AIConversation = {
  id: 'conv-1',
  messages: [],
};

export const useAIStore = create<AIStore>((set) => ({
  conversation: initialConversation,
  isStreaming: false,
  pendingHandoff: null,

  addMessage: (msg) =>
    set((s) => ({
      conversation: {
        ...s.conversation,
        messages: [...s.conversation.messages, msg],
      },
    })),

  updateLastAssistantMessage: (patch) =>
    set((s) => {
      const msgs = [...s.conversation.messages];
      const lastIdx = msgs.findLastIndex((m) => m.role === 'assistant');
      if (lastIdx === -1) return s;
      msgs[lastIdx] = { ...msgs[lastIdx], ...patch };
      return { conversation: { ...s.conversation, messages: msgs } };
    }),

  setStreaming: (v) => set({ isStreaming: v }),

  setPendingHandoff: (h) => set({ pendingHandoff: h }),

  clearHandoff: () => set({ pendingHandoff: null }),

  reset: () => set({ conversation: { ...initialConversation, id: `conv-${Date.now()}` }, pendingHandoff: null }),
}));
