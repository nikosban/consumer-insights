import { useNavigate } from 'react-router-dom'
import { useAudienceStore } from '@/store/audienceStore'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/EmptyState'
import { IconPlus, IconUsers, IconPencil, IconCopy, IconTrash, IconShare } from '@tabler/icons-react'
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
          <IconPlus className="h-4 w-4 mr-1" strokeWidth={2} />
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
                icon={<IconUsers className="h-4 w-4" strokeWidth={2} />}
                title={audience.name}
                meta={[audience.region, audience.isShared ? 'Shared' : null, audience.description].filter(Boolean).join(' · ') || undefined}
                date={undefined}
                actions={
                  <>
                    <IconBtn icon={<IconPencil size={12} strokeWidth={2} />} label="Edit" onClick={() => navigate(`/audiences/${audience.id}/edit`)} />
                    <IconBtn icon={<IconCopy size={12} strokeWidth={2} />} label="Duplicate" onClick={() => { duplicate(audience.id); toast.success('Audience duplicated') }} />
                    <IconBtn
                      icon={<IconShare size={12} strokeWidth={2} />}
                      label={audience.isShared ? 'Unshare' : 'Share'}
                      onClick={() => {
                        update(audience.id, { isShared: !audience.isShared })
                        toast.success(audience.isShared ? 'Audience set to private' : 'Audience shared with team')
                      }}
                    />
                    <IconBtn icon={<IconTrash size={12} strokeWidth={2} />} label="Delete" destructive onClick={() => { remove(audience.id); toast.success('Audience deleted') }} />
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
