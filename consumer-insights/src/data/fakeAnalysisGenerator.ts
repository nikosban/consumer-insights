import type { AnalysisSection } from '@/types'

export function generateSections(
  dashboardName: string,
  widgetTitles: string[],
  template: 'summary' | 'full'
): AnalysisSection[] {
  const listed = widgetTitles.length > 0
    ? widgetTitles.slice(0, 3).join(', ')
    : 'multiple consumer metrics'
  const count = widgetTitles.length

  const exec: AnalysisSection = {
    id: 'sec-exec',
    heading: 'Executive Summary',
    content: `The ${dashboardName} dashboard consolidates ${count} data point${count !== 1 ? 's' : ''} spanning ${listed}. Overall, the data reveals consistent patterns across the primary audience, with notable variation in intent and awareness metrics compared to the benchmark group. Key signals point to an opportunity to strengthen brand positioning in high-intent segments while sustaining current awareness momentum.`,
  }

  const findings: AnalysisSection = {
    id: 'sec-findings',
    heading: 'Key Findings',
    content: `• Purchase intent is highest in the 25–34 cohort, outperforming the benchmark audience by an estimated 12 percentage points.\n• Brand awareness has trended upward across the tracked period, with a notable acceleration in the most recent wave.\n• Mobile accounts for approximately 64% of device usage, reinforcing the need for mobile-first creative strategies.\n• Ad recall scores are at or above category average across all measured segments.\n• Net Promoter Score sits at 42, indicating moderate but consistent advocacy behaviour within the category.`,
  }

  const recs: AnalysisSection = {
    id: 'sec-recs',
    heading: 'Recommendations',
    content: `• Prioritise mobile-optimised ad formats to align with the dominant device usage pattern.\n• Continue investing in upper-funnel brand-building to sustain the positive awareness trajectory.\n• Target the 25–34 cohort with conversion-focused messaging, where purchase intent is strongest.\n• Benchmark against the high-income segment quarterly to monitor intent divergence.\n• Commission a follow-up wave in the next quarter to assess whether current gains are sustained.`,
  }

  if (template === 'summary') return [exec, findings, recs]

  const profile: AnalysisSection = {
    id: 'sec-profile',
    heading: 'Audience Profile',
    content: `The primary audience skews toward younger, digitally active consumers (25–40). This segment is characterised by above-average online purchase frequency and a strong preference for convenience-driven retail formats. The benchmark audience of higher-income consumers provides a contrasting signal, where brand affinity and consideration metrics diverge most significantly. Both segments over-index on mobile usage relative to the general population.`,
  }

  const deepdive: AnalysisSection = {
    id: 'sec-deepdive',
    heading: 'Category Deep-Dive',
    content: `Within the category, brand affinity scores diverge most sharply around price sensitivity and sustainability preferences. Respondents purchasing sustainable products at least twice a month show approximately 18% higher brand affinity than the category average. The Net Promoter Score of 42 (SD: 8.3) suggests moderate but consistent advocacy behaviour. Device-level segmentation reveals desktop users show higher average order values while mobile users demonstrate higher browsing frequency — consistent with broader industry benchmarks.`,
  }

  return [exec, profile, findings, deepdive, recs]
}
