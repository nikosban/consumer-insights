export interface AppVersion {
  id: string
  label: string
  description: string
  path: string
  hidden?: boolean
}

export const VERSIONS: AppVersion[] = [
  { id: 'v0', label: 'V0', description: 'Current Consumer Insights', path: '/consumer_insights_v0' },
  { id: 'v1', label: 'V1', description: 'First application, connect to Research AI, uplift current major issues (Statistical and analytical flows), a more focused user interface', path: '/consumer_insights_v1' },
  { id: 'v2', label: 'V2', description: 'Second iteration, expanding feature set and enchancing the user flow', path: '/consumer_insights_v2' },
  { id: 'v3', label: 'Consumer Insights V3', description: 'Full feature set: Chat, Audience Builder, Charts, Dashboards, Analysis', path: '/research-ai' },
]

export function getActiveVersion(pathname: string): string {
  if (!pathname.startsWith('/consumer_insights_')) return 'v3'
  const match = VERSIONS.find(v => v.path !== '/research-ai' && pathname.startsWith(v.path))
  return match?.id ?? 'v3'
}
