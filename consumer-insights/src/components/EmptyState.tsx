import { Button } from '@/components/ui/button'

type EmptyStateProps = {
  title: string
  description: string
  ctaLabel?: string
  onCta?: () => void
}

export default function EmptyState({ title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <svg
        viewBox="0 0 200 160"
        className="w-48 h-36 mb-6 text-muted-foreground"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="20" y="100" width="160" height="8" rx="4" fill="currentColor" opacity="0.15" />
        <rect x="40" y="60" width="16" height="44" rx="3" fill="currentColor" opacity="0.3" />
        <rect x="70" y="40" width="16" height="64" rx="3" fill="currentColor" opacity="0.5" />
        <rect x="100" y="50" width="16" height="54" rx="3" fill="currentColor" opacity="0.4" />
        <rect x="130" y="30" width="16" height="74" rx="3" fill="currentColor" opacity="0.6" />
        <circle cx="100" cy="22" r="14" fill="currentColor" opacity="0.2" />
        <circle cx="100" cy="22" r="6" fill="currentColor" opacity="0.4" />
        <line x1="100" y1="36" x2="100" y2="46" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      </svg>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-xs">{description}</p>
      {ctaLabel && onCta && (
        <Button onClick={onCta}>{ctaLabel}</Button>
      )}
    </div>
  )
}
