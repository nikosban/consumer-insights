/**
 * COMPONENT PLAYGROUND — hidden route `/playground`
 *
 * Not linked in the sidebar. Used to visually audit every reusable UI pattern
 * in the app side-by-side before consolidation.
 *
 * Sections:
 *  1. Typography
 *  2. Buttons
 *  3. Badges
 *  4. Chips
 *  5. Form controls
 *  6. Section labels & field groups
 *  7. Toolbar
 *  8. List rows  ← main divergence area
 *  9. Cards
 * 10. Empty states
 * 11. Page shells / layout primitives
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Chip } from '@/components/app/Chip'
import { SectionLabel } from '@/components/app/SectionLabel'
import { FieldGroup } from '@/components/app/FieldGroup'
import { Toolbar, ToolbarActions, ResourceCard, IconBtn } from '@/components/app'
import EmptyState from '@/components/EmptyState'
import {
  LayoutDashboard, FileText, Users, BarChart2, Trash2,
  Pencil, Copy, Plus, Share2, BookmarkPlus, RefreshCw,
  ChevronRight, Sparkles, Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── helpers ──────────────────────────────────────────────────────────────────

function Block({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-border">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function ColorRow({ swatch, token, value, usage }: { swatch: string; token: string; value: string; usage: string }) {
  return (
    <div className="flex items-center gap-4 py-1.5 border-b border-border/20 last:border-0">
      <div className={cn('w-6 h-6 rounded shrink-0 border border-black/[0.06]', swatch)} />
      <code className="text-[11px] text-foreground font-medium w-44 shrink-0 truncate">{token}</code>
      <span className="text-[11px] text-muted-foreground font-mono w-48 shrink-0 truncate">{value}</span>
      <span className="text-[11px] text-muted-foreground flex-1">{usage}</span>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6 mb-4">
      <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase w-32 shrink-0 pt-1">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

// ─── 8. List row patterns ─────────────────────────────────────────────────────
// These are the main source of divergence — four slightly different row
// implementations across AudiencesPage, ProjectDetailPage (DashboardRow),
// ProjectDetailPage (AnalysisRow) and DashboardBuilderPage widget list.

/** From AudiencesPage — py-3.5 gap-4, NO leading icon, 3 action buttons */
function AudienceStyleRow() {
  return (
    <div className="group flex items-center gap-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer -mx-3 px-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">Millennials 25–34 DE</span>
          <Badge variant="secondary" className="text-xs font-normal">Germany</Badge>
          <Badge className="text-xs font-normal bg-primary/10 text-primary border-0">Shared</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">High-income urban consumers interested in premium brands</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {[<Pencil />, <Copy />, <Trash2 />].map((icon, i) => (
          <button key={i} className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 transition-colors',
            i === 2 ? 'hover:bg-red-50 hover:border-red-200 hover:text-destructive' : 'hover:bg-accent hover:text-gray-900'
          )}>{icon}</button>
        ))}
      </div>
    </div>
  )
}

/** From ProjectDetailPage DashboardRow — py-3 gap-3, HAS leading icon (7×7 rounded), 1 action button */
function DashboardStyleRow() {
  return (
    <div className="group flex items-center gap-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer -mx-3 px-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 text-primary shrink-0">
        <LayoutDashboard className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">Q1 Audience Overview</p>
        <p className="text-xs text-muted-foreground mt-0.5">3 widgets &nbsp;·&nbsp; Updated 3/15/2025</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-destructive">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

/** From ProjectDetailPage AnalysisRow — py-3.5 gap-4, HAS leading icon (8×8 rounded), 2 action buttons */
function AnalysisStyleRow() {
  return (
    <div className="group flex items-center gap-4 py-3.5 hover:bg-gray-50 transition-colors -mx-3 px-3 cursor-pointer rounded-xl">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/8 text-primary shrink-0">
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">Q1 Audience Overview — Summary</p>
        <p className="text-xs text-muted-foreground mt-0.5">3 sections &nbsp;·&nbsp; Q1 Audience Overview &nbsp;·&nbsp; 3/15/2025</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button className="inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 hover:bg-accent hover:text-gray-900 transition-colors">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button className="inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-destructive transition-colors">
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

/** From DashboardBuilderPage widget drag list — py-2 gap-2, small icon, grab cursor */
function WidgetDragRow() {
  return (
    <div className="group flex items-center gap-2 px-3 py-2 hover:bg-primary/5 transition-colors cursor-grab active:cursor-grabbing rounded-md">
      <div className="flex items-center justify-center w-6 h-6 rounded bg-primary/8 text-primary shrink-0">
        <BarChart2 className="h-3 w-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">Purchase Intent by Brand</p>
        <p className="text-[10px] text-muted-foreground">Bar chart</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [chipRemoved, setChipRemoved] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-foreground">Component Playground</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visual inventory of every UI pattern in the app. Hidden route — not linked in nav.
        </p>
      </div>

      {/* ── 1. Typography ── */}
      <Block title="1. Typography" hint="Font family: Open Sans — weights 400 / 600 / 700">

        {/* Column headers */}
        <div className="flex items-center gap-6 mb-3 pb-1 border-b border-border/40">
          <span className="w-32 shrink-0" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex-1">Sample</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-28">Font family</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-20">Size</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-20">Weight</span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-28">Tailwind class</span>
        </div>

        {[
          {
            label: 'Page title',
            sample: <h1 className="text-2xl font-bold text-foreground">Page title</h1>,
            family: 'Open Sans',
            size: '24px / 1.5rem',
            weight: '700 — bold',
            cls: 'text-2xl font-bold',
          },
          {
            label: 'Section title',
            sample: <h2 className="text-xl font-bold text-foreground">Section title</h2>,
            family: 'Open Sans',
            size: '20px / 1.25rem',
            weight: '700 — bold',
            cls: 'text-xl font-bold',
          },
          {
            label: 'Card / row title',
            sample: <p className="text-sm font-semibold text-gray-900">Card title</p>,
            family: 'Open Sans',
            size: '14px / 0.875rem',
            weight: '600 — semibold',
            cls: 'text-sm font-semibold',
          },
          {
            label: 'Body',
            sample: <p className="text-sm text-foreground">Body text</p>,
            family: 'Open Sans',
            size: '14px / 0.875rem',
            weight: '400 — regular',
            cls: 'text-sm',
          },
          {
            label: 'Secondary / meta',
            sample: <p className="text-xs text-muted-foreground">Secondary text</p>,
            family: 'Open Sans',
            size: '12px / 0.75rem',
            weight: '400 — regular',
            cls: 'text-xs text-muted-foreground',
          },
          {
            label: 'Field label',
            sample: <label className="text-xs font-medium text-muted-foreground">Field label</label>,
            family: 'Open Sans',
            size: '12px / 0.75rem',
            weight: '500 — medium',
            cls: 'text-xs font-medium text-muted-foreground',
          },
          {
            label: 'Toolbar button',
            sample: <span className="text-xs font-medium text-foreground">Toolbar btn</span>,
            family: 'Open Sans',
            size: '12px / 0.75rem',
            weight: '500 — medium',
            cls: 'text-xs h-8',
          },
          {
            label: 'Section label / caps',
            sample: <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Section label</p>,
            family: 'Open Sans',
            size: '10px',
            weight: '600 — semibold',
            cls: 'text-[10px] font-semibold uppercase tracking-wider',
          },
          {
            label: 'Micro / badge',
            sample: <span className="text-[10px] text-muted-foreground">10px text</span>,
            family: 'Open Sans',
            size: '10px',
            weight: '400 — regular',
            cls: 'text-[10px]',
          },
        ].map(({ label, sample, family, size, weight, cls }) => (
          <div key={label} className="flex items-center gap-6 py-2 border-b border-border/20 last:border-0">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase w-32 shrink-0">{label}</span>
            <div className="flex-1">{sample}</div>
            <span className="text-[11px] text-muted-foreground w-28">{family}</span>
            <span className="text-[11px] text-muted-foreground w-20 tabular-nums">{size}</span>
            <span className="text-[11px] text-muted-foreground w-20">{weight}</span>
            <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground w-28 truncate">{cls}</code>
          </div>
        ))}
      </Block>

      {/* ── 2. Colors ── */}
      <Block title="2. Colors" hint="All colors used across the app and landing page — scanned from source">

        {/* Column headers */}
        <div className="flex items-center gap-4 mb-2 pb-1 border-b border-border/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          <span className="w-6 shrink-0" />
          <span className="w-44 shrink-0">Token / Class</span>
          <span className="w-48 shrink-0">Raw value</span>
          <span className="flex-1">Usage</span>
        </div>

        {/* ── Brand / Primary ── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Brand / Primary</p>
        {[
          { swatch: 'bg-primary',      token: '--primary',         value: 'oklch(0.47 0.243 264) ≈ #0666e5', usage: 'Buttons, active nav, links, chart primary series, hero background' },
          { swatch: 'bg-primary/10',   token: 'primary / 10%',     value: 'primary at 10% opacity',           usage: 'Badge backgrounds (Shared), icon badge bg (primary/8), chip bg' },
          { swatch: 'bg-primary/5',    token: 'primary / 5%',      value: 'primary at 5% opacity',            usage: 'Widget drag-row hover, context chip resting state' },
          { swatch: 'bg-[#3384EA]',    token: '--chart-2',         value: '#3384EA',                          usage: 'Chart series 2 (bar/line)' },
          { swatch: 'bg-[#66A3EF]',    token: '--chart-3',         value: '#66A3EF',                          usage: 'Chart series 3' },
          { swatch: 'bg-[#99C1F4]',    token: '--chart-4',         value: '#99C1F4',                          usage: 'Chart series 4' },
          { swatch: 'bg-[#CCE0FA]',    token: '--chart-5',         value: '#CCE0FA',                          usage: 'Chart series 5 (lightest)' },
        ].map(r => <ColorRow key={r.token} {...r} />)}

        {/* ── Neutral scale ── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Neutral scale (H = 220 cool gray)</p>
        {[
          { swatch: 'bg-[oklch(0.982_0.003_220)]', token: '--color-25',  value: 'oklch(0.982 0.003 220)', usage: 'Sidebar bg, ResourceCard body bg (--color-25), page shell bg' },
          { swatch: 'bg-[oklch(0.970_0.005_220)]', token: '--color-50',  value: 'oklch(0.970 0.005 220)', usage: 'Muted bg, secondary bg' },
          { swatch: 'bg-[oklch(0.958_0.007_220)]', token: '--color-75',  value: 'oklch(0.958 0.007 220)', usage: 'Accent bg, hover states' },
          { swatch: 'bg-[oklch(0.938_0.009_220)]', token: '--color-100', value: 'oklch(0.938 0.009 220)', usage: 'Borders, input borders' },
          { swatch: 'bg-[oklch(0.648_0.022_220)]', token: '--color-400', value: 'oklch(0.648 0.022 220)', usage: 'Muted foreground text, placeholder text, labels' },
          { swatch: 'bg-[oklch(0.417_0.024_220)]', token: '--color-600', value: 'oklch(0.417 0.024 220)', usage: 'Sidebar text, secondary foreground, accent foreground' },
          { swatch: 'bg-[oklch(0.127_0.008_220)]', token: '--color-950', value: 'oklch(0.127 0.008 220)', usage: 'Primary foreground text (headings, body)' },
        ].map(r => <ColorRow key={r.token} {...r} />)}

        {/* ── Semantic roles ── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Semantic roles</p>
        {[
          { swatch: 'bg-background border border-border', token: '--background',        value: 'oklch(1 0 0) — white',       usage: 'Main content area, card header rows, popovers' },
          { swatch: 'bg-foreground',                      token: '--foreground',         value: 'var(--color-950)',            usage: 'Primary text: headings, body, row titles' },
          { swatch: 'bg-muted',                           token: '--muted',              value: 'var(--color-50)',             usage: 'Subtle section backgrounds, tag bg' },
          { swatch: 'bg-muted-foreground',                token: '--muted-foreground',   value: 'var(--color-400)',            usage: 'Secondary text, meta rows, descriptions, date labels' },
          { swatch: 'bg-accent',                          token: '--accent',             value: 'var(--color-75)',             usage: 'Hover backgrounds on buttons, list rows' },
          { swatch: 'bg-border',                          token: '--border',             value: 'var(--color-100)',            usage: 'All dividers, card outlines, input borders' },
          { swatch: 'bg-sidebar',                         token: '--sidebar',            value: 'var(--color-25)',             usage: 'Left nav sidebar background' },
          { swatch: 'bg-destructive',                     token: '--destructive',        value: 'oklch(0.577 0.245 27.3)',     usage: 'Delete buttons, error states, destructive badge text' },
          { swatch: 'bg-destructive/10',                  token: 'destructive / 10%',    value: 'destructive at 10% opacity', usage: 'Destructive button hover bg, error badge bg' },
        ].map(r => <ColorRow key={r.token} {...r} />)}

        {/* ── Type badge colors ── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Chart-type badge colors</p>
        {[
          { swatch: 'bg-blue-50',    token: 'blue-50 / blue-600',     value: '#eff6ff / #2563eb', usage: 'Bar chart type badge' },
          { swatch: 'bg-emerald-50', token: 'emerald-50 / emerald-700', value: '#ecfdf5 / #047857', usage: 'Line chart type badge' },
          { swatch: 'bg-purple-50',  token: 'purple-50 / purple-600',  value: '#faf5ff / #9333ea', usage: 'Pie chart type badge' },
          { swatch: 'bg-orange-50',  token: 'orange-50 / orange-600',  value: '#fff7ed / #ea580c', usage: 'Table chart type badge' },
          { swatch: 'bg-amber-50',   token: 'amber-50 / amber-600',    value: '#fffbeb / #d97706', usage: 'Scorecard chart type badge' },
        ].map(r => <ColorRow key={r.token} {...r} />)}

        {/* ── Landing page & special ── */}
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">Landing page & special contexts</p>
        {[
          { swatch: 'bg-[#0666e5]',  token: '#0666e5',   value: '#0666e5',           usage: 'Landing hero band background, SVG logo fill, gradient endpoints' },
          { swatch: 'bg-[#003eaa]',  token: '#003eaa',   value: '#003eaa',           usage: 'Landing hero gradient dark endpoint' },
          { swatch: 'bg-[#F97316]',  token: '#F97316',   value: 'orange-500',        usage: 'Research AI — Audience Profiler use-case tile' },
          { swatch: 'bg-[#22C55E]',  token: '#22C55E',   value: 'green-500',         usage: 'Research AI — Geomarket Brief use-case tile' },
          { swatch: 'bg-[#A855F7]',  token: '#A855F7',   value: 'purple-500',        usage: 'Research AI — Brand Position use-case tile' },
          { swatch: 'bg-[#4F46E5]',  token: '#4F46E5',   value: 'indigo-600',        usage: 'Widget creator color picker preset' },
          { swatch: 'bg-[#DC2626]',  token: '#DC2626',   value: 'red-600',           usage: 'Widget creator color picker preset' },
          { swatch: 'bg-[#16A34A]',  token: '#16A34A',   value: 'green-600',         usage: 'Widget creator color picker preset' },
        ].map(r => <ColorRow key={r.token} {...r} />)}

      </Block>

      {/* ── 3. Buttons ── */}
      <Block title="3. Buttons" hint="All variants × sizes currently used">
        <Row label="Default">
          <Button size="default">Default</Button>
          <Button size="default"><Sparkles className="h-3.5 w-3.5" /> With icon</Button>
          <Button size="sm">Small</Button>
        </Row>
        <Row label="Outline">
          <Button variant="outline" size="default">Outline</Button>
          <Button variant="outline" size="default"><Share2 className="h-3.5 w-3.5" /> Share</Button>
          <Button variant="outline" size="default"><BookmarkPlus className="h-3.5 w-3.5" /> Save</Button>
          <Button variant="outline" size="default"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button variant="outline" size="sm">Outline sm</Button>
        </Row>
        <Row label="Ghost">
          <Button variant="ghost" size="default">Ghost</Button>
          <Button variant="ghost" size="sm">Ghost sm</Button>
        </Row>
        <Row label="Destructive">
          <Button variant="destructive" size="default">Delete</Button>
          <Button variant="outline" size="default" className="text-destructive hover:bg-destructive/10 hover:border-destructive/40">
            <Trash2 className="h-3.5 w-3.5" /> Delete (outline)
          </Button>
        </Row>
        <Row label="h-8 / text-xs">
          <Button size="default" className="text-xs h-8">Done</Button>
          <Button variant="outline" size="default" className="text-xs h-8">Edit</Button>
          <Button variant="outline" size="default" className="text-xs h-8"><Share2 className="h-3.5 w-3.5" /> Share</Button>
          <p className="text-[10px] text-amber-600 font-medium">⚠ Used in toolbar — differs from size="sm"</p>
        </Row>
        <Row label="Icon-only (7×7)">
          <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => {}} />
          <IconBtn icon={<Pencil className="h-3 w-3" />} label="Edit" onClick={() => {}} />
          <IconBtn icon={<Copy className="h-3 w-3" />} label="Duplicate" onClick={() => {}} />
          <IconBtn icon={<Settings className="h-3 w-3" />} label="Settings" onClick={() => {}} />
          <IconBtn icon={<Plus className="h-3 w-3" />} label="Add" onClick={() => {}} />
          <p className="text-[10px] text-green-600 font-medium">✓ Using IconBtn component</p>
        </Row>
      </Block>

      {/* ── 3. Badges ── */}
      <Block title="4. Badges">
        <Row label="Default">
          <Badge>Default</Badge>
          <Badge className="bg-primary/10 text-primary border-0">Shared</Badge>
          <Badge className="bg-primary/10 text-primary border-0 text-xs">Shared Dashboard</Badge>
        </Row>
        <Row label="Secondary">
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="secondary" className="text-xs font-normal">Germany</Badge>
          <Badge variant="secondary" className="text-xs">Bar</Badge>
        </Row>
        <Row label="Type colours">
          <Badge className="bg-blue-50 text-blue-600 border-0">bar</Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-0">line</Badge>
          <Badge className="bg-purple-50 text-purple-600 border-0">pie</Badge>
          <Badge className="bg-orange-50 text-orange-600 border-0">table</Badge>
          <Badge className="bg-amber-50 text-amber-600 border-0">scorecard</Badge>
          <p className="text-[10px] text-green-600 font-medium">✓ Using Badge component</p>
        </Row>
      </Block>

      {/* ── 4. Chips ── */}
      <Block title="5. Chips" hint="app/Chip.tsx — 3 variants">
        <Row label="default">
          <Chip label="Country of residence" />
          <Chip label="Removable" onRemove={() => {}} />
        </Row>
        <Row label="primary">
          <Chip label="Gender" variant="primary" />
          <Chip label="Age distribution" variant="primary" onRemove={() => {}} />
        </Row>
        <Row label="suggestion">
          <Chip label="Males 25–40" variant="suggestion" onClick={() => {}} />
          <Chip label="Germany" variant="suggestion" onClick={() => {}} />
        </Row>
        {!chipRemoved && (
          <Row label="Live demo">
            <Chip label="Click × to remove" onRemove={() => setChipRemoved(true)} />
          </Row>
        )}
      </Block>

      {/* ── 5. Form controls ── */}
      <Block title="6. Form controls">
        <Row label="Input">
          <Input placeholder="Search…" className="w-48" />
          <Input placeholder="h-7 small" className="h-7 text-xs w-36" />
        </Row>
        <Row label="Select (native)">
          <select className="h-8 text-sm px-2 border border-border rounded-md bg-background text-foreground">
            <option>Option A</option>
            <option>Option B</option>
          </select>
          <select className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground appearance-none">
            <option>+ Add column</option>
            <option>Gender</option>
          </select>
          <p className="text-[10px] text-amber-600 font-medium">⚠ Two sizes, two styles — both hand-rolled</p>
        </Row>
        <Row label="Checkbox">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-primary h-3.5 w-3.5" />
            <span className="text-xs text-foreground">Enabled</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-primary h-3 w-3" />
            <span className="text-xs text-foreground">h-3 variant (properties panel)</span>
          </label>
          <p className="text-[10px] text-amber-600 font-medium">⚠ Two sizes — not using a Toggle component</p>
        </Row>
        <Row label="Search input">
          <div className="flex items-center gap-2 h-9 px-2 rounded-md bg-background border border-border text-muted-foreground text-sm w-48">
            <span className="text-xs">Search</span>
          </div>
          <p className="text-[10px] text-amber-600 font-medium">⚠ Button styled as input — in WorkspaceSidebar</p>
        </Row>
      </Block>

      {/* ── 6. Section labels & field groups ── */}
      <Block title="7. Section labels & field groups" hint="app/SectionLabel.tsx, app/FieldGroup.tsx">
        <Row label="SectionLabel">
          <div>
            <SectionLabel>Rows</SectionLabel>
            <SectionLabel>Cross-tab columns</SectionLabel>
          </div>
        </Row>
        <Row label="FieldGroup">
          <div className="w-64">
            <FieldGroup label="Chart type">
              <div className="h-8 bg-muted/30 rounded border border-dashed border-border flex items-center justify-center text-xs text-muted-foreground">content</div>
            </FieldGroup>
          </div>
        </Row>
        <Row label="Inline label">
          <div>
            <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-1">Workspaces</p>
            <p className="text-[10px] text-muted-foreground">⚠ Sidebar header — similar to SectionLabel but different size + weight</p>
          </div>
        </Row>
      </Block>

      {/* ── 7. Toolbar ── */}
      <Block title="8. Toolbar" hint="app/Toolbar.tsx + ToolbarActions">
        <div className="border border-border rounded-lg overflow-hidden">
          <Toolbar>
            <div className="flex flex-col min-w-0">
              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">Characteristics & demographics</p>
              <h1 className="text-sm font-semibold text-gray-900">Country of residence</h1>
            </div>
            <ToolbarActions>
              <Button variant="outline" size="default" className="text-xs h-8"><Share2 className="h-3.5 w-3.5" /> Share</Button>
              <Button variant="outline" size="default" className="text-xs h-8"><BookmarkPlus className="h-3.5 w-3.5" /> Save</Button>
              <Button size="default" className="text-xs h-8"><LayoutDashboard className="h-3.5 w-3.5" /> Add to dashboard</Button>
            </ToolbarActions>
          </Toolbar>
        </div>
        <p className="text-[10px] text-amber-600 font-medium mt-2">✓ Use size="toolbar" variant</p>
      </Block>

      {/* ── 8. List rows ── */}
      <Block title="9. List rows" hint="Historical — replaced by ResourceCard. Kept for reference.">
        <Row label="Audience row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <AudienceStyleRow />
          </div>
        </Row>
        <Row label="">
          <p className="text-[10px] text-muted-foreground">py-3.5 · gap-4 · NO leading icon · 3 action buttons (Pencil, Copy, Trash)</p>
        </Row>

        <Row label="Dashboard row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <DashboardStyleRow />
          </div>
        </Row>
        <Row label="">
          <p className="text-[10px] text-muted-foreground">py-3 · gap-3 · 7×7 icon · 1 action button (Trash only)</p>
        </Row>

        <Row label="Analysis row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <AnalysisStyleRow />
          </div>
        </Row>
        <Row label="">
          <p className="text-[10px] text-muted-foreground">py-3.5 · gap-4 · 8×8 icon · 2 action buttons (ChevronRight, Trash)</p>
        </Row>

        <Row label="Widget drag row">
          <div className="w-64 border border-border rounded-lg overflow-hidden">
            <WidgetDragRow />
          </div>
        </Row>
        <Row label="">
          <p className="text-[10px] text-muted-foreground">py-2 · gap-2 · 6×6 icon · no action buttons · grab cursor</p>
        </Row>

        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 space-y-1">
          <p className="font-semibold">✓ Resolved — all rows now use ResourceCard</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
            <li>Icon: 8×8 with optional flag (audiences use no icon)</li>
            <li>Actions: IconBtn component, opacity-0 group-hover via shared class</li>
            <li>Two-section layout: white header + --color-25 meta row</li>
            <li>Meta: left (contextual info) ↔ right (date) space-between</li>
          </ul>
        </div>
      </Block>

      {/* ── 9. Cards ── */}
      <Block title="10. Cards" hint="ResourceCard — unified base component with icon · title · actions + meta row">
        <Row label="Dashboard">
          <div className="w-full max-w-lg">
            <ResourceCard
              icon={<LayoutDashboard />}
              title="Q1 Audience Overview"
              meta="3 widgets"
              date="Updated 3/15/2025"
              actions={
                <>
                  <IconBtn icon={<Pencil className="h-3 w-3" />} label="Edit" onClick={() => {}} />
                  <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => {}} />
                </>
              }
              onClick={() => {}}
            />
          </div>
        </Row>
        <Row label="Analysis">
          <div className="w-full max-w-lg">
            <ResourceCard
              icon={<FileText />}
              title="Q1 Audience Overview — Summary"
              meta="3 sections · Q1 Audience Overview"
              date="3/15/2025"
              actions={
                <>
                  <IconBtn icon={<ChevronRight className="h-3 w-3" />} label="Open" onClick={() => {}} />
                  <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => {}} />
                </>
              }
              onClick={() => {}}
            />
          </div>
        </Row>
        <Row label="No actions">
          <div className="w-full max-w-lg">
            <ResourceCard
              icon={<Users />}
              title="Millennials 25–34 DE"
              meta="Germany · 2.4M universe"
              date="Created 1/3/2025"
              onClick={() => {}}
            />
          </div>
        </Row>
        <p className="text-[10px] text-green-600 font-medium mt-2">✓ Single component — icon (8×8), title, meta, actions. Background: --color-25.</p>
      </Block>

      {/* ── 10. Empty states ── */}
      <Block title="11. Empty states" hint="EmptyState.tsx — one component, consistent">
        <div className="border border-border rounded-lg overflow-hidden">
          <EmptyState
            title="No dashboards yet"
            description="Create your first dashboard by combining widgets onto a shared canvas."
            ctaLabel="Create a dashboard"
            onCta={() => {}}
          />
        </div>
        <div className="mt-3 border border-border rounded-lg overflow-hidden">
          <EmptyState
            title="No analyses yet"
            description="Generate a narrative report from any dashboard linked to this project."
          />
        </div>
        <p className="text-[10px] text-green-600 font-medium mt-2">✓ Consistent — single component with optional CTA</p>
      </Block>

      {/* ── 11. Layout primitives ── */}
      <Block title="12. Layout primitives" hint="Page shells, section headers, dividers">
        <Row label="Page shell">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><code className="bg-muted px-1 rounded">p-6 max-w-5xl mx-auto</code> — DashboardsPage, WorkspacePage</p>
            <p><code className="bg-muted px-1 rounded">px-6 py-10 max-w-[720px] mx-auto</code> — AudiencesPage</p>
            <p><code className="bg-muted px-1 rounded">p-6 max-w-4xl mx-auto</code> — ProjectDetailPage</p>
            <p className="text-amber-600 font-medium">✓ Standardised via PageShell component</p>
          </div>
        </Row>
        <Row label="Page header">
          <div className="w-full max-w-lg space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-foreground">Dashboards</h1>
                <p className="text-sm text-muted-foreground">Build and share interactive dashboards</p>
              </div>
              <Button><Plus className="h-4 w-4 mr-1" /> New</Button>
            </div>
            <p className="text-[10px] text-muted-foreground">↑ Pattern from DashboardsPage / AudiencesPage / WorkspacePage</p>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground tracking-wide">2 analyses</p>
            </div>
            <p className="text-[10px] text-muted-foreground">↑ Count header from ProjectDetailPage analyses list</p>
          </div>
        </Row>
        <Row label="Dividers">
          <div className="w-48 space-y-2">
            <div className="border-t border-border" />
            <div className="border-t border-border/50" />
            <div className="flex flex-col divide-y divide-border">
              <div className="py-2 text-xs text-muted-foreground">Row A</div>
              <div className="py-2 text-xs text-muted-foreground">Row B</div>
            </div>
            <p className="text-[10px] text-green-600 font-medium">✓ Standardised to border-border everywhere</p>
          </div>
        </Row>
      </Block>

      {/* ── Summary ── */}
      <section className="mt-4 p-4 bg-gray-50 border border-border rounded-xl text-xs space-y-3">
        <p className="font-bold text-foreground text-sm">Consolidation status</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <p className="font-semibold text-foreground mb-1">High priority — all done ✓</p>
            <ul className="space-y-1 list-inside text-muted-foreground">
              <li className="text-green-700">✓ <code>ResourceCard</code> — white header + gray-25 meta, icon optional</li>
              <li className="text-green-700">✓ <code>IconBtn</code> — 7×7 bordered icon button, destructive variant</li>
              <li className="text-green-700">✓ <code>PageShell</code> — <code>p-6 max-w-4xl mx-auto</code> standard</li>
              <li className="text-green-700">✓ <code>size="toolbar"</code> — <code>h-8 text-xs</code> Button variant</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Medium priority — all done ✓</p>
            <ul className="space-y-1 list-inside text-muted-foreground">
              <li className="text-green-700">✓ Chart type badge colours removed (ChartsPage rewrite)</li>
              <li className="text-green-700">✓ Checkbox sizing — <code>h-3.5 w-3.5 accent-primary cursor-pointer</code></li>
              <li className="text-green-700">✓ Divider — standardised to <code>border-border</code></li>
            </ul>
          </div>
        </div>
        <p className="text-muted-foreground border-t border-border pt-2 mt-2">
          Phases A–C complete. Phase F: extract <code>WidgetPropertiesPanel</code> from <code>DashboardBuilderPage</code> (1 596 lines).
        </p>
      </section>

    </div>
  )
}
