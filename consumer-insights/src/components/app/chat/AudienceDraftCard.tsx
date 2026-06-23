import { memo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { IconEdit, IconCheck, IconUsers, IconArrowUpRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toaster'
import type { AudienceDraftData, Audience } from '@/types'

export const AudienceDraftCard = memo(function AudienceDraftCard({ draft }: { draft: AudienceDraftData }) {
  const navigate = useNavigate()
  const { add: addAudience } = useAudienceStore()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (saved) return
    const aud: Audience = {
      id: `aud-${Date.now()}`,
      name: draft.name,
      filters: draft.prefill.filters ?? { id: 'fg-empty', operator: 'AND', conditions: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isShared: false,
    }
    addAudience(aud)
    setSaved(true)
    toast.success('Audience saved to library')
  }

  function handleOpenBuilder() {
    navigate('/audiences/new', { state: { prefill: draft.prefill } })
  }

  return (
    <div className="mt-3 max-w-[480px] w-full rounded-2xl rounded-bl-sm border border-primary/30 bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-primary/4">
        <span className="text-xs font-semibold text-primary">Audience draft</span>
        <button
          onClick={handleOpenBuilder}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
        >
          <IconEdit size={10} strokeWidth={2} />
          Edit
        </button>
      </div>

      <div className="px-4 pt-3 pb-2">
        <h3 className="text-sm font-semibold text-foreground">{draft.name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          ← Inherited from: <span className="font-medium text-foreground">{draft.inheritedFrom}</span>
        </p>
      </div>

      <div className="px-4 pb-3">
        <div className="space-y-1.5">
          {draft.filters.map(f => (
            <div key={f.label} className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] text-secondary-foreground shrink-0">{f.label}</span>
              <span className="text-xs font-medium text-foreground text-right">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border flex items-center gap-2">
        <button
          onClick={handleOpenBuilder}
          className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-accent transition-colors"
        >
          Open in Audience Builder
          <IconArrowUpRight size={10} strokeWidth={2} />
        </button>
        <button
          onClick={handleSave}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-xs font-medium transition-colors',
            saved
              ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]'
          )}
        >
          {saved ? <IconCheck size={11} strokeWidth={2} /> : <IconUsers size={11} strokeWidth={2} />}
          {saved ? 'Saved' : 'Save to My Audiences'}
        </button>
      </div>
    </div>
  )
})
