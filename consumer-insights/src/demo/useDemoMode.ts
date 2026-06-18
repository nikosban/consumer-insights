import { useState, useCallback, useRef } from 'react'
import { DEMO_SCRIPT } from './demoScript'
import type { DemoStep } from './demoScript'

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

const BUBBLE_HOLD_MS = 3500  // how long bubbles stay visible before auto-next (if autoContinue)

export function useDemoMode(navigate: (path: string) => void): DemoModeHandle {
  const [state, setState] = useState<DemoState>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stateRef = useRef<DemoState>('idle')
  const indexRef = useRef(0)

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  const goToStep = useCallback((idx: number) => {
    clearTimer()
    const clamped = Math.max(0, Math.min(idx, DEMO_SCRIPT.length - 1))
    indexRef.current = clamped
    setStepIndex(clamped)

    const step = DEMO_SCRIPT[clamped]
    if (step.path) navigate(step.path)

    // if autoContinue, advance after hold duration
    if (step.autoContinue && stateRef.current === 'playing') {
      timerRef.current = setTimeout(() => {
        if (stateRef.current === 'playing') goToStep(indexRef.current + 1)
      }, BUBBLE_HOLD_MS)
    }

    // if step has an action and autoContinue, fire action then advance
    if (step.action && step.autoContinue && stateRef.current === 'playing') {
      timerRef.current = setTimeout(() => {
        const el = document.querySelector(step.action!) as HTMLElement | null
        el?.click()
        timerRef.current = setTimeout(() => {
          if (stateRef.current === 'playing') goToStep(indexRef.current + 1)
        }, 1000)
      }, step.actionDelay ?? 1200)
    }
  }, [navigate])

  const start = useCallback(() => {
    stateRef.current = 'playing'
    setState('playing')
    goToStep(0)
  }, [goToStep])

  const stop = useCallback(() => {
    clearTimer()
    stateRef.current = 'idle'
    setState('idle')
    setStepIndex(0)
    indexRef.current = 0
  }, [])

  const pause = useCallback(() => {
    clearTimer()
    stateRef.current = 'paused'
    setState('paused')
  }, [])

  const resume = useCallback(() => {
    stateRef.current = 'playing'
    setState('playing')
    const step = DEMO_SCRIPT[indexRef.current]
    if (step?.autoContinue) {
      timerRef.current = setTimeout(() => {
        if (stateRef.current === 'playing') goToStep(indexRef.current + 1)
      }, BUBBLE_HOLD_MS)
    }
  }, [goToStep])

  const next = useCallback(() => {
    if (indexRef.current >= DEMO_SCRIPT.length - 1) return
    // fire the current step's action before advancing (if present)
    const step = DEMO_SCRIPT[indexRef.current]
    if (step?.action) {
      const el = document.querySelector(step.action) as HTMLElement | null
      el?.click()
      setTimeout(() => goToStep(indexRef.current + 1), step.actionDelay ?? 600)
    } else {
      goToStep(indexRef.current + 1)
    }
  }, [goToStep])

  const prev = useCallback(() => {
    goToStep(indexRef.current - 1)
  }, [goToStep])

  const currentStep = state !== 'idle' ? DEMO_SCRIPT[stepIndex] : null

  return { state, stepIndex, currentStep, totalSteps: DEMO_SCRIPT.length, start, stop, pause, resume, next, prev }
}
