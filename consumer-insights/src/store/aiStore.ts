import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  loadConversation: (msgs: AIMessage[]) => void
  removeHistory: (id: string) => void
  clearHistory: () => void
}

const initialConversation: AIConversation = {
  id: 'conv-1',
  messages: [],
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString()

const MOCK_HISTORY: ChatHistoryEntry[] = [
  // Recent
  { id: 'h-1',  firstMessage: 'What is the purchase intent for premium headphones among 25–34 year-olds in Germany?', createdAt: daysAgo(0.1) },
  { id: 'h-2',  firstMessage: 'Which streaming platforms have the highest brand recall among Millennials in the UK?', createdAt: daysAgo(0.4) },
  { id: 'h-3',  firstMessage: 'What is the adoption rate of AI productivity tools among knowledge workers in North America?', createdAt: daysAgo(0.8) },
  { id: 'h-4',  firstMessage: 'How do TikTok and Instagram compare as social commerce purchase drivers among 18–30 year-olds?', createdAt: daysAgo(1.5) },
  { id: 'h-5',  firstMessage: 'What are Gen Z consumer attitudes toward sustainable brands in Western Europe?', createdAt: daysAgo(2) },
  { id: 'h-6',  firstMessage: 'Which age group streams the most music on mobile in the US?', createdAt: daysAgo(3) },
  // Older
  { id: 'h-10', firstMessage: 'Compare EV purchase intent across Germany, France, and the US', createdAt: daysAgo(10) },
  { id: 'h-11', firstMessage: 'NPS benchmark for digital banking apps in Southeast Asia', createdAt: daysAgo(13) },
  { id: 'h-12', firstMessage: 'Gaming hardware upgrade intent among PC gamers in the US — 2024 vs. 2023', createdAt: daysAgo(16) },
  { id: 'h-13', firstMessage: 'Which income bracket spends the most on home fitness equipment in 2024?', createdAt: daysAgo(19) },
  { id: 'h-14', firstMessage: 'Food delivery app satisfaction and churn drivers in urban Southeast Asia', createdAt: daysAgo(22) },
  { id: 'h-15', firstMessage: 'Gen Z attitude toward loyalty programs in retail — key drivers and drop-off points', createdAt: daysAgo(25) },
  { id: 'h-16', firstMessage: 'Brand trust levels for plant-based food brands in Germany vs. the Netherlands', createdAt: daysAgo(29) },
  { id: 'h-17', firstMessage: 'How do subscription fatigue levels compare across streaming, SaaS, and news in the UK?', createdAt: daysAgo(34) },
  { id: 'h-18', firstMessage: 'Luxury travel intent among HNW individuals in the Middle East — key motivations', createdAt: daysAgo(41) },
]

export const useAIStore = create<AIStore>()(
  persist(
    (set) => ({
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

  loadConversation: (msgs) => set((s) => ({
    conversation: { ...s.conversation, id: `conv-${Date.now()}`, messages: msgs, isPreset: true },
    isStreaming: false,
    pendingHandoff: null,
  })),

  reset: () => set((s) => {
    const firstUserMsg = s.conversation.messages.find(m => m.role === 'user')
    const isPreset = (s.conversation as AIConversation & { isPreset?: boolean }).isPreset
    const newHistory = firstUserMsg && !isPreset
      ? [{ id: s.conversation.id, firstMessage: firstUserMsg.content.slice(0, 120), createdAt: new Date().toISOString() }, ...s.history]
      : s.history
    return {
      conversation: { ...initialConversation, id: `conv-${Date.now()}` },
      isStreaming: false,
      pendingHandoff: null,
      history: newHistory,
    }
    }),

  removeHistory: (id) =>
    set((s) => ({ history: s.history.filter((h) => h.id !== id) })),

  clearHistory: () => set({ history: [] }),
  }),
  { name: 'ci-ai', partialize: (s) => ({ history: s.history }) }
))
