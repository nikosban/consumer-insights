export interface AppVersion {
  id: string
  label: string
  description: string
  path: string
}

export const VERSIONS: AppVersion[] = [
  { id: 'v0', label: 'V0', description: 'Legacy baseline',  path: '/consumer_insights_v0' },
  { id: 'v1', label: 'V1', description: 'Stable',           path: '/consumer_insights_v1' },
  { id: 'v2', label: 'V2', description: 'Current',          path: '/consumer_insights_v2' },
  { id: 'v3', label: 'V3', description: 'Feature preview',  path: '/charts' },
]

export function getActiveVersion(pathname: string): string {
  const match = VERSIONS.find(v => pathname.startsWith(v.path))
  return match?.id ?? 'v3'
}
