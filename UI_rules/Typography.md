Use Instrument Sans with tabular lining figures for most quantitative data.

```css
.numeric,
.table-number,
.kpi-value,
.chart-value {
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums lining-nums;
}
```

Use tabular numerals for:

* Numeric table columns
* Financial values
* Percentages
* Rankings
* KPI values
* Values that update dynamically
* Values compared vertically
* Chart values where width stability prevents layout movement

Use proportional numerals in ordinary prose when alignment is unnecessary.

Do not use IBM Plex Mono merely to obtain equal-width numbers.

---

## Table typography

| Element             | Typography                                          |
| ------------------- | --------------------------------------------------- |
| Table cells         | `14px / 18px`, weight `400`                         |
| Numeric cells       | `14px / 18px`, weight `400`, tabular lining figures |
| Table headers       | `12px / 16px` or `14px / 18px`, weight `500`        |
| Secondary cell text | `12px / 16px`, weight `400`                         |
| Dataset identifiers | `12px / 16px` mono, weight `400`                    |

Use `12px` table headers when labels are short, secondary, and clearly separated from the values.

Use `14px` table headers for longer human-readable labels.

Do not place entire tables in IBM Plex Mono.

Do not reduce primary table values below `14px` to fit more rows.

---

## Chart typography

| Element        | Typography                     |
| -------------- | ------------------------------ |
| Chart title    | `14px / 20px` or `16px / 24px` |
| Legend         | `12px / 16px`                  |
| Axis labels    | `12px / 16px`                  |
| Tooltip values | `14px / 18px`                  |
| Tooltip labels | `12px / 16px`                  |

Do not render chart text below `12px`.

When chart labels do not fit:

* Reduce tick frequency
* Abbreviate values
* Shorten labels
* Increase chart dimensions
* Move secondary detail into a tooltip
* Rotate labels only when appropriate

Do not solve overcrowding by shrinking typography.

---

## Control typography

| Control           | Typography                                   |
| ----------------- | -------------------------------------------- |
| Default button    | `14px / 20px`, weight `500`                  |
| Compact button    | `14px / 18px`, weight `500`                  |
| Default input     | `14px / 20px`, weight `400`                  |
| Compact input     | `14px / 18px`, weight `400`                  |
| Form label        | `12px / 16px` or `14px / 18px`, weight `500` |
| Helper text       | `12px / 16px`, weight `400`                  |
| Menu item         | `14px / 20px`, weight `400` or `500`         |
| Compact menu item | `14px / 18px`, weight `400` or `500`         |

Do not use `16px` for ordinary desktop controls unless the control is intentionally prominent.

---

## Letter spacing

Use the typeface’s default letter spacing unless a semantic typography token specifies otherwise.

* Do not add tracking to ordinary body text.
* Do not use negative tracking for small UI labels.
* Avoid uppercase labels in dense interfaces.
* Do not apply decorative tracking to numbers.
* Do not increase IBM Plex Mono letter spacing by default.
* Do not tighten small text to create more horizontal space.

Large titles may receive a small, globally defined tracking adjustment after visual testing. Do not tune tracking independently per component.

---

## Mono integration

Use the same nominal size for Instrument Sans and IBM Plex Mono initially.

If the fonts appear optically mismatched, define one global adjustment after visual testing.

```css
.mono {
  font-family: var(--font-mono);
  font-size: var(--mono-size-adjustment, 1em);
}
```

Do not:

* Resize mono text independently in individual components
* Shrink mono automatically
* Increase mono tracking by default
* Use uppercase mono as decoration
* Switch between sans and mono without semantic meaning

---

## Semantic tokens

Components should consume semantic typography tokens rather than raw utility sizes.

```css
:root {
  --type-title-major-size: 2rem;
  --type-title-major-line: 2.5rem;

  --type-title-page-size: 1.5rem;
  --type-title-page-line: 2rem;

  --type-title-section-size: 1.25rem;
  --type-title-section-line: 1.75rem;

  --type-title-compact-size: 1rem;
  --type-title-compact-line: 1.5rem;

  --type-body-size: 0.875rem;
  --type-body-line: 1.25rem;

  --type-compact-size: 0.875rem;
  --type-compact-line: 1.125rem;

  --type-supporting-size: 0.75rem;
  --type-supporting-line: 1rem;
}
```

Do not allow individual components to invent:

* New font families
* New font weights
* Arbitrary font sizes
* Arbitrary line heights
* Arbitrary letter spacing
* Unapproved uses of IBM Plex Mono

When a typography role is missing, map it to the closest existing semantic style before creating a new token.

---

## Final typography rule

Use only this core scale:

```text
32 → 24 → 20 → 16 → 14 → 12
```

Use `14px / 20px` for normal application text and `14px / 18px` for dense application text.

Use Instrument Sans by default.

Use IBM Plex Mono only for machine-readable, fixed-format, or character-aligned information.

Use Regular, Medium, and Semibold. Do not use Bold unless explicitly requested.
- Long-form explanations
- Human-readable dates
- General interface copy

The sans is always the default. Use IBM Plex Mono only when one of the explicit mono conditions applies.

### Use IBM Plex Mono for

- Dataset identifiers
- Record identifiers
- Country, currency, or market codes
- Machine-formatted timestamps
- Version numbers
- Query syntax
- Code
- Formulas and formula output
- File hashes
- API keys or shortened tokens
- Fixed-format metadata values
- Values where character-by-character alignment is important

Examples:

```text
DS-10482
DE-BE
EUR
2026-06-12 14:07:32
v2.14.0
SELECT region, revenue
p < 0.001
```

Do not automatically use IBM Plex Mono for:

- Every number
- Every KPI=
- Table columns containing ordinary quantities
- Chart labels
- Navigation
- Buttons
- Headings
- Metadata labels
- Long-form text
- Explanatory content

For example, the label `Last updated` should use Instrument Sans. Its corresponding value `2026-06-12 14:07 UTC` may use IBM Plex Mono.

### Numeric typography

Use Instrument Sans with tabular lining figures for quantitative values that need vertical or column alignment.

```css
.numeric,
.table-number,
.kpi-value,
.chart-value {
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums lining-nums;
}
```