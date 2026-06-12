# Data Visualization Guidelines

## Purpose

This file defines how data should be selected, encoded, displayed, and interacted with across charts, metrics, maps, and analytical dashboards.

It does not define raw color values. Those belong in `tokens/color.tokens.json`.

It does not define general application color usage. That belongs in `color-guidelines.md`.

It does not define ordinary page layout, spacing, borders, or elevation.

## Core principles

* Start with the question the visualization must answer.
* Choose the simplest representation that communicates the data accurately.
* Prefer clarity and comparability over novelty.
* Use restrained visual styling so the data remains dominant.
* Make important patterns visible without hiding context or uncertainty.
* Preserve consistent metric definitions, formatting, category order, and color meaning across related views.
* Use tables when a chart would reduce precision or add unnecessary interpretation.
* Do not communicate meaning through color alone.
* Every persistent dashboard should have a clear purpose, intended audience, and owner.

## Define the intent first

Before selecting a chart, identify:

1. The question being answered
2. The primary metric
3. The comparison or dimension
4. The relevant time period
5. The intended audience
6. The decision or action the result should support

Do not build dashboards by collecting unrelated metrics.

A visualization should support one primary analytical task:

* Identify a value
* Compare categories
* Rank items
* Show change over time
* Show part-to-whole composition
* Show a distribution
* Show a relationship
* Show progress toward a target
* Locate an anomaly
* Explore underlying records

If the task is unclear, use a table or request clarification rather than choosing a decorative chart.

## Chart selection

### Single value

Use a KPI or metric card for one important value.

Include context where relevant:

* Time period
* Comparison period
* Target
* Previous value
* Unit
* Data freshness

Do not show a delta without identifying its comparison period.

Do not place many equally prominent KPI cards on one screen. Establish primary and supporting metrics.

### Table

Use a table when users need to:

* Read exact values
* Compare many attributes
* Sort or filter records
* Inspect identifiers
* Find individual rows
* Export or act on underlying data

Prefer a table when there are too many categories or series for a chart to remain legible.

Conditional formatting should support scanning, not turn every cell into a visual alert.

### Bar chart

Use a bar chart for:

* Comparing categories
* Ranking items
* Showing discrete quantities
* Comparing a small number of groups

Use horizontal bars when category labels are long or when there are many categories.

Sort ranked values by magnitude unless the categories have a meaningful natural order.

Bar charts should normally begin at zero. Do not truncate the quantitative axis in a way that exaggerates differences.

Do not use rounded, cylindrical, three-dimensional, or pictorial bars.

### Line chart

Use a line chart for:

* Time series
* Ordered progression
* Trends
* Rates changing over time
* Comparing a small number of related series

Time must run chronologically from left to right.

Do not use a line chart for unordered categories.

A line-chart axis does not always need to begin at zero, but the visible range must not distort the trend. Use a clear baseline, reference line, or annotation when the chosen range could be misread.

Avoid showing more series than users can distinguish. Move secondary series behind a filter, selector, or small-multiple view.

### Area chart

Use an area chart only when the filled magnitude is meaningful.

Suitable uses include:

* Total volume over time
* Part-to-whole change over time
* A bounded range or confidence interval

Do not use overlapping opaque areas.

Do not use area fills merely to make a line chart appear richer.

### Stacked bar or area chart

Use stacking when both total and composition matter.

Use a regular stack when absolute totals matter.

Use a 100% stack when proportional composition matters.

Keep category order consistent across the chart.

Avoid stacking many segments. Small middle segments are difficult to compare.

Do not use stacking when precise comparison between every series is the main task.

### Scatter plot

Use a scatter plot for:

* Relationships between two quantitative variables
* Correlation
* Clusters
* Outliers
* Distribution across two dimensions

Label or expose the identity of individual points through interaction.

Do not imply causation from correlation.

Use a trend line only when it supports the question and its meaning is clear.

### Histogram

Use a histogram for the distribution of one continuous measure.

Use meaningful and consistent bins.

Do not treat a histogram as a categorical bar chart. The bars represent continuous intervals and should touch.

Avoid choosing bins solely to create a more dramatic pattern.

### Heatmap

Use a heatmap when magnitude must be compared across two dimensions or across a dense matrix.

Suitable uses include:

* Cohort retention
* Time-of-day patterns
* Correlation matrices
* Geographic or grid intensity
* Conditional table patterns

Use a sequential scale for magnitude and a diverging scale only when a meaningful midpoint exists.

Provide exact values through labels or tooltips when precision matters.

### Pie and donut chart

Use pie or donut charts rarely.

They are acceptable only when:

* The values form one meaningful whole
* There are few categories
* Approximate proportion is more important than precise comparison
* Negative values are not present
* Categories do not overlap

Prefer a bar chart when there are more than approximately five categories, when values are similar, or when ranking matters.

Do not use multiple pies to compare change over time.

Do not use exploded slices, three-dimensional effects, or excessive labels.

### Funnel

Use a funnel only for a real ordered process in which items move through defined stages.

Show both counts and conversion rates where useful.

Do not infer a funnel from any descending sequence.

Do not use decorative funnel shapes that make area appear proportional when it is not.

### Map

Use a map only when geography is part of the analytical question.

Do not use a map as a decorative alternative to a ranked table or bar chart.

Use geographic areas for normalized rates or percentages where possible. Raw totals can make large or populous regions appear more important by default.

Provide an accessible table or list alternative for important values.

## Color roles

Data-visualization colors are separate from ordinary interface colors.

Use color to communicate:

* Series identity
* Category membership
* Magnitude
* Direction around a meaningful midpoint
* Selection
* Highlight
* Threshold or semantic state

Do not color every visual element.

Grid lines, axes, inactive series, reference ranges, and contextual data should normally use Zinc-derived neutral tokens.

## Brand blue

Use Statista blue, `#0666E5`, for the primary or selected analytical focus.

Suitable uses include:

* The main series
* The selected series
* The series currently discussed
* The user's organization or dataset
* Selected points or regions
* Interactive highlights

Do not use brand blue for every series.

When one series is highlighted, reduce the emphasis of contextual series rather than increasing saturation everywhere.

Brand blue in charts must use data-visualization semantic tokens rather than ordinary button or link tokens.

## Categorical color

Use categorical colors for distinct groups with no inherent order.

* Keep the number of simultaneous colors limited.
* Use colors that are distinguishable in both light and dark modes.
* Assign the same category the same color across related views.
* Keep the category order stable across charts and legends.
* Prefer direct labels when space allows.
* Group minor categories into `Other` rather than creating an unlimited palette.
* Use a neutral treatment for secondary or unselected categories.

Do not use different shades of the same blue for unrelated categories unless the categories form an ordered sequence.

Avoid assigning Emerald, Amber, or Red to neutral categories when users could interpret them as success, warning, or danger.

## Sequential color

Use a sequential scale for values that increase from low to high.

Suitable uses include:

* Volume
* Density
* Intensity
* Percentile
* Frequency
* Geographic magnitude

Use changes in lightness as the primary signal.

Ensure adjacent steps are distinguishable without creating abrupt false boundaries.

Do not use a rainbow palette for ordered quantitative values.

## Diverging color

Use a diverging scale only when the data has a meaningful midpoint, such as:

* Zero
* Target
* Baseline
* Average
* Previous period
* Expected value

Use a restrained neutral near the midpoint and stronger color toward both ends.

The two directions must reflect domain meaning.

Do not assume one side is good and the other is bad unless that interpretation is true.

Do not use a diverging palette when the midpoint is arbitrary.

## Semantic color in data

Use Emerald, Amber, and Red only when the data genuinely represents success, warning, or danger.

Do not automatically encode:

* Increase as success
* Decrease as danger
* High as good
* Low as bad
* Positive numbers as Emerald
* Negative numbers as Red

Meaning must come from the metric and domain.

When semantic color is used, also provide text, labels, symbols, position, or another non-color cue.

## Emphasis and comparison

A chart should have a clear visual hierarchy.

Use:

* Strong brand blue for the primary focus
* Restrained categorical colors for active comparisons
* Zinc neutrals for context
* Lower emphasis for historical, inactive, or background series
* A distinct line style or annotation for forecasts and targets

Do not make every series equally saturated.

Do not use opacity so low that data becomes unreadable.

Do not use glow, gradients, shadows, or three-dimensional effects as series emphasis.

## Labels and legends

Prefer direct labels when they reduce lookup effort and do not create clutter.

Use legends when:

* Direct labels do not fit
* Series remain visible throughout the chart
* The mapping is stable and easy to scan

Keep legend order consistent with visual order.

Use human-readable names rather than database field names.

Include units in the axis, title, label, or tooltip. Do not make users infer them.

Avoid repeating the same unit on every label when it can be stated once clearly.

Do not rotate labels unless shortening, wrapping, or changing the chart orientation would be worse.

Do not truncate category names that carry the primary meaning of the visualization.

## Numbers and formatting

Use formatting consistently across related views.

* Use tabular lining figures where numerical alignment matters.
* Use Instrument Sans for ordinary chart values.
* Use IBM Plex Mono only for fixed-format values, identifiers, or character-level alignment.
* Use consistent decimal precision.
* Preserve meaningful small differences.
* Abbreviate large values when it improves scanning.
* Expose the precise value in a tooltip or detailed view.
* Use locale-aware separators and formats.
* Distinguish percentages from percentage-point change.
* Display units and currencies explicitly.

Do not show more precision than the source data supports.

Do not mix abbreviated and full values on the same axis without a clear reason.

## Axes and scales

* Label axes when the measure or unit is not obvious.
* Keep time axes chronological.
* Keep categorical ordering meaningful and stable.
* Use linear scales by default.
* Use logarithmic scales only when the range requires them and the audience can interpret them.
* Clearly label logarithmic scales.
* Use zero baselines for bars and area comparisons where length or area encodes magnitude.
* Add reference lines only when they communicate a meaningful target, baseline, or threshold.
* Keep grid lines subtle and subordinate to the data.

Avoid dual-axis charts.

Use a dual axis only when the measures are directly related, the scales are clearly labeled, and no clearer alternative exists. Prefer separate aligned charts, indexed values, or a shared normalized scale.

Do not manipulate the axis range to manufacture a stronger story.

## Titles and annotations

Chart titles should state the subject clearly.

Prefer titles that identify:

* Metric
* Dimension
* Time period
* Relevant filter or cohort

Use a short subtitle or annotation for necessary context, methodology, or comparison.

Annotations should explain meaningful events, anomalies, targets, or changes.

Do not annotate every data point.

Do not use vague titles such as `Overview`, `Performance`, or `Chart 1` when a specific title is possible.

When a conclusion is stated in the title, it must be directly supported by the displayed data.

## Interaction

Interactive charts should support investigation without hiding essential meaning.

Useful interactions include:

* Tooltip details
* Highlighting
* Filtering
* Series toggling
* Zooming
* Brushing
* Comparing periods
* Drilling into underlying records
* Opening the source table

Every interactive state must be keyboard accessible where practical.

Do not require hover to access essential information.

Preserve the user's filters, time range, and comparison context when drilling down.

Make it easy to return from detail to overview.

Do not animate data in a way that delays comparison or causes values to move unnecessarily.

## Tooltips

Tooltips should provide detail, not repeat the entire chart.

Include only relevant information:

* Category or timestamp
* Exact value
* Unit
* Comparison or delta
* Series name
* Useful context

Use the same formatting and category names as the chart.

Keep tooltips stable enough to scan.

Do not obscure the point being inspected when placement can be adjusted.

Do not place controls or essential actions inside hover-only tooltips.

## Dashboard composition

Design the dashboard around its audience and decision cadence.

* Strategic dashboards should emphasize a small number of durable trends.
* Operational dashboards may be denser and should surface anomalies and actionable details.
* Frequently used dashboards may prioritize speed and scanning.
* Infrequently viewed dashboards need more context, definitions, and annotations.

Place the most important metric or question first.

Group related visualizations.

Use consistent time ranges and filters across a section unless differences are clearly labeled.

Avoid repeating the same metric in several chart forms without a clear analytical reason.

Prefer a short, trusted dashboard over a large collection of low-value charts.

## KPI cards

Use KPI cards as entry points, not isolated decoration.

A KPI should identify:

* The metric
* The current value
* The relevant time period
* The unit
* The comparison or target, when applicable

Use a sparkline only when the trend adds information.

Do not place a sparkline behind a number as decoration.

Do not use semantic colors for a delta unless the direction has a known positive or negative meaning.

## Tables and charts together

Charts and tables serve different tasks and may be paired.

Use the chart for pattern recognition and the table for:

* Exact values
* Detailed comparison
* Sorting
* Filtering
* Record-level exploration
* Export

The chart and table must share:

* Metric definitions
* Filters
* Time range
* Category naming
* Number formatting

Do not allow the chart and table to silently aggregate data differently.

## Empty, loading, and error states

A visualization must distinguish between:

* Loading
* No results
* All values are zero
* Missing data
* Filtered-out data
* Query or data-source error
* Insufficient permissions

Do not display an empty chart frame when there is no data.

Do not interpret missing values as zero unless the data model explicitly defines them that way.

Explain how users can recover when a filter, query, permission, or connection caused the state.

## Uncertainty and data quality

Show uncertainty when it materially affects interpretation.

Suitable methods include:

* Confidence intervals
* Forecast bands
* Error bars
* Ranges
* Quality indicators
* Data freshness labels
* Methodology notes

Visually distinguish observed, estimated, forecast, and incomplete values.

Do not present estimates with false precision.

Do not hide data-quality warnings because they make the chart less visually clean.

## Accessibility

Visualizations must remain understandable without relying on color alone.

Use combinations of:

* Direct labels
* Shapes
* Line styles
* Patterns
* Position
* Icons
* Text annotations

Ensure text, controls, and essential graphical objects have sufficient contrast.

Provide a meaningful accessible name and summary.

Provide an accessible table or equivalent text representation when the chart contains important values that cannot be understood otherwise.

Respect reduced-motion preferences.

Do not animate continuously unless the animation communicates an active process.

## Dark mode

Use the same semantic visualization roles in dark mode with independently tuned values.

* Keep chart surfaces aligned with the application surface hierarchy.
* Use restrained grid lines and axes.
* Tune series colors so they remain distinguishable without appearing neon.
* Keep brand blue prominent but controlled.
* Use lighter neutral series for context where dark neutral lines would disappear.
* Preserve categorical identity across themes.
* Do not change a category's meaning between light and dark mode.

Do not mechanically invert colors.

Do not use outer glows to separate series from the background.

## Automated and LLM-generated visualizations

When generating a visualization automatically:

1. Infer the user's analytical intent.
2. Classify fields as temporal, categorical, quantitative, ordinal, or identifier.
3. Identify metric, dimension, aggregation, filters, and time range.
4. Check category cardinality and missing values.
5. Select the simplest valid representation.
6. Apply meaningful ordering and number formatting.
7. State important assumptions.
8. Allow the user to change the chart type, axes, aggregation, or time granularity.
9. Fall back to a table when no chart remains clear.

Identifiers must not be treated as quantitative measures or chart axes merely because they are numeric.

Automation should provide a strong default, not remove user control.

For saved or high-stakes dashboards, generated configurations must be reviewable before they become authoritative.

## Prohibited patterns

Do not:

* Choose a chart before identifying the question
* Use a chart when a table is clearer
* Add charts only to fill dashboard space
* Use three-dimensional charts
* Use decorative gradients or glows
* Use excessive rounded bars or oversized points
* Use rainbow scales for ordered data
* Use color without semantic purpose
* Use semantic status colors for neutral categories
* Show too many simultaneous series
* Hide important values behind hover only
* Use unlabeled dual axes
* Truncate axes to exaggerate differences
* Sort time alphabetically
* Treat missing values as zero without justification
* Show false precision
* Use pie charts for complex comparison
* Use maps when geography is irrelevant
* Animate charts continuously
* Allow chart styling to compete with the data

## Decision rule

Before adding or changing a visualization, verify:

1. What exact question does it answer?
2. Is a chart more useful than a table or single value?
3. Is the chosen encoding accurate for the data type?
4. Is the primary comparison immediately visible?
5. Are ordering, scale, units, and time range clear?
6. Does color have a defined meaning?
7. Can the result be understood without color or hover?
8. Can users inspect the underlying data?
9. Does the visualization remain legible in light and dark mode?
10. Is every visible element necessary?

If these questions do not have clear answers, simplify the visualization.
::: 
