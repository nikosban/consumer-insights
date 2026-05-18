import { useNavigate } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/EmptyState'
import { Plus, Pencil, Copy, Trash2 } from 'lucide-react'
import { IconWrapper, ICON_SIZES } from '@/components/ui/IconWrapper'
import { cn } from '@/lib/utils'
import type { Audience } from '@/types'

function SecondaryIconButton({
  icon, label, onClick, destructive = false,
}: {
  icon: React.ReactNode; label: string; onClick: (e: React.MouseEvent) => void; destructive?: boolean
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background transition-colors',
        destructive
          ? 'text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-destructive'
          : 'text-gray-400 hover:bg-accent hover:text-gray-900'
      )}
    >
      <IconWrapper size="support">{icon}</IconWrapper>
    </button>
  )
}

function AudienceRow({ audience }: { audience: Audience }) {
  const navigate = useNavigate()
  const { remove, duplicate } = useAudienceStore()

  return (
    <div
      className="group flex items-center gap-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer -mx-3 px-3"
      onClick={() => navigate(`/audiences/${audience.id}/edit`)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">{audience.name}</span>
          {audience.region && (
            <Badge variant="secondary" className="text-xs font-normal">{audience.region}</Badge>
          )}
          {audience.isShared && (
            <Badge className="text-xs font-normal bg-primary/10 text-primary border-0 hover:bg-primary/20">Shared</Badge>
          )}
        </div>
        {audience.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{audience.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <SecondaryIconButton
          icon={<Pencil size={ICON_SIZES.support} />}
          label="Rename"
          onClick={e => { e.stopPropagation(); navigate(`/audiences/${audience.id}/edit`) }}
        />
        <SecondaryIconButton
          icon={<Copy size={ICON_SIZES.support} />}
          label="Duplicate"
          onClick={e => { e.stopPropagation(); duplicate(audience.id) }}
        />
        <SecondaryIconButton
          icon={<Trash2 size={ICON_SIZES.support} />}
          label="Delete"
          destructive
          onClick={e => { e.stopPropagation(); remove(audience.id) }}
        />
      </div>
    </div>
  )
}

export default function AudiencesPage() {
  const navigate = useNavigate()
  const { audiences } = useAudienceStore()

  return (
    <div className="px-6 py-10 max-w-[720px] mx-auto">
      <div className="mb-8">
        <h1 className="text-[24px] leading-[36px] font-bold text-gray-900">Audiences</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Define and manage audience segments</p>
      </div>

      {audiences.length === 0 ? (
        <EmptyState
          title="No audiences yet"
          description="Create your first audience segment to start analysing your consumers."
          ctaLabel="Create an audience"
          onCta={() => navigate('/audiences/new')}
        />
      ) : (
        <>
          <div className="flex flex-col">
            {audiences.map((audience) => (
              <AudienceRow key={audience.id} audience={audience} />
            ))}
          </div>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate('/audiences/new')}>
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New Audience
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
