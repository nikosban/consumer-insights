import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-3/4" />
        <div className="pt-2">
          <Skeleton className="h-8 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
