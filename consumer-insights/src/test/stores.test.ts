/**
 * Store tests — verify state mutations don't throw and leave stores in a
 * consistent shape. These catch the class of crash where a component tries
 * to read a field that an action forgot to initialise.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useAIStore } from '@/store/aiStore'
import { useAudienceStore } from '@/store/audienceStore'
import { useDashboardStore } from '@/store/dashboardStore'
import type { AIMessage, Audience, Dashboard } from '@/types'

// ─── AI Store ────────────────────────────────────────────────────────────────

describe('aiStore', () => {
  beforeEach(() => {
    useAIStore.getState().reset()
  })

  it('starts with an empty conversation after reset', () => {
    expect(useAIStore.getState().conversation.messages).toHaveLength(0)
  })

  it('addMessage appends to the conversation', () => {
    const msg: AIMessage = { id: 'u1', role: 'user', content: 'Hello' }
    useAIStore.getState().addMessage(msg)
    expect(useAIStore.getState().conversation.messages).toHaveLength(1)
    expect(useAIStore.getState().conversation.messages[0].content).toBe('Hello')
  })

  it('updateLastAssistantMessage patches only the last assistant message', () => {
    const { addMessage, updateLastAssistantMessage } = useAIStore.getState()
    addMessage({ id: 'u1', role: 'user', content: 'question' })
    addMessage({ id: 'a1', role: 'assistant', content: '', isStreaming: true })
    updateLastAssistantMessage({ content: 'answer', isStreaming: false })
    const msgs = useAIStore.getState().conversation.messages
    expect(msgs[1].content).toBe('answer')
    expect(msgs[1].isStreaming).toBe(false)
    expect(msgs[0].content).toBe('question') // user message unchanged
  })

  it('updateLastAssistantMessage does not throw when no assistant message exists', () => {
    expect(() =>
      useAIStore.getState().updateLastAssistantMessage({ content: 'orphan' })
    ).not.toThrow()
  })

  it('setStreaming toggles the isStreaming flag', () => {
    useAIStore.getState().setStreaming(true)
    expect(useAIStore.getState().isStreaming).toBe(true)
    useAIStore.getState().setStreaming(false)
    expect(useAIStore.getState().isStreaming).toBe(false)
  })

  it('reset clears messages and streaming state', () => {
    const store = useAIStore.getState()
    store.addMessage({ id: 'u1', role: 'user', content: 'hi' })
    store.setStreaming(true)
    store.reset()
    expect(useAIStore.getState().conversation.messages).toHaveLength(0)
    expect(useAIStore.getState().isStreaming).toBe(false)
  })

  it('processingSteps patch is preserved on the last assistant message', () => {
    const { addMessage, updateLastAssistantMessage } = useAIStore.getState()
    addMessage({ id: 'a1', role: 'assistant', content: '', isStreaming: true, messageType: 'ev_demo' })
    const steps = [{ label: 'Parsing', value: 'EV query', status: 'done' as const }]
    updateLastAssistantMessage({ processingSteps: steps })
    const msg = useAIStore.getState().conversation.messages[0]
    expect(msg.processingSteps).toHaveLength(1)
    expect(msg.processingSteps![0].status).toBe('done')
  })

  it('benchmarkPanel and widgetCluster patches are preserved', () => {
    const { addMessage, updateLastAssistantMessage } = useAIStore.getState()
    addMessage({ id: 'a1', role: 'assistant', content: '', isStreaming: true })
    updateLastAssistantMessage({
      benchmarkPanel: { segments: [], nudge: 'test nudge' },
      widgetCluster: [],
    })
    const msg = useAIStore.getState().conversation.messages[0]
    expect(msg.benchmarkPanel?.nudge).toBe('test nudge')
    expect(msg.widgetCluster).toEqual([])
  })
})

// ─── Audience Store ───────────────────────────────────────────────────────────

describe('audienceStore', () => {
  const makeAudience = (id: string): Audience => ({
    id,
    name: `Audience ${id}`,
    filters: { id: 'fg', operator: 'AND', conditions: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isShared: false,
  })

  it('add creates a new audience', () => {
    const before = useAudienceStore.getState().audiences.length
    useAudienceStore.getState().add(makeAudience(`add-${Date.now()}`))
    expect(useAudienceStore.getState().audiences).toHaveLength(before + 1)
  })

  it('remove deletes by id', () => {
    const id = `rm-${Date.now()}`
    useAudienceStore.getState().add(makeAudience(id))
    const before = useAudienceStore.getState().audiences.length
    useAudienceStore.getState().remove(id)
    expect(useAudienceStore.getState().audiences).toHaveLength(before - 1)
    expect(useAudienceStore.getState().audiences.find(a => a.id === id)).toBeUndefined()
  })

  it('remove on unknown id does not throw', () => {
    expect(() => useAudienceStore.getState().remove('does-not-exist')).not.toThrow()
  })

  it('update patches fields without replacing the whole object', () => {
    const id = `upd-${Date.now()}`
    useAudienceStore.getState().add(makeAudience(id))
    useAudienceStore.getState().update(id, { name: 'Updated Name' })
    const found = useAudienceStore.getState().audiences.find(a => a.id === id)
    expect(found?.name).toBe('Updated Name')
    expect(found?.filters).toBeDefined()
  })
})

// ─── Dashboard Store ──────────────────────────────────────────────────────────

describe('dashboardStore', () => {
  const makeDashboard = (id: string): Dashboard => ({
    id,
    name: `Dashboard ${id}`,
    widgets: [],
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  it('add creates a dashboard', () => {
    const before = useDashboardStore.getState().dashboards.length
    useDashboardStore.getState().add(makeDashboard(`dash-${Date.now()}`))
    expect(useDashboardStore.getState().dashboards).toHaveLength(before + 1)
  })

  it('remove deletes by id', () => {
    const id = `dash-rm-${Date.now()}`
    useDashboardStore.getState().add(makeDashboard(id))
    const before = useDashboardStore.getState().dashboards.length
    useDashboardStore.getState().remove(id)
    expect(useDashboardStore.getState().dashboards).toHaveLength(before - 1)
  })

  it('toggleShare flips the isShared flag', () => {
    const id = `dash-share-${Date.now()}`
    useDashboardStore.getState().add(makeDashboard(id))
    useDashboardStore.getState().toggleShare(id)
    expect(useDashboardStore.getState().dashboards.find(d => d.id === id)?.isShared).toBe(true)
    useDashboardStore.getState().toggleShare(id)
    expect(useDashboardStore.getState().dashboards.find(d => d.id === id)?.isShared).toBe(false)
  })

  it('updateLayout replaces the widget list', () => {
    const id = `dash-layout-${Date.now()}`
    useDashboardStore.getState().add(makeDashboard(id))
    const widgets = [{ widgetId: 'w1', position: { x: 0, y: 0, w: 2, h: 2 } }]
    useDashboardStore.getState().updateLayout(id, widgets)
    const dash = useDashboardStore.getState().dashboards.find(d => d.id === id)
    expect(dash?.widgets).toHaveLength(1)
    expect(dash?.widgets[0].widgetId).toBe('w1')
  })
})
