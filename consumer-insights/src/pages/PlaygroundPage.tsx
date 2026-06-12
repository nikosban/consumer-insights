/**
 * COMPONENT PLAYGROUND — hidden route `/playground`
 *
 * Left-nav design-system browser.
 *
 * Foundations: Overview · Typography · Color · Elevation
 * Components:  Button · Badge · Input · Chip · Card · Empty State · Layout
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

// ─── Nav structure ────────────────────────────────────────────────────────────

type PageId =
  | 'overview'
  | 'typography'
  | 'icons'
  | 'color'
  | 'elevation'
  | 'button'
  | 'badge'
  | 'input'
  | 'chip'
  | 'card'
  | 'empty-state'
  | 'layout'

const NAV: { group: string; items: { id: PageId; label: string }[] }[] = [
  {
    group: 'Foundations',
    items: [
      { id: 'overview',    label: 'Overview'    },
      { id: 'typography',  label: 'Typography'  },
      { id: 'icons',       label: 'Icons'       },
      { id: 'color',       label: 'Color'       },
      { id: 'elevation',   label: 'Elevation'   },
    ],
  },
  {
    group: 'Components',
    items: [
      { id: 'button',      label: 'Button'      },
      { id: 'badge',       label: 'Badge'       },
      { id: 'input',       label: 'Input'       },
      { id: 'chip',        label: 'Chip'        },
      { id: 'card',        label: 'Card'        },
      { id: 'empty-state', label: 'Empty State' },
      { id: 'layout',      label: 'Layout'      },
    ],
  },
]

// ─── Shared helpers ───────────────────────────────────────────────────────────

function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-border">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3 mb-4 pb-2 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-6 mb-4">
      <span className="text-xs text-muted-foreground w-32 shrink-0 pt-1">{label}</span>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

function ColorSwatch({ swatch, token, value, usage }: { swatch: string; token: string; value: string; usage: string }) {
  return (
    <div className="flex items-center gap-4 py-1.5 border-b border-border/20 last:border-0">
      <div className={cn('w-6 h-6 rounded shrink-0 border border-black/[0.06]', swatch)} />
      <code className="text-[11px] text-foreground font-medium w-44 shrink-0 truncate">{token}</code>
      <span className="text-[11px] text-muted-foreground font-mono w-48 shrink-0 truncate">{value}</span>
      <span className="text-[11px] text-muted-foreground flex-1">{usage}</span>
    </div>
  )
}

function ColorGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-2">{children}</p>
  )
}

// ─── List row patterns (used on Card page) ────────────────────────────────────

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
        {[<Pencil key="p" />, <Copy key="c" />, <Trash2 key="t" />].map((icon, i) => (
          <button key={i} className={cn(
            'inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 transition-colors',
            i === 2 ? 'hover:bg-red-50 hover:border-red-200 hover:text-destructive' : 'hover:bg-accent hover:text-gray-900'
          )}>{icon}</button>
        ))}
      </div>
    </div>
  )
}

function DashboardStyleRow() {
  return (
    <div className="group flex items-center gap-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer -mx-3 px-3">
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/8 text-primary shrink-0">
        <LayoutDashboard className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">Q1 Audience Overview</p>
        <p className="text-xs text-muted-foreground mt-0.5">3 widgets · Updated 3/15/2025</p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center justify-center w-7 h-7 rounded border border-border bg-background text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-destructive">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

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

// ─── Pages ────────────────────────────────────────────────────────────────────

function OverviewPage() {
  const items: { name: string; status: 'done' | 'warn' | 'info'; note: string }[] = [
    { name: 'ResourceCard',    status: 'done', note: 'White header + gray-25 meta row, icon optional' },
    { name: 'IconBtn',         status: 'done', note: '7×7 bordered icon button, destructive variant' },
    { name: 'PageShell',       status: 'done', note: 'p-6 max-w-5xl mx-auto standard' },
    { name: 'Button',          status: 'done', note: 'default · outline · ghost · destructive · toolbar (h-8 text-xs)' },
    { name: 'Badge',           status: 'done', note: 'default · secondary · type-colour variants' },
    { name: 'Input',           status: 'done', note: 'Standard height + small variant' },
    { name: 'Chip',            status: 'done', note: 'default · primary · suggestion, with optional remove' },
    { name: 'Toolbar',         status: 'done', note: 'app/Toolbar.tsx + ToolbarActions' },
    { name: 'EmptyState',      status: 'done', note: 'Single component, optional CTA' },
    { name: 'SectionLabel',    status: 'done', note: 'Caps 10px label for groups' },
    { name: 'FieldGroup',      status: 'done', note: 'Label + content wrapper' },
    { name: 'Select',          status: 'warn', note: 'Two hand-rolled variants — not yet extracted' },
    { name: 'Checkbox',        status: 'warn', note: 'Two sizes, not using a Toggle component' },
    { name: 'WidgetPropertiesPanel', status: 'info', note: 'Inline in DashboardBuilderPage — extract when ready' },
  ]

  const dot: Record<'done' | 'warn' | 'info', string> = {
    done: 'bg-green-500',
    warn: 'bg-amber-400',
    info: 'bg-muted-foreground/40',
  }
  const label: Record<'done' | 'warn' | 'info', string> = {
    done: 'text-green-700',
    warn: 'text-amber-700',
    info: 'text-muted-foreground',
  }

  return (
    <>
      <PageHeader
        title="Overview"
        description="Status of every UI pattern in the app. Green = consolidated, amber = inconsistency known, gray = future work."
      />

      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr] text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 px-4 py-2 border-b border-border gap-4">
          <span>Component</span>
          <span>Note</span>
        </div>
        {items.map(item => (
          <div key={item.name} className="grid grid-cols-[1fr_2fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors items-center">
            <div className="flex items-center gap-2">
              <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot[item.status])} />
              <code className={cn('text-xs font-medium', label[item.status])}>{item.name}</code>
            </div>
            <span className="text-xs text-muted-foreground">{item.note}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Consolidated</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Known inconsistency</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground/40 inline-block" /> Future work</span>
      </div>
    </>
  )
}

function TypographyPage() {
  return (
    <>
      <PageHeader title="Typography" description="Font families, sizes, weights, and usage rules." />

      {/* ── Font family ── */}
      <Section title="Font family">
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <div className="grid grid-cols-[180px_1fr_200px] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Typeface</span><span>Sample</span><span>Role</span>
          </div>
          <div className="grid grid-cols-[180px_1fr_200px] gap-4 px-4 py-3 border-b border-border/40 items-center hover:bg-muted/20 transition-colors">
            <div>
              <code className="text-[11px] text-foreground font-medium">font-sans</code>
              <p className="text-[10px] text-muted-foreground mt-0.5">Instrument Sans</p>
            </div>
            <span className="text-sm text-foreground">The quick brown fox jumps</span>
            <span className="text-[11px] text-muted-foreground">Primary — all UI by default</span>
          </div>
          <div className="grid grid-cols-[180px_1fr_200px] gap-4 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
            <div>
              <code className="text-[11px] text-foreground font-medium">font-mono</code>
              <p className="text-[10px] text-muted-foreground mt-0.5">IBM Plex Mono</p>
            </div>
            <span className="text-sm font-mono text-foreground">DS-10482 · 2026-06-12</span>
            <span className="text-[11px] text-muted-foreground">Secondary — machine-readable only</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="rounded-lg border border-border p-4">
            <p className="text-[11px] font-medium text-foreground mb-2">Use Instrument Sans for</p>
            <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
              <li>Navigation, buttons, form controls</li>
              <li>Table headers and cells</li>
              <li>KPI values, chart axes, legends</li>
              <li>Percentages, currency, rankings</li>
              <li>Descriptions and long-form text</li>
              <li>Human-readable dates</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-[11px] font-medium text-foreground mb-2">Use IBM Plex Mono for</p>
            <ul className="text-[11px] text-muted-foreground space-y-1 list-disc list-inside">
              <li>Dataset and record identifiers</li>
              <li>Country, currency, market codes</li>
              <li>Machine-formatted timestamps</li>
              <li>Version numbers, query syntax</li>
              <li>Code, formulas, file hashes</li>
              <li>API keys, fixed-format metadata</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-border/40 space-y-1">
              {['DS-10482', 'DE-BE', 'EUR', '2026-06-12 14:07:32', 'v2.14.0'].map(ex => (
                <code key={ex} className="block text-[11px] font-mono text-muted-foreground">{ex}</code>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── Font size / line height ── */}
      <Section title="Font size &amp; line height">
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-[140px_48px_60px_90px_1fr] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Token</span><span>px</span><span>rem</span><span>Line height</span><span>Usage</span>
          </div>
          {[
            { token: 'text-2xl',    px: '24',  rem: '1.5',    lh: '1.5 · 36px',  usage: 'Page titles (h1)' },
            { token: 'text-xl',     px: '20',  rem: '1.25',   lh: '1.75 · 28px', usage: 'Section titles (h2)' },
            { token: 'text-lg',     px: '18',  rem: '1.125',  lh: '1.75 · 28px', usage: 'Large headings' },
            { token: 'text-base',   px: '16',  rem: '1',      lh: '1.5 · 24px',  usage: 'Nav items, prominent labels' },
            { token: 'text-sm',     px: '14',  rem: '0.875',  lh: '1.25 · 20px', usage: 'Body, card titles, row text' },
            { token: 'text-xs',     px: '12',  rem: '0.75',   lh: '1 · 16px',    usage: 'Meta, secondary text, field labels' },
            { token: 'text-[11px]', px: '11',  rem: '0.6875', lh: '—',           usage: 'Table cells, dense data' },
            { token: 'text-[10px]', px: '10',  rem: '0.625',  lh: '—',           usage: 'Micro labels (use sparingly)' },
          ].map(({ token, px, rem, lh, usage }) => (
            <div key={token} className="grid grid-cols-[140px_48px_60px_90px_1fr] gap-4 px-4 py-2.5 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors">
              <code className="text-[11px] text-foreground font-medium">{token}</code>
              <span className="text-[11px] text-muted-foreground tabular-nums">{px}</span>
              <span className="text-[11px] text-muted-foreground tabular-nums">{rem}</span>
              <span className="text-[11px] text-muted-foreground">{lh}</span>
              <span className="text-[11px] text-muted-foreground">{usage}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Font weight ── */}
      <Section title="Font weight">
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <div className="grid grid-cols-[140px_48px_1fr_1fr] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Token</span><span>Value</span><span>Sample</span><span>Usage</span>
          </div>
          {[
            { token: 'font-normal',   value: '400', sample: <span className="text-sm font-normal text-foreground">The quick brown fox</span>, usage: 'Body text, table values, chart labels, descriptions, input values' },
            { token: 'font-medium',   value: '500', sample: <span className="text-sm font-medium text-foreground">The quick brown fox</span>, usage: 'Buttons, navigation, table headers, form labels, tabs, filters' },
            { token: 'font-semibold', value: '600', sample: <span className="text-sm font-semibold text-foreground">The quick brown fox</span>, usage: 'Page titles, section headings, important KPI values, strong selected states' },
            { token: 'font-bold',     value: '700', sample: <span className="text-sm font-bold text-foreground line-through opacity-40">The quick brown fox</span>, usage: 'Do not use — not part of the type scale' },
          ].map(({ token, value, sample, usage }) => (
            <div key={token} className="grid grid-cols-[140px_48px_1fr_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors">
              <code className="text-[11px] text-foreground font-medium">{token}</code>
              <span className="text-[11px] text-muted-foreground tabular-nums">{value}</span>
              <div>{sample}</div>
              <span className="text-[11px] text-muted-foreground">{usage}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Dense interfaces should remain predominantly Regular (400). Use Medium and Semibold selectively — when everything is emphasised, nothing is.</p>
      </Section>

      {/* ── Numeric typography ── */}
      <Section title="Numeric typography">
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <div className="grid grid-cols-[200px_1fr] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Approach</span><span>When to use</span>
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-4 px-4 py-3 border-b border-border/40 items-start hover:bg-muted/20 transition-colors">
            <div>
              <p className="text-[11px] font-medium text-foreground">Tabular lining figures</p>
              <code className="text-[10px] text-muted-foreground font-mono">font-variant-numeric: tabular-nums lining-nums</code>
              <p className="text-sm font-normal text-foreground mt-2 tabular-nums">1,234,567.89</p>
            </div>
            <p className="text-[11px] text-muted-foreground">Numeric table columns, financial values, percentages, rankings, KPI values, dynamic values, values compared vertically, chart values</p>
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-4 px-4 py-3 items-start hover:bg-muted/20 transition-colors">
            <div>
              <p className="text-[11px] font-medium text-foreground">Proportional figures</p>
              <code className="text-[10px] text-muted-foreground font-mono">default (no override)</code>
              <p className="text-sm font-normal text-foreground mt-2">Insight 3 of 12</p>
            </div>
            <p className="text-[11px] text-muted-foreground">Ordinary prose when alignment is not required</p>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Do not use IBM Plex Mono merely to get equal-width numerals. Prefer <code className="font-mono">tabular-nums</code> in Instrument Sans.</p>
      </Section>

      {/* ── Letter spacing ── */}
      <Section title="Letter spacing">
        <div className="space-y-2 text-[11px] text-muted-foreground">
          <p>Use the font's default letter spacing unless a defined token specifies otherwise.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Do not add tracking to ordinary body text</li>
            <li>Do not use negative tracking for small labels</li>
            <li>Avoid uppercase labels in dense interfaces</li>
            <li>When uppercase is necessary for a short code or category, use brief restrained positive tracking</li>
            <li>Do not apply decorative tracking to numeric values</li>
          </ul>
        </div>
      </Section>
    </>
  )
}

function IconsPage() {
  return (
    <>
      <PageHeader title="Icons" description="Sizing, weight, and pairing rules for Tabler Icons." />

      <Section title="Icon library">
        <p className="text-[11px] text-muted-foreground mb-3">Use <strong className="font-medium text-foreground">Tabler Icons</strong> exclusively. Do not mix icons from multiple libraries.</p>
      </Section>

      <Section title="Stroke weight">
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <div className="grid grid-cols-[160px_80px_1fr] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Context</span><span>stroke-width</span><span>When to use</span>
          </div>
          {[
            { ctx: 'Default', sw: '2', note: 'Icon-only controls and icons paired with medium/semibold text' },
            { ctx: 'Light', sw: '1.75', note: 'When a lighter treatment is needed alongside regular-weight text' },
            { ctx: 'Heavy', sw: '> 2', note: 'Do not use unless explicitly defined and visually tested' },
          ].map(({ ctx, sw, note }) => (
            <div key={ctx} className="grid grid-cols-[160px_80px_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors">
              <span className="text-[11px] text-foreground">{ctx}</span>
              <code className="text-[11px] font-mono text-muted-foreground">{sw}</code>
              <span className="text-[11px] text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Match icon visual weight to the text it accompanies. Do not map font-weight values directly to SVG stroke widths.</p>
      </Section>

      <Section title="Size scale">
        <div className="rounded-xl border border-border overflow-hidden mb-4">
          <div className="grid grid-cols-[140px_100px_1fr] gap-4 text-[11px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 border-b border-border">
            <span>Container</span><span>Icon size</span><span>Context</span>
          </div>
          {[
            { container: '32px container', size: '18–20px', note: 'Standard icon buttons' },
            { container: '24px container', size: '16px',    note: 'Compact toolbars, secondary actions' },
            { container: '20px container', size: '12–14px', note: 'Dense toolbars, tables, filters' },
            { container: 'Paired with text', size: '1.25cap', note: 'Default for text-paired icons — matches cap height of adjacent type' },
          ].map(({ container, size, note }) => (
            <div key={container} className="grid grid-cols-[140px_100px_1fr] gap-4 px-4 py-3 border-b border-border/40 last:border-0 items-center hover:bg-muted/20 transition-colors">
              <span className="text-[11px] text-foreground">{container}</span>
              <code className="text-[11px] font-mono text-muted-foreground">{size}</code>
              <span className="text-[11px] text-muted-foreground">{note}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mb-2">Use <code className="font-mono">12px</code> only for simple glyphs (chevrons, arrows, sort indicators, close marks). Do not render detailed Tabler icons at 12px.</p>
        <p className="text-[11px] text-muted-foreground">Do not introduce arbitrary sizes outside this scale.</p>
      </Section>

      <Section title="Pairing icons with text">
        <div className="space-y-3 mb-4">
          {[
            { label: 'Default paired size', cls: 'flex items-center gap-2 text-sm text-foreground', iconCls: 'shrink-0 [&>svg]:w-[1.25cap] [&>svg]:h-[1.25cap]', note: '1.25cap · flex + items-center' },
          ].map(({ label, cls, iconCls, note }) => (
            <div key={label} className="flex items-start gap-6">
              <div className={cls}>
                <span className={iconCls}>
                  <LayoutDashboard />
                </span>
                Dashboard
              </div>
              <div>
                <p className="text-[11px] font-medium text-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground">{note}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-muted/40 border border-border p-4 text-[11px] space-y-1">
          <p className="font-medium text-foreground mb-2">Rules</p>
          <ul className="text-muted-foreground space-y-1 list-disc list-inside">
            <li>Size icon relative to cap height (<code className="font-mono">1.25cap</code> default), not fixed px</li>
            <li>Keep icon square — same value for width and height</li>
            <li>Align with flexbox, not manual top offsets</li>
            <li>Apply <code className="font-mono">flex-shrink: 0</code> to prevent distortion</li>
            <li>Do not stretch, crop, or distort icons</li>
          </ul>
        </div>
      </Section>

      <Section title="Interactive targets">
        <div className="space-y-3 text-[11px] text-muted-foreground">
          <p>The visual container and the interactive target are separate concepts.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Icon buttons must have a minimum tap target of <strong className="font-medium text-foreground">32×32px</strong></li>
            <li>A 20px or 24px visual icon may sit inside a larger clickable area</li>
            <li>Do not make the SVG element itself the only clickable region</li>
          </ul>
          <p>Use the same icon size and stroke for controls at the same hierarchy level.</p>
        </div>
      </Section>
    </>
  )
}

function ColorPage() {
  return (
    <>
      <PageHeader title="Color" description="All colors used across the app and landing page — scanned from source." />

      <div className="flex items-center gap-4 mb-2 pb-1 border-b border-border/40 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
        <span className="w-6 shrink-0" />
        <span className="w-44 shrink-0">Token / Class</span>
        <span className="w-48 shrink-0">Raw value</span>
        <span className="flex-1">Usage</span>
      </div>

      <ColorGroupLabel>Brand / Primary</ColorGroupLabel>
      {[
        { swatch: 'bg-primary',    token: '--primary',      value: 'oklch(0.47 0.243 264) ≈ #0666e5', usage: 'Buttons, active nav, links, chart primary, hero bg' },
        { swatch: 'bg-primary/10', token: 'primary / 10%', value: 'primary at 10% opacity',           usage: 'Badge backgrounds, icon badge bg, chip bg' },
        { swatch: 'bg-primary/5',  token: 'primary / 5%',  value: 'primary at 5% opacity',            usage: 'Widget drag-row hover, context chip resting' },
        { swatch: 'bg-[#3384EA]',  token: '--chart-2',     value: '#3384EA',                          usage: 'Chart series 2 (bar / line)' },
        { swatch: 'bg-[#66A3EF]',  token: '--chart-3',     value: '#66A3EF',                          usage: 'Chart series 3' },
        { swatch: 'bg-[#99C1F4]',  token: '--chart-4',     value: '#99C1F4',                          usage: 'Chart series 4' },
        { swatch: 'bg-[#CCE0FA]',  token: '--chart-5',     value: '#CCE0FA',                          usage: 'Chart series 5 (lightest)' },
      ].map(r => <ColorSwatch key={r.token} {...r} />)}

      <ColorGroupLabel>Neutral scale (H = 220 cool gray)</ColorGroupLabel>
      {[
        { swatch: 'bg-[oklch(0.982_0.003_220)]', token: '--color-25',  value: 'oklch(0.982 0.003 220)', usage: 'Sidebar bg, ResourceCard body bg, page shell bg' },
        { swatch: 'bg-[oklch(0.970_0.005_220)]', token: '--color-50',  value: 'oklch(0.970 0.005 220)', usage: 'Muted bg, secondary bg' },
        { swatch: 'bg-[oklch(0.958_0.007_220)]', token: '--color-75',  value: 'oklch(0.958 0.007 220)', usage: 'Accent bg, hover states' },
        { swatch: 'bg-[oklch(0.938_0.009_220)]', token: '--color-100', value: 'oklch(0.938 0.009 220)', usage: 'Borders, input borders' },
        { swatch: 'bg-[oklch(0.648_0.022_220)]', token: '--color-400', value: 'oklch(0.648 0.022 220)', usage: 'Muted foreground text, placeholder, labels' },
        { swatch: 'bg-[oklch(0.417_0.024_220)]', token: '--color-600', value: 'oklch(0.417 0.024 220)', usage: 'Sidebar text, secondary foreground, accent foreground' },
        { swatch: 'bg-[oklch(0.127_0.008_220)]', token: '--color-950', value: 'oklch(0.127 0.008 220)', usage: 'Primary foreground text (headings, body)' },
      ].map(r => <ColorSwatch key={r.token} {...r} />)}

      <ColorGroupLabel>Semantic roles</ColorGroupLabel>
      {[
        { swatch: 'bg-background border border-border', token: '--background',      value: 'oklch(1 0 0) — white',       usage: 'Main content area, cards, popovers' },
        { swatch: 'bg-foreground',                      token: '--foreground',       value: 'var(--color-950)',            usage: 'Primary text: headings, body, row titles' },
        { swatch: 'bg-muted',                           token: '--muted',            value: 'var(--color-50)',             usage: 'Subtle section backgrounds, tag bg' },
        { swatch: 'bg-muted-foreground',                token: '--muted-foreground', value: 'var(--color-400)',            usage: 'Secondary text, meta rows, descriptions' },
        { swatch: 'bg-accent',                          token: '--accent',           value: 'var(--color-75)',             usage: 'Hover backgrounds on buttons and list rows' },
        { swatch: 'bg-border',                          token: '--border',           value: 'var(--color-100)',            usage: 'All dividers, card outlines, input borders' },
        { swatch: 'bg-sidebar',                         token: '--sidebar',          value: 'var(--color-25)',             usage: 'Left nav sidebar background' },
        { swatch: 'bg-destructive',                     token: '--destructive',      value: 'oklch(0.577 0.245 27.3)',     usage: 'Delete buttons, error states' },
        { swatch: 'bg-destructive/10',                  token: 'destructive / 10%',  value: 'destructive at 10% opacity', usage: 'Destructive hover bg, error badge bg' },
      ].map(r => <ColorSwatch key={r.token} {...r} />)}

      <ColorGroupLabel>Chart-type badge colors</ColorGroupLabel>
      {[
        { swatch: 'bg-blue-50',    token: 'blue-50 / blue-600',       value: '#eff6ff / #2563eb', usage: 'Bar chart badge' },
        { swatch: 'bg-emerald-50', token: 'emerald-50 / emerald-700', value: '#ecfdf5 / #047857', usage: 'Line chart badge' },
        { swatch: 'bg-purple-50',  token: 'purple-50 / purple-600',   value: '#faf5ff / #9333ea', usage: 'Pie chart badge' },
        { swatch: 'bg-orange-50',  token: 'orange-50 / orange-600',   value: '#fff7ed / #ea580c', usage: 'Table chart badge' },
        { swatch: 'bg-amber-50',   token: 'amber-50 / amber-600',     value: '#fffbeb / #d97706', usage: 'Scorecard badge' },
      ].map(r => <ColorSwatch key={r.token} {...r} />)}

      <ColorGroupLabel>Landing page & special contexts</ColorGroupLabel>
      {[
        { swatch: 'bg-[#0666e5]', token: '#0666e5',  value: '#0666e5',    usage: 'Landing hero bg, SVG logo fill, gradient start' },
        { swatch: 'bg-[#003eaa]', token: '#003eaa',  value: '#003eaa',    usage: 'Landing hero gradient dark endpoint' },
        { swatch: 'bg-[#F97316]', token: '#F97316',  value: 'orange-500', usage: 'Research AI — Audience Profiler tile' },
        { swatch: 'bg-[#22C55E]', token: '#22C55E',  value: 'green-500',  usage: 'Research AI — Geomarket Brief tile' },
        { swatch: 'bg-[#A855F7]', token: '#A855F7',  value: 'purple-500', usage: 'Research AI — Brand Position tile' },
        { swatch: 'bg-[#4F46E5]', token: '#4F46E5',  value: 'indigo-600', usage: 'Widget creator color picker preset' },
        { swatch: 'bg-[#DC2626]', token: '#DC2626',  value: 'red-600',    usage: 'Widget creator color picker preset' },
        { swatch: 'bg-[#16A34A]', token: '#16A34A',  value: 'green-600',  usage: 'Widget creator color picker preset' },
      ].map(r => <ColorSwatch key={r.token} {...r} />)}
    </>
  )
}

function ElevationPage() {
  const shadows = [
    { name: 'shadow-none',   cls: '',                                                                     value: 'none',                                  usage: 'Flat surfaces — sidebars, table cells, toolbar' },
    { name: 'shadow-sm',     cls: 'shadow-sm',                                                            value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',         usage: 'Inputs, small cards, resource cards' },
    { name: 'shadow',        cls: 'shadow',                                                               value: '0 1px 3px 0 rgb(0 0 0 / 0.1) …',       usage: 'Dropdowns, context menus, pickers' },
    { name: 'shadow-md',     cls: 'shadow-md',                                                            value: '0 4px 6px -1px rgb(0 0 0 / 0.1) …',    usage: 'Popovers, floating action panels' },
    { name: 'shadow-lg',     cls: 'shadow-lg',                                                            value: '0 10px 15px -3px rgb(0 0 0 / 0.1) …',  usage: 'Modals, command palette, search overlay' },
    { name: 'shadow-xl',     cls: 'shadow-xl',                                                            value: '0 20px 25px -5px rgb(0 0 0 / 0.1) …',  usage: 'Sheets, drawers, side panels' },
  ]

  return (
    <>
      <PageHeader title="Elevation" description="Box-shadow scale. Higher elevation = further from the page surface = more prominent." />

      <div className="space-y-5">
        {shadows.map(({ name, cls, value, usage }) => (
          <div key={name} className="flex items-center gap-6">
            {/* Preview tile */}
            <div className={cn('w-16 h-16 rounded-xl bg-white border border-border shrink-0', cls)} />
            {/* Metadata */}
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <code className="text-sm font-semibold text-foreground">{name}</code>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono mb-0.5 truncate">{value}</p>
              <p className="text-xs text-muted-foreground">{usage}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-4 rounded-xl bg-muted/40 border border-border">
        <p className="text-xs font-semibold text-foreground mb-2">Blur / overlay</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shrink-0" />
          <div>
            <code className="text-sm font-semibold text-foreground">backdrop-blur-sm</code>
            <p className="text-xs text-muted-foreground mt-0.5">Used on sticky chat header — bg-background/80 + backdrop-blur-sm</p>
          </div>
        </div>
      </div>
    </>
  )
}

function ButtonPage() {
  return (
    <>
      <PageHeader title="Button" description="All variants and sizes currently in use." />

      <Section title="Variants">
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
      </Section>

      <Section title="Toolbar size" hint="h-8 text-xs — used inside Toolbar">
        <Row label="h-8 / text-xs">
          <Button size="default" className="text-xs h-8">Done</Button>
          <Button variant="outline" size="default" className="text-xs h-8">Edit</Button>
          <Button variant="outline" size="default" className="text-xs h-8"><Share2 className="h-3.5 w-3.5" /> Share</Button>
        </Row>
        <div className="border border-border rounded-lg overflow-hidden mt-4">
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
      </Section>

      <Section title="Icon-only (IconBtn)">
        <Row label="Standard">
          <IconBtn icon={<Pencil className="h-3 w-3" />} label="Edit" onClick={() => {}} />
          <IconBtn icon={<Copy className="h-3 w-3" />} label="Duplicate" onClick={() => {}} />
          <IconBtn icon={<Settings className="h-3 w-3" />} label="Settings" onClick={() => {}} />
          <IconBtn icon={<Plus className="h-3 w-3" />} label="Add" onClick={() => {}} />
        </Row>
        <Row label="Destructive">
          <IconBtn icon={<Trash2 className="h-3 w-3" />} label="Delete" destructive onClick={() => {}} />
        </Row>
      </Section>
    </>
  )
}

function BadgePage() {
  return (
    <>
      <PageHeader title="Badge" description="Inline labels for status, type, and metadata." />

      <Section title="Variants">
        <Row label="Default">
          <Badge>Default</Badge>
          <Badge className="bg-primary/10 text-primary border-0">Shared</Badge>
        </Row>
        <Row label="Secondary">
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="secondary" className="text-xs font-normal">Germany</Badge>
        </Row>
        <Row label="Destructive">
          <Badge variant="destructive">Deleted</Badge>
        </Row>
      </Section>

      <Section title="Chart-type badges">
        <Row label="Type colours">
          <Badge className="bg-blue-50 text-blue-600 border-0">bar</Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-0">line</Badge>
          <Badge className="bg-purple-50 text-purple-600 border-0">pie</Badge>
          <Badge className="bg-orange-50 text-orange-600 border-0">table</Badge>
          <Badge className="bg-amber-50 text-amber-600 border-0">scorecard</Badge>
        </Row>
      </Section>
    </>
  )
}

function InputPage() {
  return (
    <>
      <PageHeader title="Input" description="Form control primitives." />

      <Section title="Text input">
        <Row label="Default">
          <Input placeholder="Search…" className="w-48" />
        </Row>
        <Row label="Small (h-7)">
          <Input placeholder="Small variant" className="h-7 text-xs w-36" />
        </Row>
      </Section>

      <Section title="Select">
        <Row label="Standard">
          <select className="h-8 text-sm px-2 border border-border rounded-md bg-background text-foreground">
            <option>Option A</option>
            <option>Option B</option>
          </select>
        </Row>
        <Row label="Small (dashed)">
          <select className="h-7 text-xs pl-2.5 pr-2 bg-muted/50 border border-dashed border-border rounded-md text-muted-foreground appearance-none">
            <option>+ Add column</option>
            <option>Gender</option>
          </select>
          <span className="text-[10px] text-amber-600 font-medium">⚠ Hand-rolled — extract to Select component</span>
        </Row>
      </Section>

      <Section title="Checkbox">
        <Row label="Standard">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-primary h-3.5 w-3.5" />
            <span className="text-xs text-foreground">Enabled (h-3.5)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-primary h-3 w-3" />
            <span className="text-xs text-foreground">Properties panel (h-3)</span>
          </label>
          <span className="text-[10px] text-amber-600 font-medium">⚠ Two sizes — consider extracting a Toggle</span>
        </Row>
      </Section>

      <Section title="Section labels & field groups" hint="app/SectionLabel.tsx, app/FieldGroup.tsx">
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
      </Section>
    </>
  )
}

function ChipPage() {
  const [removed, setRemoved] = useState(false)

  return (
    <>
      <PageHeader title="Chip" description="app/Chip.tsx — filter tags with optional remove and onClick." />

      <Section title="Variants">
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
      </Section>

      <Section title="Live demo">
        {!removed
          ? <Row label="Remove me">
              <Chip label="Click × to remove" onRemove={() => setRemoved(true)} />
            </Row>
          : <p className="text-xs text-green-700 font-medium">✓ Chip removed</p>
        }
      </Section>
    </>
  )
}

function CardPage() {
  return (
    <>
      <PageHeader title="Card" description="ResourceCard — unified base component used across all resource lists." />

      <Section title="ResourceCard variants">
        <Row label="With actions">
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
      </Section>

      <Section title="Historical row patterns" hint="Pre-ResourceCard — kept for reference">
        <Row label="Audience row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <AudienceStyleRow />
          </div>
        </Row>
        <Row label="Dashboard row">
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden px-3">
            <DashboardStyleRow />
          </div>
        </Row>
        <Row label="Widget drag row">
          <div className="w-64 border border-border rounded-lg overflow-hidden">
            <WidgetDragRow />
          </div>
        </Row>
      </Section>
    </>
  )
}

function EmptyStatePage() {
  return (
    <>
      <PageHeader title="Empty State" description="EmptyState.tsx — one component, consistent across all empty lists." />

      <Section title="With CTA">
        <div className="border border-border rounded-lg overflow-hidden max-w-lg">
          <EmptyState
            title="No dashboards yet"
            description="Create your first dashboard by combining widgets onto a shared canvas."
            ctaLabel="Create a dashboard"
            onCta={() => {}}
          />
        </div>
      </Section>

      <Section title="Without CTA">
        <div className="border border-border rounded-lg overflow-hidden max-w-lg">
          <EmptyState
            title="No analyses yet"
            description="Generate a narrative report from any dashboard linked to this project."
          />
        </div>
      </Section>
    </>
  )
}

function LayoutPage() {
  return (
    <>
      <PageHeader title="Layout" description="Page shells, headers, dividers — structural primitives." />

      <Section title="Page shell">
        <div className="text-xs text-muted-foreground space-y-2">
          <div className="flex items-center gap-3">
            <code className="bg-muted px-2 py-1 rounded text-foreground">max-w-5xl mx-auto p-6</code>
            <span>DashboardsPage, AudiencesPage, AnalysesPage</span>
          </div>
          <div className="flex items-center gap-3">
            <code className="bg-muted px-2 py-1 rounded text-foreground">max-w-4xl mx-auto px-8 py-10</code>
            <span>PlaygroundPage</span>
          </div>
          <p className="text-green-700 font-medium">✓ Standardised via PageShell component</p>
        </div>
      </Section>

      <Section title="Page header">
        <div className="w-full max-w-lg border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboards</h1>
              <p className="text-sm text-muted-foreground">Build and share interactive dashboards</p>
            </div>
            <Button><Plus className="h-4 w-4 mr-1" /> New</Button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground tracking-wide">2 dashboards</p>
          </div>
        </div>
      </Section>

      <Section title="Dividers">
        <div className="w-48 space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">border-border (standard)</p>
            <div className="border-t border-border" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">border-border/50 (subtle)</p>
            <div className="border-t border-border/50" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">divide-border (list rows)</p>
            <div className="flex flex-col divide-y divide-border border border-border rounded-md">
              <div className="py-2 px-3 text-xs text-muted-foreground">Row A</div>
              <div className="py-2 px-3 text-xs text-muted-foreground">Row B</div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}

// ─── Page map ─────────────────────────────────────────────────────────────────

const PAGES: Record<PageId, React.ReactNode> = {
  'overview':    <OverviewPage />,
  'typography':  <TypographyPage />,
  'icons':       <IconsPage />,
  'color':       <ColorPage />,
  'elevation':   <ElevationPage />,
  'button':      <ButtonPage />,
  'badge':       <BadgePage />,
  'input':       <InputPage />,
  'chip':        <ChipPage />,
  'card':        <CardPage />,
  'empty-state': <EmptyStatePage />,
  'layout':      <LayoutPage />,
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function PlaygroundPage() {
  const [active, setActive] = useState<PageId>('overview')

  return (
    <div className="flex h-full overflow-hidden">

      {/* Left nav */}
      <nav className="w-48 shrink-0 border-r border-border bg-sidebar flex flex-col overflow-y-auto py-4">
        <p className="px-4 mb-3 text-[11px] font-bold text-foreground tracking-wide">Design System</p>
        {NAV.map(({ group, items }) => (
          <div key={group} className="mb-4">
            <p className="px-4 mb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{group}</p>
            {items.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={cn(
                  'w-full text-left px-4 py-1.5 text-sm transition-colors rounded-none',
                  active === id
                    ? 'text-primary font-medium bg-primary/8'
                    : 'text-sidebar-foreground hover:text-foreground hover:bg-white/60'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-10 py-10">
          {PAGES[active]}
        </div>
      </main>

    </div>
  )
}
