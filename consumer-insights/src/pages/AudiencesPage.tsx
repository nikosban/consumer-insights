import { useNavigate } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/EmptyState'
import { Plus, Pencil, Copy, Trash2 } from 'lucide-react'
import { ResourceCard, IconBtn, PageShell } from '@/components/app'

export default function AudiencesPage() {
  const navigate = useNavigate()
  const { audiences, remove, duplicate } = useAudienceStore()

  return (
    <PageShell>
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
          <div className="flex flex-col gap-2">
            {audiences.map((audience) => (
              <ResourceCard
                key={audience.id}
                title={audience.name}
                meta={[audience.region, audience.isShared ? 'Shared' : null, audience.description].filter(Boolean).join(' · ') || undefined}
                date={undefined}
                actions={
                  <>
                    <IconBtn icon={<Pencil size={12} />} label="Edit" onClick={() => navigate(`/audiences/${audience.id}/edit`)} />
                    <IconBtn icon={<Copy size={12} />} label="Duplicate" onClick={() => duplicate(audience.id)} />
                    <IconBtn icon={<Trash2 size={12} />} label="Delete" destructive onClick={() => remove(audience.id)} />
                  </>
                }
                onClick={() => navigate(`/audiences/${audience.id}/edit`)}
              />
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
    </PageShell>
  )
}
