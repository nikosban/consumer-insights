import { useNavigate } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/EmptyState'
import { Plus, Users, Pencil, Copy, Trash2, Share2 } from 'lucide-react'
import { ResourceCard, IconBtn, PageShell } from '@/components/app'
import { toast } from '@/components/ui/Toaster'

export default function AudiencesPage() {
  const navigate = useNavigate()
  const { audiences, remove, duplicate, update } = useAudienceStore()

  return (
    <PageShell className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Audiences</h1>
          <p className="text-sm text-muted-foreground">Define and manage audience segments</p>
        </div>
        <Button onClick={() => navigate('/audiences/new')}>
          <Plus className="h-4 w-4 mr-1" />
          New Audience
        </Button>
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
                icon={<Users className="h-4 w-4" />}
                title={audience.name}
                meta={[audience.region, audience.isShared ? 'Shared' : null, audience.description].filter(Boolean).join(' · ') || undefined}
                date={undefined}
                actions={
                  <>
                    <IconBtn icon={<Pencil size={12} />} label="Edit" onClick={() => navigate(`/audiences/${audience.id}/edit`)} />
                    <IconBtn icon={<Copy size={12} />} label="Duplicate" onClick={() => { duplicate(audience.id); toast.success('Audience duplicated') }} />
                    <IconBtn
                      icon={<Share2 size={12} />}
                      label={audience.isShared ? 'Unshare' : 'Share'}
                      onClick={() => {
                        update(audience.id, { isShared: !audience.isShared })
                        toast.success(audience.isShared ? 'Audience set to private' : 'Audience shared with team')
                      }}
                    />
                    <IconBtn icon={<Trash2 size={12} />} label="Delete" destructive onClick={() => { remove(audience.id); toast.success('Audience deleted') }} />
                  </>
                }
                onClick={() => navigate(`/audiences/${audience.id}/edit`)}
              />
            ))}
          </div>
        </>
      )}
    </PageShell>
  )
}
