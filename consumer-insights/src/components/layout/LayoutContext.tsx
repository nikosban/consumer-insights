import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

interface LayoutContextValue {
  leftPanel: ReactNode | null
  setLeftPanel: (node: ReactNode | null) => void
  rightSidebar: ReactNode | null
  setRightSidebar: (node: ReactNode | null) => void
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [leftPanel, setLeftPanelState] = useState<ReactNode | null>(null)
  const [rightSidebar, setRightSidebarState] = useState<ReactNode | null>(null)

  const setLeftPanel = useCallback((node: ReactNode | null) => setLeftPanelState(node), [])
  const setRightSidebar = useCallback((node: ReactNode | null) => setRightSidebarState(node), [])

  return (
    <LayoutContext.Provider value={{ leftPanel, setLeftPanel, rightSidebar, setRightSidebar }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout must be used inside LayoutProvider')
  return ctx
}
