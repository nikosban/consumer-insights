export interface AppVersion {
  id: string
  label: string
  description: string
  path: string
  hidden?: boolean
  variant?: string
}

export const VERSIONS: AppVersion[] = [
  { id: 'v0', label: 'V0', description: 'Current Consumer Insights', path: '/consumer_insights_v0' },
  { id: 'v1', label: 'V1', description: 'First application, connect to Research AI, uplift current major issues (Statistical and analytical flows), a more focused user interface', path: '/consumer_insights_v1' },
  { id: 'v2', label: 'V2', description: 'Second iteration, expanding feature set and enchancing the user flow', path: '/consumer_insights_v2' },
  { id: 'v3.1', label: 'Consumer Insights Demo — 3.1', description: 'Core flows: Chat, Audience, Charts', path: '/research-ai', variant: '3.1' },
  { id: 'v3.2', label: 'Consumer Insights Demo — 3.2', description: 'Full feature set: adds Dashboards and Analysis', path: '/research-ai', variant: '3.2' },
]

export const V3_VARIANT_KEY = 'ci_v3_variant'

export function getActiveVersion(pathname: string): string {
  if (!pathname.startsWith('/consumer_insights_')) return localStorage.getItem(V3_VARIANT_KEY) === '3.1' ? 'v3.1' : 'v3.2'
  const match = VERSIONS.find(v => v.path !== '/research-ai' && pathname.startsWith(v.path))
  return match?.id ?? 'v3.2'
}
