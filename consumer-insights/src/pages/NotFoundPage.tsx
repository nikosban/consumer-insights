import { useNavigate } from 'react-router-dom'
import EmptyState from '@/components/EmptyState'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        ctaLabel="Go to home"
        onCta={() => navigate('/')}
      />
    </div>
  )
}
