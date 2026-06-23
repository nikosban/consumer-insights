import { memo } from 'react'
import { IconSparkles, IconMessagePlus } from '@tabler/icons-react'

export const FollowUpChips = memo(function FollowUpChips({ suggestions, onSend }: { suggestions: string[]; onSend: (q: string) => void }) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-1.5 mb-2.5">
        <IconSparkles size={12} strokeWidth={2} className="text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground">Query suggestions</span>
      </div>
      <div className="flex flex-col gap-2">
        {suggestions.map(q => (
          <button
            key={q}
            onClick={() => onSend(q)}
            className="flex items-center gap-1.5 text-xs text-primary bg-transparent rounded-lg px-3 py-1.5 hover:bg-primary/8 active:bg-primary/12 transition-colors text-left w-full"
          >
            <IconMessagePlus size={11} className="shrink-0 text-primary/70" strokeWidth={2} />
            {q}
          </button>
        ))}
      </div>
    </div>
  )
})
