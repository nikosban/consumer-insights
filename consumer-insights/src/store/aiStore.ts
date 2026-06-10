import { create } from 'zustand';
import type { AIConversation, AIMessage, CIHandoff } from '@/types';

export type ChatHistoryEntry = {
  id: string
  firstMessage: string
  createdAt: string
}

type AIStore = {
  conversation: AIConversation
  isStreaming: boolean
  pendingHandoff: CIHandoff | null
  history: ChatHistoryEntry[]
  addMessage: (msg: AIMessage) => void
  updateLastAssistantMessage: (patch: Partial<AIMessage>) => void
  setStreaming: (v: boolean) => void
  setPendingHandoff: (h: CIHandoff | null) => void
  clearHandoff: () => void
  reset: () => void
}

const initialConversation: AIConversation = {
  id: 'conv-1',
  messages: [],
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString()

const MOCK_HISTORY: ChatHistoryEntry[] = [
  { id: 'h-1', firstMessage: 'What customer feedback are you reviewing today for the recent app update?', createdAt: daysAgo(1) },
  { id: 'h-2', firstMessage: 'Which consumer demographics are you focusing on for the upcoming holiday sales campaign?', createdAt: daysAgo(2) },
  { id: 'h-3', firstMessage: 'What devices do Gen Z users prefer for online shopping?', createdAt: daysAgo(4) },
  { id: 'h-4', firstMessage: 'Brand awareness trends for sustainable products in 2024', createdAt: daysAgo(6) },
  { id: 'h-5', firstMessage: 'What customer behavior data do you need regarding online shopping habits?', createdAt: daysAgo(12) },
  { id: 'h-6', firstMessage: 'Which audience has the highest purchase intent for fitness equipment?', createdAt: daysAgo(18) },
  { id: 'h-7', firstMessage: 'How do high-income homeowners compare to average consumers for home improvement?', createdAt: daysAgo(22) },
  { id: 'h-8', firstMessage: 'What are the key differences between Millennial and Gen Z shoppers?', createdAt: daysAgo(28) },
]

export const useAIStore = create<AIStore>((set) => ({
  conversation: initialConversation,
  isStreaming: false,
  pendingHandoff: null,
  history: MOCK_HISTORY,

  addMessage: (msg) =>
    set((s) => ({
      conversation: {
        ...s.conversation,
        messages: [...s.conversation.messages, msg],
      },
    })),

  updateLastAssistantMessage: (patch) =>
    set((s) => {
      const msgs = [...s.conversation.messages]
      const lastIdx = msgs.findLastIndex((m) => m.role === 'assistant')
      if (lastIdx === -1) return s
      msgs[lastIdx] = { ...msgs[lastIdx], ...patch }
      return { conversation: { ...s.conversation, messages: msgs } }
    }),

  setStreaming: (v) => set({ isStreaming: v }),

  setPendingHandoff: (h) => set({ pendingHandoff: h }),

  clearHandoff: () => set({ pendingHandoff: null }),

  reset: () => set((s) => {
    const firstUserMsg = s.conversation.messages.find(m => m.role === 'user')
    const newHistory = firstUserMsg
      ? [{ id: s.conversation.id, firstMessage: firstUserMsg.content.slice(0, 120), createdAt: new Date().toISOString() }, ...s.history]
      : s.history
    return {
      conversation: { ...initialConversation, id: `conv-${Date.now()}` },
      isStreaming: false,
      pendingHandoff: null,
      history: newHistory,
    }
  }),
}))
