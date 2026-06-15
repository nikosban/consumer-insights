import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/store/dashboardStore'
import { Link2, Check, Globe, Lock } from 'lucide-react'
import { toast } from '@/components/ui/Toaster'

type ShareModalProps = {
  dashboardId: string
  open: boolean
  onClose: () => void
}

export default function ShareModal({ dashboardId, open, onClose }: ShareModalProps) {
  const { dashboards, toggleShare } = useDashboardStore()
  const dashboard = dashboards.find((d) => d.id === dashboardId)
  const isShared = dashboard?.isShared ?? false
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState('')
  const [invited, setInvited] = useState<string[]>([])

  const shareUrl = `https://insights.statista.com/dashboards/${dashboardId}/view`

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl)
      .then(() => toast.success('Link copied'))
      .catch(() => toast.error('Copy failed'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleInvite() {
    const trimmed = email.trim()
    if (!trimmed || invited.includes(trimmed)) return
    setInvited(prev => [...prev, trimmed])
    setEmail('')
    toast.success(`Invite sent to ${trimmed}`)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{dashboard?.name}"</DialogTitle>
          <DialogDescription>Share this dashboard with teammates or via a link.</DialogDescription>
        </DialogHeader>

        {/* Public toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border p-3 mt-1">
          <div className="flex items-center gap-2.5">
            {isShared ? <Globe className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium">{isShared ? 'Public link' : 'Private'}</p>
              <p className="text-xs text-secondary-foreground">
                {isShared ? 'Anyone with the link can view' : 'Only invited people can access'}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleShare(dashboardId)}
            className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
            style={{ backgroundColor: isShared ? 'oklch(0.47 0.243 264)' : 'oklch(0.784 0.018 220)' }}
          >
            <span
              className="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
              style={{ transform: isShared ? 'translateX(16px)' : 'translateX(0)' }}
            />
          </button>
        </div>

        {/* Copy link */}
        {isShared && (
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground truncate font-mono">
              {shareUrl}
            </div>
            <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0 gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Link2 className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}

        {/* Invite by email */}
        <div>
          <p className="text-sm font-medium mb-2">Invite teammates</p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleInvite() }}
              placeholder="colleague@statista.com"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="sm" onClick={handleInvite} disabled={!email.trim()}>Invite</Button>
          </div>

          {invited.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {invited.map(addr => (
                <div key={addr} className="flex items-center gap-2 text-xs text-secondary-foreground">
                  <Check className="h-3 w-3 text-green-600" />
                  {addr}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
