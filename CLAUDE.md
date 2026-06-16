# Claude Code instructions — Consumer Insights

## UI rule routing

Any task that touches UI must consult the relevant rule files before writing or editing code.
Rule files live in `UI_rules/`. Load every file whose domain overlaps the task.

### Routing table

| Task involves | Load these files |
|---|---|
| Any UI task | `Typography.md` — always |
| Color, surfaces, backgrounds, text color, borders, semantic tokens | `Color_guidelines.md` + `color.tokens.json` |
| Icons (adding, sizing, choosing) | `Icons.md` |
| Shadows, elevation, raised/floating/overlay surfaces | `Elevation.md` |
| Charts, data visualization, maps, heatmaps, KPIs, conditional formatting | `Data_visualization.md` + `Color_guidelines.md` + `color.tokens.json` |
| Buttons, inputs, chips, selects, checkboxes, toggles, badges | `Typography.md` + `Color_guidelines.md` + `Elevation.md` + `Icons.md` |
| Cards, panels, modals, drawers, popovers, tooltips | `Color_guidelines.md` + `Elevation.md` + `Typography.md` |
| Navigation, sidebars, tabs, breadcrumbs | `Color_guidelines.md` + `Typography.md` + `Icons.md` |
| Tables, lists, data rows | `Typography.md` + `Color_guidelines.md` + `Data_visualization.md` |
| Empty states, loading states, error states | `Typography.md` + `Color_guidelines.md` + `Icons.md` |
| Page layout, spacing, shell | `Typography.md` + `Color_guidelines.md` + `Elevation.md` |

When in doubt, load all five rule files. The overhead of reading them is lower than the cost of a violation.

### Non-negotiable rules (memorised — no file load required)

These apply unconditionally to every line of UI code written or reviewed:

**Typography**
- Minimum font size: 12px (`text-xs`). Never `text-[10px]` or `text-[11px]`.
- Weights: `font-normal` (400), `font-medium` (500), `font-semibold` (600) only. `font-bold` (700) is prohibited.
- Never combine `uppercase` with `tracking-wide`, `tracking-wider`, or `tracking-widest`.
- IBM Plex Mono (`font-mono`) only for machine-readable identifiers: tokens, hex values, code, IDs. Not for prose.

**Color**
- Use semantic tokens in components. Never raw Tailwind palette values (`text-zinc-400`, `bg-gray-50`, `bg-green-500`, etc.).
- Correct mappings: `text-zinc-400` → `text-muted-foreground`, `bg-zinc-50` / `bg-gray-50` → `bg-muted` or `bg-accent`, `bg-zinc-100` → `bg-accent`, `text-zinc-950` → `text-foreground`, `text-zinc-600` → `text-secondary-foreground`.
- Hover backgrounds: `hover:bg-accent` (not `hover:bg-white`, `hover:bg-gray-50`, `hover:bg-zinc-100`).
- Active/selected states: pair color with a second signal (border, checkmark, position indicator, or surface change). Color alone is not enough.
- Blue text implies interaction. Do not use `text-primary` on passive labels.

**Icons**
- Tabler Icons only (`@tabler/icons-react`). Do not use `lucide-react` icons in app UI.
- `stroke-width={2}` on every icon, or `[&>svg]:stroke-2` on the wrapper.
- Size icons to the cap height of adjacent text via `[&>svg]` on the wrapper (~70% of `font-size`). Never hardcode icon `width`/`height` that differs from adjacent text context.

**Elevation**
- Three layers only: structural (no shadow), raised (card shadow), floating (menu/popover shadow).
- Do not stack multiple `box-shadow` layers beyond the three-layer system.
- No colored outer glows.

## Components

**Always use existing components. Never inline their styles.**

- Before writing any interactive UI element (button, chip, badge, input, etc.), check `src/components/ui/` for an existing component.
- If a component exists, import and use it — never copy its styles into inline Tailwind classes.
- If no component exists for the pattern needed: propose it first, get approval, then create the component in `src/components/ui/` and add it to `PlaygroundPage.tsx` before using it anywhere.

## Git

- Never add `Co-Authored-By: Claude` or any AI trailer to commit messages.
