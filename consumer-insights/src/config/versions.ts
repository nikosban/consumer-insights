export interface AppVersion {
  id: string
  label: string
  description: string
  path: string
}

export const VERSIONS: AppVersion[] = [
  { id: 'v0', label: 'V0', description: 'Current Consumer Insights', path: '/consumer_insights_v0' },
  { id: 'v1', label: 'V1', description: 'First application, connect to Research AI, uplift current major issues (Statistical and analytical flows), a more focused user interface', path: '/consumer_insights_v1' },
  { id: 'v2', label: 'V2', description: 'Second iteration, expanding feature set and enchancing the user flow', path: '/consumer_insights_v2' },
  { id: 'v3', label: 'V3', description: 'North Star, Integrated AI, Dashboards, Analysis and Export, Dedicated Target Group Builder', path: '/charts' },
]

export function getActiveVersion(pathname: string): string {
  const match = VERSIONS.find(v => pathname.startsWith(v.path))
  return match?.id ?? 'v3'
}
