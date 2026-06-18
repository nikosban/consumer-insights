/* ── Shared data for the Research AI page ── */

const tgItem = (item) => ({
  catId: 'characteristics', catLabel: 'Characteristics & demographics',
  subcatId: 'demographics', subcatLabel: 'Demographics', item,
})
const tgGroup = (item) => ({
  catId: 'characteristics', catLabel: 'Characteristics & demographics',
  intraOp: 'OR', interOp: 'AND', items: [tgItem(item)],
})
const targetGroup = (label, ...items) => ({
  name: label,
  selections: items.map(tgItem),
  selectionGroups: items.map(tgGroup),
})

export const SOURCES = [
  {
    type: 'stats', label: 'Premium Statistic',
    title: 'Console gaming market worldwide 2022-2032',
    desc: 'In 2023, the global console gaming market generated approximately 104.69 billion U.S. dollars worth of revenue, ranking second behind the mobile gaming segment. In 2028, annual console gaming revenue is projected to increase to 187.65 billion U.S. dollars.',
    pills: ['Worldwide', '2022-2032'], lastUpdate: 'Jan 14, 2025', released: 'Mar 2024', surveyPeriod: '2022–2032', attribution: 'Statista | Newzoo, IDC',
    deepLink: { country: 'us', year: '2024', rows: ['Survey year'], cols: ['Console gaming frequency'], displayOptions: { percent: true } },
  },
  {
    type: 'stats', label: 'Premium Statistic',
    title: 'Console gaming consumer market value worldwide 2018-2028',
    desc: 'In 2023, the global console gaming market was worth 40.3 billion U.S. dollars and is projected to reach 47 billion U.S. dollars in 2028. Console gaming growth is significantly impacted by the limited availability of current-gen gaming hardware.',
    pills: ['Worldwide', '2018-2023'], lastUpdate: 'Nov 8, 2024', released: 'Jan 2024', surveyPeriod: '2018–2028', attribution: 'Statista | Ampere Analysis',
    deepLink: { country: 'gb', year: '2024', rows: ['Age group'], cols: ['Digital game purchase behavior'], displayOptions: { percent: true }, targetGroup: targetGroup('Female, Age 18-34', 'Female', 'Age 18-34') },
  },
  {
    type: 'report', label: 'Premium Report',
    title: 'Gaming subscription services – Industry report 2024',
    desc: 'This report covers the global gaming subscription market, including platform breakdown, revenue share by service tier, and regional adoption trends across Europe, North America, and Asia-Pacific.',
    pills: ['Worldwide'], lastUpdate: 'Dec 3, 2024', released: '2024', pages: 47, format: 'PPTX, PDF', language: 'English', attribution: 'Statista',
    deepLink: { country: 'de', year: '2024', rows: ['Survey year'], cols: ['Gaming subscription service usage'], displayOptions: { percent: true } },
  },
  {
    type: 'market', label: 'Market Insights',
    title: 'Game Consoles - Worldwide | Consumer',
    desc: 'The Game Consoles market worldwide is projected to generate a revenue of US$25.27bn in 2026. In relation to the total population, per person revenues in the Game Consoles market are expected to reach US$3.20 in 2026.',
    pills: ['Worldwide', '2018-2030'], lastUpdate: 'Feb 1, 2025', released: 'Feb 2025', surveyPeriod: '2018–2030', attribution: 'Statista | Digital Market Outlook',
    deepLink: { country: 'jp', year: '2023', rows: ['Gender'], cols: ['Console hardware ownership'], displayOptions: { percent: true, absolute: true }, targetGroup: targetGroup('Male', 'Male') },
  },
  {
    type: 'market', label: 'Market Insights',
    title: 'Gaming Consoles - Worldwide | Advertising & Media',
    desc: 'In Worldwide, revenue in the Gaming Consoles market is projected to reach US$25.27bn in 2026. Revenue is expected to exhibit an annual growth rate (CAGR 2026-2030) of 1.82%, leading to a projected market volume of US$27.17bn by 2030.',
    pills: ['Worldwide', '2017-2030'], lastUpdate: 'Feb 1, 2025', released: 'Feb 2025', surveyPeriod: '2017–2030', attribution: 'Statista | Digital Market Outlook',
    deepLink: { country: 'us', year: '2024', rows: ['Age group'], cols: ['Cloud gaming adoption rate'], displayOptions: { percent: true }, targetGroup: targetGroup('Age 18-44', 'Age 18-44') },
  },
  {
    type: 'market', label: 'Market Insights',
    title: 'Game Consoles - Worldwide | eCommerce',
    desc: 'Revenue in the Game Consoles market is projected to reach US$4.61bn in 2026. Revenue is expected to show an annual growth rate (CAGR 2026-2030) of 1.49%, resulting in a projected market volume of US$4.89bn by 2030.',
    pills: ['Worldwide', '2017-2030'], lastUpdate: 'Feb 1, 2025', released: 'Feb 2025', surveyPeriod: '2017–2030', attribution: 'Statista | Digital Market Outlook',
    deepLink: { country: 'fr', year: '2024', rows: ['Income bracket'], cols: ['Monthly spend on gaming subscriptions'], displayOptions: { percent: true }, targetGroup: targetGroup('Age 25-54', 'Age 25-54') },
  },
  {
    type: 'topic', label: 'Topic',
    title: 'Console gaming - Statistics & Facts',
    desc: 'Console gaming is one of the oldest and most popular forms of gaming worldwide. While technology has advanced and more players now favour smartphones, revenues of the console gaming market have been growing.',
    pills: ['Worldwide'], lastUpdate: 'Apr 10, 2025', attribution: 'Statista Editorial',
    deepLink: { country: 'de', year: '2023', rows: ['Survey year'], cols: ['Console market revenue share'], displayOptions: { percent: true, absolute: true } },
  },
  {
    type: 'topic', label: 'Topic',
    title: 'Video game industry - Statistics & Facts',
    desc: 'In 2025, the revenue from the worldwide gaming market was estimated at almost 522.5 billion U.S. dollars, with the mobile gaming market generating an estimated 126 billion U.S. dollars of the total.',
    pills: ['Worldwide'], lastUpdate: 'May 2, 2025', attribution: 'Statista Editorial',
    deepLink: { country: 'gb', year: '2024', rows: ['Consumer segment'], cols: ['Brand trust in console manufacturers'], displayOptions: { percent: true }, targetGroup: targetGroup('Female', 'Female') },
  },
]

export const HISTORY_BY_MODE = {
  rai: [
    { label: 'Recents', items: ['Gaming console market overview', 'EV adoption rates in Europe 2024', 'Global smartphone shipments Q3', 'Streaming platform revenue comparison', 'Social media demographics by age group'] },
    { label: 'Last week', items: ['FMCG consumer behavior report', 'Renewable energy investment trends', 'SaaS market growth analysis', 'Gen Z consumer spending habits', 'Global e-commerce market size'] },
  ],
  ci: [
    { label: 'Recents', items: ['US consumer sentiment Q1 2025', 'Gen Z beauty shopping habits', 'Grocery buyer decision factors', 'Millennial brand loyalty study'] },
    { label: 'Last week', items: ['Premium vs value category shift', 'Subscription fatigue indicators', 'Health-conscious consumer segments'] },
  ],
}

export const ANSWER_KEYFACTS = [
  { value: '$24.8B',  label: 'Market size 2025',        pct: 0.62, src: 1 },
  { value: '5.58%',   label: 'CAGR 2024–2029',          pct: 0.45, src: 2 },
  { value: '30%+',    label: 'Subscription revenue',    pct: 0.30, src: 4 },
  { value: '+45%',    label: 'Cloud gaming YoY',         pct: 0.80, src: 6 },
]

export const TABLE_ROWS = [
  { co: 'Sony Interactive Entertainment', rev: '11.2', yoy: '+3.4%',  share: '44%', plat: 'PlayStation 5'       },
  { co: 'Microsoft Xbox',                 rev: '8.9',  yoy: '+5.1%',  share: '35%', plat: 'Xbox Series X/S'    },
  { co: 'Nintendo',                       rev: '4.7',  yoy: '-2.3%',  share: '19%', plat: 'Nintendo Switch 2'  },
  { co: 'Valve / Steam Deck',             rev: '0.5',  yoy: '+18.0%', share: '2%',  plat: 'Steam Deck'         },
]

export const STEP_SEARCH_1 = [
  { type: 'stats',  title: 'Console gaming market worldwide 2022–2032' },
  { type: 'stats',  title: 'Console gaming consumer market value 2018–2028' },
  { type: 'market', title: 'Game Consoles – Worldwide | Consumer' },
  { type: 'report', title: 'Game consoles – In-depth report' },
]

export const STEP_SEARCH_2 = [
  { type: 'market', title: 'Game Consoles – Worldwide | eCommerce' },
  { type: 'market', title: 'Gaming Consoles – Worldwide | Advertising & Media' },
  { type: 'topic',  title: 'Console gaming – Statistics & Facts' },
  { type: 'topic',  title: 'Video game industry – Statistics & Facts' },
]

export const STEP_SELECTED = [
  { badge: 1, type: 'stats',  title: 'Console gaming market worldwide 2022–2032' },
  { badge: 2, type: 'stats',  title: 'Console gaming consumer market value 2018–2028' },
  { badge: 3, type: 'report', title: 'Game consoles – In-depth report' },
  { badge: 4, type: 'market', title: 'Game Consoles – Worldwide | Consumer' },
  { badge: 5, type: 'market', title: 'Gaming Consoles – Worldwide | Advertising & Media' },
  { badge: 6, type: 'market', title: 'Game Consoles – Worldwide | eCommerce' },
  { badge: 7, type: 'topic',  title: 'Console gaming – Statistics & Facts' },
  { badge: 8, type: 'topic',  title: 'Video game industry – Statistics & Facts' },
]

export const CODE_LINES = [
  'start_2024 = 74.8   # USD billion (Newzoo estimate)',
  'end_2029  = 98.1    # USD billion (forecast)',
  '',
  'years = 5',
  'cagr  = (end_2029 / start_2024) ** (1 / years) - 1',
  'print(f"CAGR 2024→2029: {cagr * 100:.2f}%")',
  '',
  '# Output',
  'CAGR 2024→2029: 5.58%',
]
