# V1 Changelog

## Sidebar

### UX
- Added `#E5F1FF` hover state to all interactive sidebar elements: accordion triggers, sub-headers, category rows, subcategory rows, survey items, drag items, target group items
- Survey items already selected (added state) are excluded from the hover override — active state takes priority
- "Create target group" button: darker blue on hover (`#0554c2`) and active (`#0447a0`)

---

## Target Groups

### Functional
- Target group items in sidebar are now draggable — drag to the FILTER drop zone to apply as a filter (v0 + v1)
- FILTER drop zone now accepts `target-group` drag events; calls `applyFilterGroup(id)` on drop (v0 + v1)
- FILTER zone highlights (dashed outline + active background) during drag-over, matching ROWS/COLUMNS zone behaviour (v0 + v1)

### Visual
- Survey cards show a blue left border (`var(--color-primary)`) when a target group filter is active, providing per-card visual confirmation without repeating the group name (v1 only)

---

## Global Navbar

### Visual
- Replaced v0 TopBar with Global Navbar component matching the Statista design system
- Statista wordmark SVG (white paths, no Consumer Insights suffix)
- Dark navy background `#001327` with `3px` blue bottom border `#0666E5`
- "New" badge on Connect nav item
- Icon buttons (globe, star, bell) on the right side

### Visual
- Logo center-aligned vertically in top row (was bottom-aligned)
- Search field rebuilt to match Paper reference 1:1: label above input ("Search Statistics, Reports, …" in semibold 14px `#455F7C`), white input box (`#FFFFFF` bg, `1px solid #C4C4C4` outline, 4px radius, 40px tall)

### UX
- Search input with icon button on the right
- "You are using the account of {userName}" account context text in top row
- Nav items: Statistics, Insights, Research AI, Connect, Daily Data, Services with chevrons where applicable
- My Account dropdown trigger on the far right
- Content centered within `max-width: 1184px` with `17px` top/bottom padding
