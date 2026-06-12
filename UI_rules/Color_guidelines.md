# Color Guidelines

## Purpose

This file defines how color should be used across the product.

It does not define raw color values or complete token mappings. Those belong in `tokens/color.tokens.json`.

It does not define border width, inset strokes, shadows, or elevation behavior. Those belong in the surfaces and elevation guidelines.

It does not define chart palettes in detail. Those belong in `data-visualization.md`.

## Core principles

* Neutral colors should dominate the interface.
* Use color only when it communicates interaction, selection, status, data meaning, grouping, or brand identity.
* Do not add color solely to make a component feel more interesting.
* Use semantic color tokens in components. Do not use raw palette values directly.
* Keep saturated color visually scarce so it retains meaning.
* Do not communicate status, selection, or category through color alone.

## Raw palette

Use Tailwind colors as the raw palette.

* **Zinc** is the neutral foundation.
* **Blue** is used for brand, interaction, selection, focus, and informational states.
* **Emerald** is used for success.
* **Amber** is used for warning.
* **Red** is used for danger, error, and destructive actions.
* Other Tailwind hues may be used only for data visualization, meaningful category grouping, or a separately defined decorative system.

The primary brand blue is `#0666E5`.

Extend the Tailwind palette only when an existing raw value cannot support the required semantic role.

## Semantic tokens

Components must use semantic tokens that describe purpose rather than hue or shade.

Semantic token groups should cover:

* Background and surface
* Text
* Icon
* Border
* Brand and interaction
* Information
* Success
* Warning
* Danger
* Disabled states
* Data visualization

Raw palette values should remain inside the token definition layer.

Do not create component-specific color tokens unless a shared semantic token cannot represent the intended role.

## Neutral surfaces

White is the primary background and content surface in light mode.

Use Zinc 50 for surfaces that should appear visually submerged or separated from the main content plane, including:

* Sidebars
* Secondary navigation
* Grouped content regions
* Filter areas
* Table headers
* Inspector panels
* Recessed control groups

Raised and floating surfaces should generally return to white and gain definition through the border and elevation systems.

Do not alternate white and Zinc 50 arbitrarily. A surface change must communicate structure, grouping, or depth.

Do not assign every card a different neutral background.

## Brand blue

Use `#0666E5` as the primary brand and interaction color.

Use strong brand blue for:

* Primary actions
* Links
* Focus indicators
* Checked controls
* Active filters
* Small active indicators
* The primary or selected data series

Use restrained brand-blue tints for:

* Selected rows
* Active navigation backgrounds
* Selected tabs
* Selected menu options
* Highlighted regions
* Brand-related grouping

Do not use saturated brand blue for:

* Every icon
* Every heading
* Passive borders
* Ordinary metadata
* Standard cards
* Large page backgrounds
* Every chart series

Blue text should normally imply interaction. Do not use it for passive labels or values.

## Brand blue and informational blue

Brand interaction and informational status may share the Blue family, but they must use separate semantic tokens.

Brand tokens represent:

* Actions
* Links
* Focus
* Selection
* Active navigation

Information tokens represent:

* Notices
* Explanatory alerts
* Neutral system messages
* Informational states

Do not use a primary-action token for an informational notice.

Do not use an informational-status token for a selected control.

## Neutral controls

Most controls should remain neutral in their resting state.

Use neutral colors for:

* Secondary buttons
* Inputs
* Select controls
* Toolbars
* Menus
* Tabs
* Filters
* Icon buttons

Introduce brand blue when a control becomes:

* Primary
* Selected
* Checked
* Focused
* Active

Do not give every interactive element a blue resting state.

## Semantic colors

Use semantic colors only when their meaning is genuine.

### Success

Use Emerald for:

* Successful completion
* Healthy status
* Valid input
* Confirmed positive outcomes

Do not use Emerald merely because a value increased.

### Warning

Use Amber for:

* Non-blocking risk
* Attention-required states
* Partial completion
* Warnings

Do not use Amber for ordinary emphasis.

### Danger

Use Red for:

* Errors
* Failed states
* Invalid input
* Destructive actions
* Critical problems

Do not make every destructive icon permanently red. Use stronger danger treatment when the destructive action is active, imminent, or being confirmed.

### Information

Use informational Blue for:

* Neutral notices
* Additional context
* Informational system states

Keep informational Blue visually distinct from primary interaction Blue through semantic token choice and treatment.

## Grouping related items

Color may group related items when the relationship is meaningful and repeated.

Examples include:

* Dataset categories
* Entity types
* Report sections
* Saved views
* Data-source families

Grouping colors must:

* Stay consistent across related views
* Include a visible text label
* Use restrained tints for large surfaces
* Avoid conflicting with semantic status colors
* Avoid implying interaction when the grouping is passive

Do not assign random colors to cards or sections only to create variety.

## Text and icon color

Use a small semantic hierarchy for text and icons:

* Primary
* Secondary
* Tertiary
* Disabled
* Inverse
* Brand or link
* Semantic status

Do not create hierarchy through many slightly different neutral values.

Do not use tertiary or disabled colors for essential content.

Icons should normally inherit the semantic color of the text or control they accompany.

Do not color decorative icons with brand or semantic colors unless the color carries meaning.

## Selection and status

Selection should combine color with another visible signal, such as:

* A checkmark
* A border or inset stroke
* A position indicator
* A change in surface
* Stronger text

Status should combine color with text and, when useful, an icon or shape.

Do not rely on color alone.

Do not use fully saturated backgrounds for ordinary selected rows, tabs, or menu options.

## Dark mode

Dark mode should use the same semantic token structure with separately tuned values.

In dark mode:

* Use Zinc-based dark neutrals rather than pure black.
* Make elevated surfaces slightly lighter than the surfaces beneath them.
* Keep borders restrained.
* Tune brand blue independently so it does not appear overly luminous.
* Use subtle semantic backgrounds.
* Keep saturated colors controlled.
* Use dark shadows rather than colored glows.

Do not mechanically invert the light palette.

Do not reuse all light-theme values unchanged.

Do not make dark mode more decorative or more saturated than light mode.

## Data visualization

Data visualization uses a separate color system.

Read `data-visualization.md` when creating:

* Charts
* Maps
* Heatmaps
* Conditional formatting
* Sequential scales
* Diverging scales
* Categorical palettes

Brand blue should usually represent the primary or selected series.

Neutral Zinc tones should support contextual, historical, inactive, or comparison data.

Do not use interface semantic colors as the complete chart palette.

Do not assume:

* Increase is always positive
* Decrease is always negative
* High is always good
* Low is always bad

Data color meaning must follow the domain.

## Border ownership

The color system defines semantic border colors.

The surfaces and elevation guidelines define:

* Where borders are used
* Border width
* Normal border versus inset stroke
* How borders combine with shadows
* How borders behave across elevation states

Do not duplicate those rules here.

## Prohibited patterns

Do not:

* Use raw palette values directly in components
* Invent arbitrary component-specific colors
* Add color without semantic purpose
* Give every card a colored background
* Use several unrelated accent hues in the main interface
* Use brand blue for passive content
* Use semantic colors without semantic meaning
* Use visualization colors for ordinary controls
* Communicate selection or status through color alone
* Mix Tailwind Zinc and Gray as competing neutral foundations
* Use large saturated surfaces without a strong reason
* Use colored outer glows
* Create category colors that conflict with success, warning, or danger meanings

## Decision rule

Before applying a non-neutral color, identify the exact meaning it communicates:

1. Brand or interaction
2. Selection
3. Information
4. Success
5. Warning
6. Danger
7. Data meaning
8. Meaningful grouping

If none apply, use a neutral token.
::: 
