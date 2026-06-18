import { useState, useCallback, useRef } from 'react'
import { DEMO_SCRIPT } from './demoScript'
import type { DemoStep } from './demoScript'
import { V3_VARIANT_KEY } from '@/config/versions'

export type DemoState = 'idle' | 'playing' | 'paused'

export interface DemoModeHandle {
  state: DemoState
  stepIndex: number
  currentStep: DemoStep | null
  totalSteps: number
  start: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  next: () => void
  prev: () => void
}

const HOLD_MS = 4500          // default time bubbles stay before auto-advancing
const POST_ACTION_MS = 1400   // wait after clicking an action (lets the UI settle)

export function useDemoMode(navigate: (path: string) => void): DemoModeHandle {
  const [state, setState] = useState<DemoState>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const stateRef = useRef<DemoState>('idle')
  const indexRef = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const advanceRef = useRef<() => void>(() => {})

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  const later = (fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timers.current.push(t)
  }

  // Apply a step's side effects: variant change + navigation.
  const applyStep = useCallback((step: DemoStep) => {
    if (step.variant) {
      localStorage.setItem(V3_VARIANT_KEY, step.variant)
      window.dispatchEvent(new Event('ci-variant-change'))
    }
    if (step.path && step.path !== window.location.pathname) {
      navigate(step.path)
    }
  }, [navigate])

  const goToStep = useCallback((idx: number) => {
    clearTimers()
    const clamped = Math.max(0, Math.min(idx, DEMO_SCRIPT.length - 1))
    indexRef.current = clamped
    setStepIndex(clamped)

    const step = DEMO_SCRIPT[clamped]
    applyStep(step)

    const isLast = clamped === DEMO_SCRIPT.length - 1
    if (!isLast && stateRef.current === 'playing') {
      later(() => advanceRef.current(), step.holdMs ?? HOLD_MS)
    }
  }, [applyStep])

  // Advance: fire the current step's action (if any), then move to the next step.
  const advance = useCallback(() => {
    clearTimers()
    if (stateRef.current === 'idle') return
    const step = DEMO_SCRIPT[indexRef.current]
    const goNext = () => goToStep(indexRef.current + 1)
    if (step?.action) {
      // Prefer the first visible match (the shell renders a hidden mobile dupe).
      const candidates = [...document.querySelectorAll(step.action)] as HTMLElement[]
      const el = candidates.find(c => c.getBoundingClientRect().width > 0) ?? candidates[0]
      el?.click()
      later(goNext, step.actionDelay ?? POST_ACTION_MS)
    } else {
      goNext()
    }
  }, [goToStep])
  advanceRef.current = advance

  const start = useCallback(() => {
    stateRef.current = 'playing'
    setState('playing')
    goToStep(0)
  }, [goToStep])

  const stop = useCallback(() => {
    clearTimers()
    stateRef.current = 'idle'
    setState('idle')
    setStepIndex(0)
    indexRef.current = 0
  }, [])

  const pause = useCallback(() => {
    clearTimers()
    stateRef.current = 'paused'
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    stateRef.current = 'playing'
    setState('playing')
    const isLast = indexRef.current === DEMO_SCRIPT.length - 1
    if (!isLast) {
      const step = DEMO_SCRIPT[indexRef.current]
      later(() => advanceRef.current(), step.holdMs ?? HOLD_MS)
    }
  }, [])

  const next = useCallback(() => {
    advanceRef.current()
  }, [])

  const prev = useCallback(() => {
    goToStep(indexRef.current - 1)
  }, [goToStep])

  const currentStep = state !== 'idle' ? DEMO_SCRIPT[stepIndex] : null

  return { state, stepIndex, currentStep, totalSteps: DEMO_SCRIPT.length, start, stop, pause, resume, next, prev }
}
