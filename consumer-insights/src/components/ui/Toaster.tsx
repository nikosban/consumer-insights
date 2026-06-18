import { create } from 'zustand'
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type ToastKind = 'success' | 'error' | 'info'

type ToastAction = { label: string; onClick: () => void }

type ToastItem = {
  id: number
  kind: ToastKind
  message: string
  action?: ToastAction
}

type ToastStore = {
  toasts: ToastItem[]
  push: (kind: ToastKind, message: string, action?: ToastAction) => void
  dismiss: (id: number) => void
}

let nextId = 1

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (kind, message, action) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, kind, message, action }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 5000)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Imperative API — call from anywhere: toast.success('Saved') */
export const toast = {
  success: (message: string, action?: ToastAction) => useToastStore.getState().push('success', message, action),
  error:   (message: string, action?: ToastAction) => useToastStore.getState().push('error', message, action),
  info:    (message: string, action?: ToastAction) => useToastStore.getState().push('info', message, action),
}

const KIND_STYLES: Record<ToastKind, { icon: React.ReactNode; cls: string }> = {
  success: { icon: <IconCheck size={13} strokeWidth={2} />, cls: 'text-green-600' },
  error:   { icon: <IconX size={13} strokeWidth={2} />,     cls: 'text-destructive' },
  info:    { icon: <IconInfoCircle size={13} strokeWidth={2} />,  cls: 'text-primary' },
}

export function Toaster() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2 rounded-lg border border-border bg-white shadow-lg pl-3 pr-2 py-2 text-xs text-foreground animate-in fade-in slide-in-from-bottom-2"
        >
          <span className={cn('shrink-0', KIND_STYLES[t.kind].cls)}>{KIND_STYLES[t.kind].icon}</span>
          <span>{t.message}</span>
          {t.action && (
            <button
              onClick={() => { t.action!.onClick(); dismiss(t.id) }}
              className="shrink-0 ml-1 text-primary font-medium hover:underline whitespace-nowrap"
            >
              {t.action.label}
            </button>
          )}
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 ml-1 p-0.5 rounded text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <IconX size={11} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  )
}
