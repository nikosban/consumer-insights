## Surface definition and elevation

The interface should feel precise and lightly tactile.

Use controlled strokes to define component boundaries. Use compact shadows to communicate elevation. Use inset highlights or inset shadows only when they communicate the physical state of a control.

The intended result is crisp rather than flat, and dimensional rather than fluffy.

### Surface anatomy

A raised component may contain up to three visual layers:

1. A `1px` perimeter stroke defining the edge
2. A subtle upper-edge inset highlight defining the raised surface
3. A compact external shadow defining elevation

Not every component requires all three layers.

Do not add additional visual layers without a clear purpose.

### Default structural surface

Ordinary cards, panels, tables, and sections should normally use a controlled stroke without an external shadow.

```css
.surface {
  border: 1px solid var(--border-subtle);
  box-shadow: none;
}
```

Use this treatment for:

- Standard cards
- Table containers
- Chart containers
- Sidebar sections
- Static panels
- Form groups

A component does not become elevated simply because it has a background or border radius.

### Raised controls

Buttons and compact raised controls may combine a perimeter stroke, a subtle top-edge highlight, and a short external shadow.

```css
.control--raised {
  border: 1px solid var(--border-control);
  box-shadow:
    inset 0 1px 0 var(--edge-highlight),
    0 1px 1px rgb(0 0 0 / 0.1),
    0 2px 3px -1px rgb(0 0 0 / 0.08);
}
```

The shadow should remain close to the component.

The top-edge highlight should be visible only on inspection. It must not make the control look glossy, metallic, or heavily beveled.

### Hovered controls

Hover should slightly strengthen the sense of elevation without dramatically changing the component.

```css
.control--raised:hover {
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 var(--edge-highlight),
    0 1px 2px rgb(0 0 0 / 0.1),
    0 3px 5px -2px rgb(0 0 0 / 0.1);
}
```

Do not:

- Move the control more than `1px`
- Introduce a large blur
- Add a glow
- Dramatically darken the shadow
- Change the border width

### Pressed controls

Pressed controls should appear closer to or slightly inside the underlying surface.

Reduce the external shadow and introduce a restrained inset depth shadow.

```css
.control--raised:active,
.control--raised[aria-pressed="true"] {
  transform: translateY(0);
  box-shadow:
    inset 0 1px 2px rgb(0 0 0 / 0.1),
    0 1px 0 rgb(0 0 0 / 0.04);
}
```

Do not combine a strong inset shadow with a strong external shadow.

### Selected controls

Selected tabs, segments, menu rows, or options should normally use a surface change and a precise inset stroke.

```css
.option[aria-selected="true"],
.segment[aria-pressed="true"] {
  box-shadow: inset 0 0 0 1px var(--border-control);
}
```

An inset stroke communicates selection without affecting layout.

It is different from an inset depth shadow:

```css
/* Selected boundary */
box-shadow: inset 0 0 0 1px var(--border-control);

/* Physically pressed depth */
box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1);
```

Do not use the pressed treatment merely to indicate selection.

### Floating surfaces

Dropdowns, menus, popovers, and floating cards should use a precise stroke and a compact layered shadow.

```css
.surface--floating {
  border: 1px solid var(--border-subtle);
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.08),
    0 6px 14px -4px rgb(0 0 0 / 0.14);
}
```

The first layer is the contact shadow. The second layer provides limited ambient separation.

Keep the shadow tighter than a typical marketing-site card shadow.

Use this treatment for:

- Dropdown menus
- Popovers
- Model or option selectors
- Autocomplete results
- Contextual information cards
- Command palettes
- Detached floating toolbars

### Large overlays

Dialogs and larger overlays may use a slightly broader shadow, but should still retain a crisp edge.

```css
.surface--overlay {
  border: 1px solid var(--border-subtle);
  box-shadow:
    0 2px 4px rgb(0 0 0 / 0.08),
    0 10px 24px -8px rgb(0 0 0 / 0.18);
}
```

Large overlays should also rely on their backdrop and surface separation. Do not make the shadow carry the entire visual hierarchy.

### Inner highlights

Use a one-sided upper-edge inset highlight only on surfaces intended to feel raised.

```css
box-shadow: inset 0 1px 0 var(--edge-highlight);
```

Suitable uses:

- Raised buttons
- Selected segmented controls
- Compact toolbar controls
- Prominent toggles
- Floating control surfaces

Avoid upper-edge highlights on:

- Ordinary cards
- Table containers
- Text inputs
- Nested panels
- Every menu row

### Borders versus inset strokes

Use a normal border for a component’s permanent structure.

```css
border: 1px solid var(--border-subtle);
```

Use an inset stroke for temporary or state-dependent boundaries that must not affect layout.

```css
box-shadow: inset 0 0 0 1px var(--border-control);
```

Do not replace all borders with inset box shadows.

### Shadow limits

For ordinary application components:

- Use no more than two external shadow layers.
- Keep the vertical offset small and downward-biased.
- Keep ordinary control blur values at or below approximately `5px`.
- Keep menu and popover blur values at or below approximately `16px`.
- Avoid shadows that extend significantly above or to the sides of the component.
- Avoid blur-heavy shadows with almost no visible contact point.
- Avoid large negative spread values used to manufacture dramatic floating effects.

### Component defaults

| Component        | Stroke          | Inset treatment      | External shadow          |
| ---------------- | --------------- | -------------------- | ------------------------ |
| Standard card    | Subtle          | None                 | None                     |
| Static panel     | Subtle          | None                 | None                     |
| Input            | Default         | None                 | None                     |
| Raised button    | Default         | Upper-edge highlight | Compact                  |
| Ghost button     | Optional subtle | None                 | None                     |
| Pressed button   | Default         | Inset depth          | Minimal                  |
| Selected segment | Optional        | Inset stroke         | None or minimal          |
| Dropdown menu    | Subtle          | None                 | Floating                 |
| Popover          | Subtle          | None                 | Floating                 |
| Dialog           | Subtle          | None                 | Overlay                  |
| Sticky header    | Separator       | None                 | None or 1px contact line |

### Prohibited treatments

Do not:

- Apply shadows to every card
- Use large soft shadows below small controls
- Apply inner depth shadows to ordinary resting cards
- Create glossy button highlights
- Use multiple visible perimeter strokes
- Combine a strong border, strong inset shadow, and strong external shadow
- Make selected controls look physically pressed unless they are toggles
- Add elevation only because a component is important
- Use shadow as a replacement for grouping, spacing, or hierarchy
- Create arbitrary component-specific shadow values

### Decision rule

Use a stroke when the component needs a clear edge.

Use an upper-edge highlight when a control should feel subtly raised.

Use an external shadow when a component overlaps or physically sits above another surface.

Use an inset depth shadow when a control is actively pressed or intentionally recessed.

If none of these meanings apply, keep the component flat.
