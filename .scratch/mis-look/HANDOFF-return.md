# Handoff back: Finance MIS look prototype (One WSO2)

Written 2026-10-05 from the prototype detour that `/tmp/handoff-mis-look-prototype.md` opened; **resumed and refreshed 2026-10-07** (see "Resumed" below). The prototype is **built, on fixtures, and screenshotted in all three variants, light and dark, at `HEAD` (`96479ab9`)**. **The verdict is in: A — Faithful**, with the tables brought to the standalone's measured geometry the same day (see "Finance's verdict" and "Table parity pass"). The detour is closed; the originating session can `/to-spec`.

## Resumed 2026-10-07

The branch is unchanged (`df26f950`); the deliverable was refreshed:

- **All 31 screenshots were re-taken at `HEAD`.** The Oct 5 set was captured 14:29–15:00 while the fixes in `df26f950` were still being HMR'd in (committed 15:02), so it mixed pre- and post-fix states. Four frames were demonstrably stale: `A-4-analysis-dark` (DataGrid header caught as a loading skeleton), `C-1-build-dark` and `C-5-drilldown-export-dark` (Period/tab/pill controls caught in their dimmed loading state), and `A-2…GRADIENT-OPTION` (taken *before* the frozen-pane fix, so it still showed the smear the commit claims to fix). The new set is scripted and readiness-gated (rows present, no skeleton, resting tab opacity ≥ .72, menu open) so every frame shows the same settled state. The old set is kept beside it as `screenshots-2026-10-05-superseded/` and can be deleted.
- **A review sheet** was added: `.scratch/mis-look/review.html` lays the frames out per screen as A | B | C × light/dark, in the order to show Finance (1, 2, 4, then 3, 5), with a light-only / dark-only filter and the gradient option alongside screen 2. Open it from disk; it references `screenshots/` by relative path.
- The dev server was brought back up on port 3000 (see "Running it again"); SSO session held.
- Findings 10–12 below were added. **No code changed** in that pass.

**Later the same day**, the verdict came in (A, tables not yet matching) with the standalone's staging URL, which the browser's SSO opened. The standalone's Build, Customers, Region Summary, drill-down and Analysis were captured (`standalone/`), its tables were measured off the live DOM, and the faithful surface was corrected to them — see "Table parity pass" below and findings 13–20. Code changed on the branch in `BuildTable.tsx`, `buildTableSx.ts`, `arrBuildRows.ts`, `misLookTokens.ts`, `PrototypeGridHeader.tsx`, `misFixtureFetch.ts` and `MisArrBuildPage.tsx` (type-check and lint clean), committed as **`96479ab9`**. **All 31 frames were re-shot after that commit** (the three that the last two fixes — the Customers header rows and the fill-width — changed were shot after them; the Build, Region Summary, drill-down and Analysis frames predate those two fixes but are unaffected by them: their tables already stretched to the card). The set shot earlier that day, before the parity pass, is kept as `screenshots-2026-10-07-pre-parity/` and is the "before" column of the parity table below.

## Where everything is

| Thing | Path |
|---|---|
| Branch | `prototype/mis-look` in `/Users/ajirthan/Desktop/one-wso2-prototype-mis-look`, cut from `main` at `3b21f916` |
| Commits (primary source) | `936ddc0c` (the three variants, fixtures, anatomy) → `df26f950` (findings from the screenshot pass) → `96479ab9` (faithful grid parity pass, measured on mis-stg). Range: `3b21f916..96479ab9` |
| **Review sheet** (show Finance this) | `/Users/ajirthan/Desktop/one-wso2-prototype-mis-look/.scratch/mis-look/review.html` |
| Screenshots (not committed; `.scratch/` is excluded via `.git/info/exclude`) | `/Users/ajirthan/Desktop/one-wso2-prototype-mis-look/.scratch/mis-look/screenshots/` — 31 PNGs at `96479ab9`, 1280×1548, named `<Variant>-<screen>-<mode>.png`, plus `A-2-customers-totals-light-GRADIENT-OPTION.png`. Earlier sets: `…/screenshots-2026-10-07-pre-parity/` (same day, before the parity pass) and `…/screenshots-2026-10-05-superseded/` |
| **Standalone reference captures** (the real app, mis-stg, real data, light only) | `…/.scratch/mis-look/standalone/S-1-build-light.png`, `S-2-customers-totals-light.png`, `S-3-region-summary-light.png`, `S-4-analysis-light.png`, `S-5-drilldown-light.png` — same 1280×1548 framing; first column of `review.html` |
| Token mapping | `webapp/src/features/finance/mis/prototype/misLookTokens.ts` (header table + every sx recipe, with the source value each stands in for and `NO TOKEN` where none exists) |
| Variant definitions | `webapp/src/features/finance/mis/prototype/misLookPrototype.tsx` (`MIS_LOOKS`) |
| Fixture backend | `webapp/src/features/finance/mis/prototype/misFixtureFetch.ts` — dev-only `fetch` shim keyed on `https://mis-fixtures.prototype.invalid`, serving all ten ARR endpoints with seeded figures (Period labels are relative to today, so dates in the frames read `…/10/07`) |
| Local config (git-ignored, not committed) | `webapp/public/config.js` — copied from the main checkout, with `ONE_WSO2_MIS_ARR_BACKEND_URL` pointed at the fixture host and `mis: true` in the preview flags. Theme as the user has it: `acrylicOrange`. |

## Running it again

```bash
cd /Users/ajirthan/Desktop/one-wso2-prototype-mis-look/webapp
npm run dev          # must be port 3000: the Asgardeo callback is registered for http://localhost:3000 only
```

Port 3000 is normally held by the AR dashboard webapp (`pnpm run dev` in `digiops-finance/apps/ar-dashboard/webapp`). Stop that first; the Cursor browser holds an Asgardeo SSO session, so sign-in completes silently (it still did on 2026-10-07). A `127.0.0.1` callback is rejected by Asgardeo (`callback.not.match`) — tested. Vite binds `[::1]:3000` only; `localhost` resolves to it.

- `http://localhost:3000/finance/mis/arr-build?variant=A|B|C` — the floating bottom bar and ← / → also switch (but see finding 12: put the variant in the URL and load fresh when changing Tables)
- `…?variant=A&table=customers`, `…&table=region-summary`, `/finance/mis/analysis?variant=A`
- `…&gradient=1` — forces the orange grand-total gradient (see finding 1)
- Totals only / BU only are component state (click them); the Export ▾ menu is on every table, the drill-down and the Opportunities dialog
- Light/dark is Oxygen's toggle in the header; it persists as `localStorage["mui-mode"]`

## The screens

Per variant, each in light and dark (filenames `A-1-build-light.png` … `C-5-drilldown-export-dark.png`):

1. **Build** — Annually · BU Build · All · five Periods, full 34-row Build in one frame
2. **Customers** — BU only on, Totals only on, scrolled to the Period Totals (the deck-cropping case)
3. **Region Summary** — Exit ARR view, Sales Region cut
4. **ARR Analysis** — KPI tiles, Partner Type pie, vertical Industry bars with share labels, accounts grid
5. **Drill-down** — Opening ARR, first Period, with the **Export ▾** menu open (CSV · Excel · PDF)

What the three variants are, as built:

- **A — Faithful** (as of `96479ab9`): source segments (8px radius, primary border + 12% tint when pressed), 3px underline tabs, 999px Unit pills, white→slate gradient filter card with uppercase 12px buttons (filled Apply, outlined Clear All), one grid card (1px, 4px radius, shadow-md) whose head carries the Table title at 24px/600 in brand text over a 12px caption, a primary Checkbox for the Scale and the filled uppercase Export, and whose body is the measured AG-Quartz grid: 48px bold slate header, 42px rows, 44px section bands with the label at the foot, no vertical body rules, 6% primary hover, five bold rows at 600, Customers Total at 16px/700, Total column at weight 600 (no gradient). Before the parity pass it was the port's grid with the source's chrome; `screenshots-2026-10-07-pre-parity/` shows that state.
- **B — Shell-native**: Oxygen `ToggleButtonGroup` for Period and Units, Oxygen `Tabs`, `Paper variant="outlined"` card with Oxygen buttons, subtitle1 title, Checkbox Scale, contained Export, the port's current table (uppercase 11px headers, `action.hover` tints), outlined Analysis cards with the validated blue/orange chart palette.
- **C — Faithful on shell surfaces**: A's segments, tabs, pills, per-grid header and Export, on B's outlined card, Oxygen buttons and Oxygen table surface.

All three share the decided anatomy (D4/D11), sign-only negatives (D14), the ARR figure in brand text (D11), and the Export ▾ menu (D8).

## Finance's verdict

**A — Faithful, with the tables brought to the standalone's.** Given 2026-10-07 by Ajirthan Balasingham in the prototype session, in two steps: *"Faithful is okay. But, need to work on the tables because they aren't matching the standalone app yet."* — with the two URLs the comparison was then made against (`https://mis-stg.apps.wso2.com/`, `https://one-stg.wso2.com/finance/mis/arr-build`) — and, after the parity pass was shown, **confirmed: *"We can go ahead with 'Faithful'"***. **Confirm whether that is Finance's verdict relayed or Ajirthan's own**, and add the Finance reviewer's name if there is one; D1–D15 were not reopened by it. Nothing in A's chrome (segments, tabs, pills, filter card, Export) was objected to; the table is what the second pass below was about.

## Table parity pass (2026-10-07)

With the standalone reachable, the Build, Customers, Region Summary and drill-down tables were measured on `mis-stg` (computed styles off the live AG Grid, not the CSS files) and the faithful surface was corrected to them. What the source's table actually is:

| Measured on mis-stg | Value | Prototype A before | Now |
|---|---|---|---|
| Grid text colour (header, labels, figures) | `#475569` slate-600 everywhere | `text.primary` (near-black) | `slateText()` — NO TOKEN, literal in light, `grey.400` dark |
| Body row | 42px, 14px/400, 16px side padding, bottom rule only | ~30px, 14px/500 | 42px, 400, no vertical rules between figures |
| Header | 48px rows; 14px/**700** slate; Period label right-aligned, wrapping "2021/12/31 -" / "2022/10/07"; `#e2e8f0` rule between header cells. ONE row on the Build when a Period has one ARR type (the "ARR" label is not a column there); TWO on Customers under Totals only ("As of …" over "Total", a real column) | two rows (date + "ARR") everywhere, 13px/600 | Build: one row (`collapseLoneSubHeader`; the sub-row stays in the DOM hidden, so ids resolve). Customers: two rows. 700, wraps |
| Period column width | AG `flex`: the Period columns **fill the viewport**, so Totals only on Customers, scrolled to its end, shows Account Name + five wide Totals | fixed 150px; at the end of the scroll a sliver of Employee Count showed beside the Totals | each sub-column widened to its share of (card width − pinned width); the wide-table notice still compares the unwidened model width |
| Section band | 44px, `#f8fafc`, label 11px/700 uppercase .4px **at the foot**, no chevron, no indent on the rows under it | ~24px band with chevron; rows indented 18px | 44px, bottom-aligned label, no chevron/indent (sections stay open) |
| Bold rows | `.bold-row` = Opening ARR, Ending ARR, **Net New, Total New ARR, Total Churn ARR**; 600; **no rule above Ending ARR** | Opening/Ending only, 700, 2px rule above Ending | all five at 600 (`arrBuildRows.ts` now flags the three), no rule in A |
| Customers Total row | 16px/700 (`.total-row-bold`) | 14px/600 | 16px/700 via `emphasisStyle` |
| Region Summary total | 700 | 700 | unchanged |
| Grid card | ONE card: 1px `#e2e8f0`, **4px** radius, shadow `0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)`; header is its head | header bar with its own shadow + separately framed grid | one card (`gridHeaderBarSx` head, `faithfulGridFrameSx` body); `WideTableNotice` sits inside between them |
| Title / caption | 24px/600, -0.025em, `#c2410c` / 12px/500 `#6b778c` | 22px/400 / 12px `text.secondary` | 24px/600 / 12px/500 |
| Title text | `<unit> <category> Build` — "All **BU** Build" | "All Build" | "All BU Build" |
| Scale control | MUI **Checkbox** "Values in '000" | Switch | Checkbox (primary) |
| Drill-down affordance | none at rest (AG cell click) | dotted underline always | underline on hover / focus-visible only; the button stays for the keyboard |
| Customers Period header | "As of 2022/10/07" | "2021/12/31 - 2022/10/07" | "As of {end}" (prototype splits the label as the source's `toAsOfAnnualLabel` does; the real fix is off the range) |
| Percentages | API **strings** "31046.4%", "N/A" passed through | fixtures sent numbers → "16.84" | fixtures send the strings; `formatMisValue` already passes them through |
| Row hover | AG Quartz default `#2196f3` @ 12% (the orange-50 rule targets `.ag-theme-alpine`; the grid is Quartz — dead CSS) | primary 6% | kept primary 6% (D5); see finding 15 |

Reference captures of the standalone: `.scratch/mis-look/standalone/S-{1..5}-*.png` (light only — it has no dark scheme), and they are the first column of `review.html`.

**Not changed, flagged for the spec:** AG Grid pagination on Customers ("1 to 50 of 330 · Page 1 of 7", 48px footer) where the port lists every row; the column-menu filter icon in every header cell; the Customers hint line ("Hint: Click on an account under a specific date range to view opportunity details.", 15.2px brand text); the source's fixed-height grid with empty space below a short table (the port's is content-height, which is better); the "Swipe to view more" pill (D13 keeps `WideTableNotice`).

## Token mapping (for the winner — written for A; B and C are subsets)

| Source | Token | Where used |
|---|---|---|
| `--primary-500` `#ff7800` fills, borders | `primary.main` | tab underline, pill/segment border, Apply/Export fill, Switch, pie Channel slice, Industry bars |
| `--text-brand` `#c2410c` text | `primary.dark` in light, `primary.main` in dark (`brandText()` via `theme.applyStyles("light", …)`) | Table title, KPI ARR figure, BU only / Totals only labels, tab hover, Clear All |
| `--primary-50` `#fff7ed` row hover | `rgba(var(--oxygen-palette-primary-mainChannel) / .06)` composited opaquely (`opaqueTint`) | grid rows |
| `rgba(primary,.12)` pressed | `…mainChannel / .12` | pressed segment, selected pill, applied-filter chips, KPI icon well |
| `--primary-300` hover border | `primary.light` | tab hover underline, pill hover border |
| `--primary-200` row-header rule | `…mainChannel / .35` | frozen column right rule |
| `--secondary-50` `#f8fafc` slate band | **NO TOKEN** → `grey.50` light / `action.hover` dark (`slateFill()`) | section rows, gradient card's lower stop |
| `--secondary-200` `#e2e8f0` borders | `divider` | card, grid frame, header rules, segments at rest |
| `--secondary-600` `#475569` secondary text | **NO TOKEN** — Oxygen's `text.secondary` equals `text.primary` in both shipped themes. Tabs/pills carry the step as `opacity: .72/.78`; the GRID uses `slateText()`: literal `#475569` in light, `grey.400` in dark (measured: every header, label and figure on the source is this colour) | tabs, pills, every grid text |
| caption `#6b778c` | **NO TOKEN** → `slateMutedText()`: literal in light, `grey.500` dark | "All amounts in USD" |
| `--bg-primary` white surfaces | `background.paper` **composited over `background.default`** (paper is translucent — finding 2) | every table cell, grid header bar |
| `--radius-sm/md/lg` 4/8/12px | literal px (`RADIUS`) — `shape.borderRadius` is 12 (Acrylic) or 20 (WSO2), so the source radii are not derivable | Export/Apply 4px, **grid card 4px**, segments/buttons 8px, filter card 12px, pills 999px, Analysis cards 20px |
| `--shadow-md` `0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)` | literal (`cardShadow()`), dropped in dark; the filter card's `0 6px 16px -10px rgba(15,23,42,.28)` likewise | grid card, filter card |
| grid geometry | `GRID`: row 42px, header 48px, section band 44px, cell padding 16px — AG Quartz at 14px with grid size 8, measured | every table |
| Direct pie slice `#334155` | **NO TOKEN** → `grey.700` light / `grey.400` dark | Partner Type pie |
| Inter | already `typography.fontFamily` (Inter Variable) | — |
| weights | 700 grid headers and section labels; 400 figures and row labels; 600 Build bold rows and the grid title; 700 Customers Total (16px) and Region totals; 600 tabs; 700 pressed/active; 900 KPI figure | as the source, measured |

## What the prototype proved wrong or found

1. **The Customers grand-total gradient is dead CSS in the source.** `DataGrid.css` defines `.grand-total-cell` / `.grand-total-header` / `.software-cloud-grand-total-cell`, but no column definition in `tableConstants.js` / `tableUtils.js` ever applies them. The rendered Total column is `.total-cell`: weight 600, `--text-secondary`, orange-100 hover. A now renders that; the gradient is behind `&gradient=1` and one screenshot of it is kept (`…GRADIENT-OPTION.png`) so Finance can choose it deliberately rather than inherit it from a stylesheet. **Amend the A description in the spec.**
2. **Frozen panes smear on Oxygen surfaces.** `background.paper` is `#ffffffc5` light / `#00000026` dark (translucent); a sticky cell resting on it lets the scrolled columns show through — reproduced on the Customers table's Account Name column. Fix (in `buildTableSx.opaqueTint`, all variants): every cell composites paper as a gradient layer over opaque `background.default`. The port's shipped table has this bug today. (The 2026-10-07 `GRADIENT-OPTION` frame confirms the fix: no bleed-through.)
3. **`theme.palette.mode` is not the live scheme under Oxygen's CSS-variables theme** — it always reports `"light"`. The Industry chart's axis labels were invisible in dark mode until `useColorScheme()` replaced it (`useLiveMode` in `PrototypeAnalysisCharts.tsx`). **The port's existing `AnalysisIndustryChart` / `AnalysisPartnerModelChart` key `chartChrome` off `palette.mode` and have the same bug.**
4. **The `borderRight: 1` sx shorthand resets the side's colour to `currentColor`**, so the frozen column's rule painted white in dark mode. Fixed with an explicit `borderRightColor: "divider"` in `ROW_LABEL_CELL_SX` and `leadHeadCellSx` — also pre-existing in the port.
5. **Oxygen has no tonal step for structure**: `text.secondary === text.primary`, and there is no slate ramp. Opacity stands in for the resting tabs/pills; `grey.50` / `action.hover` for the section bands. Worth an upstream Oxygen question rather than a local palette.
6. **Totals only still needs a horizontal scroll on Customers at 1280px** — the 17 identity columns precede the Period Totals, so the deck crop is "frozen Account Name + scroll to the end", which is how screen 2 was captured. `WideTableNotice` (D13) is what tells the reader so.
7. **The MIS URL serializer replaces the query string wholesale** (`useUrlViewState.setView` navigates to `serialize(view)`; the Period control navigates to a bare path), so any param it does not own is dropped. Relevant to D11's "filters in the query string" on Analysis — the serializer there must preserve params it does not own. (Confirmed 2026-10-07 by instrumenting `history.replaceState`: the Customers tab writes `?table=customers` with no `variant`.)
8. **Asgardeo's callback is fixed to `http://localhost:3000`**; any other origin is rejected, so local work on this branch competes for 3000 with the AR dashboard dev server.
9. Dark mode otherwise held on tokens alone (D7): nothing needed a separate palette. The gradient card flattens to a 6%→2% white ramp with no shadow in dark.
10. **The Oct 5 screenshot set was partly pre-fix** (see "Resumed"). Lesson for the implementation tickets: take the deliverable screenshots *after* the last commit, with a readiness gate, not during the fixing pass.
11. **Capture caveats, for whoever re-shoots** (no product bug): (a) `Page.captureScreenshot` with `captureBeyondViewport: true` momentarily resizes the viewport, which drops the `position: fixed` switcher out of frame and makes the virtualised MUI X DataGrid re-measure mid-frame (blank header and rows) — use `false`; the clip already equals the emulated 1280×1548 viewport. (b) Under the `acrylicOrange` theme the DataGrid's sticky header carries `backdrop-filter: blur(10px)`, which CDP paints as a flat blank band although the pane shows it correctly; neutralise it on `.MuiDataGrid-columnHeaders` for the capture (over a dark page the blur contributes nothing visible). (c) A's dark Analysis frame still came out blank after a runtime light→dark toggle and only captured cleanly from a fresh load already in dark (`localStorage["mui-mode"]="dark"` before navigating). On screen, all of these render correctly.
12. **Prototype switcher snap-back** (prototype plumbing, not for the implementation): flip variants with the floating bar, then change Table, and the variant returns to the one the page loaded with. Reproduced at human speed; the `history` sequence is: bar → `?variant=B`; Customers tab → `setView` → `?table=customers` (finding 7); then `MisLookPrototypeProvider`'s URL-restoring effect writes `?table=customers&variant=A` while `sessionStorage` already holds `B`, i.e. it runs with a stale `key`. Only one provider is mounted. Workaround: put `?variant=` in the URL and load fresh when changing Tables (the review URLs do). The bar still works for flipping variants on the same Table.
13. **The staging standalone puts the filter card ABOVE the Table tabs** (Period row → filter card → tabs → Unit pills → grid header → grid), where D4 — written from reading the source — puts it below the pills. Either the deployed app differs from the checked-out source or the inventory misread the order; **D4's order needs confirming against the running app before `/to-spec`.** Not changed in the prototype (anatomy is decided; the user asked about tables).
14. **The staging ARR Analysis is not the one D11 describes.** mis-stg shows "ARR Breakdown — Partner model · outer ring by Region" (a nested donut: Channel/Direct inside, regions outside, "36% Channel" legend with amounts) and "ARR by Industry — Stacked by Region" (bars stacked by region with the industry share in the axis label), a filter panel with uppercase labels and an "N active" chip, an Account Performance Detail grid with COLUMNS / FILTER THESE ROWS / EXPORT and coloured product chips. D11 says Partner Type pie and single-hue vertical Industry bars. **Reconfirm D11 against the running app**; the prototype's Analysis was not touched today.
15. **The source's live row hover is AG Grid Quartz's default blue** (`color-mix(#2196f3 12%)`): `DataGrid.css`'s orange-50 hover targets `.ag-theme-alpine` and the grid is `ag-theme-quartz`, so it is dead CSS like the gradient (finding 1). The prototype keeps the primary 6% hover D5 implies; Finance should know the blue is an accident, not a choice.
16. **Totals only already exists on the source** (Customers and Region Summary both have it on mis-stg), so D9 is parity, not an addition.
17. **The ARR backend sends percentages as strings** ("31046.4%", "N/A") and both apps pass them through; the prototype's bare "16.84" was its own fixtures. Fixtures now send the strings. The spec need not define percentage formatting — the wire does.
18. **The staging rail has a fourth entry, "Top Line Analysis"** (`/finance-mis/top-line-analysis`), beside ARR Dashboard, ARR Analysis and Flash Dashboard. Out of D1's scope; noting it exists.
19. **Oxygen's `text.secondary === text.primary` bites hardest in the table**: every grid text on the source is slate-600, which has no token (finding 5). The prototype uses a literal `#475569` in light and `grey.400` in dark. The real implementation should either add a slate step to the Finance theme or accept the literal — a decision for the spec.
20. **One card, not two.** The source's grid header and grid are one `.data-grid-container` (4px radius, shadow-md). Rendering them as siblings — the page owns the header, `BuildTable` owns the grid — meant styling the header as the card's head and the frame as its body, with `WideTableNotice` between them inside the card. The implementation would do better to give `BuildTable` (or a wrapper) the header slot so the card is one element.
21. **Period columns must fill the viewport, not just meet a minimum.** AG Grid's `flex` sizes the source's Period columns to the space left after the pinned column, so a Customers table under Totals only ends in five wide Totals. The port's fixed 150px columns left a sliver of the last identity column (Employee Count) between Account Name and the Totals at the end of the scroll — visible in exactly the deck-crop frame (screen 2). The prototype measures the card and widens each sub-column to its share (`useMeasuredValue` on the frame; `tableMinWidth` of the widened model drives the table, the unwidened one still drives the notice). A parity item for the spec; the shipped `BuildTable` has the sliver today.
22. **`theme.applyStyles("light", …)` outranks a plain `color`.** Once `slateText()` set the grid's light colour that way, the gradient option's white (`grandTotalCellSx`) lost to it and the Total column read slate-on-orange. Any later colour on a cell that also carries `slateText` has to be declared under `applyStyles` too. Small, but it will recur wherever the implementation layers a state colour over the slate.

## Deviations from the original plan, stated

- Variant A's grand total is weight 600, not the gradient (finding 1).
- `MAX_BODY_HEIGHT` was raised 560 → 900 so a full Build fits one frame; a shipped value is a separate decision.
- `MisSegmentedControl` (View / Region Type / Breakdown) follows the variant too: A and C render the source's uppercase-labelled segments, B keeps Oxygen's toggle group.
- The rail's three Build rows collapsed to one "ARR Dashboard" row (D3) so the label reads right in screenshots; the three routes and gate ids are unchanged.
- The 50 failing page tests on the branch are the moved/renamed controls, not runtime errors (63 still pass); the prototype rule is no tests.

## Open items only the user can supply

- The **Finance reviewer's name**, and whether the verdict above is Finance's relayed or Ajirthan's own.
- ~~Production screenshots of the standalone app~~ — **done from staging** (`standalone/S-1…S-5`, real data, light only; the standalone has no dark scheme). Production captures are only needed if production differs from mis-stg.

## Suggested next step for the originating session

The verdict is confirmed (A — Faithful) and the tables match the standalone's measured geometry; the detour is closed. Before `/to-spec`, confirm D4's order and D11's charts against mis-stg (findings 13–14 — the running app disagrees with the checked-out source on both). Then `/to-spec` with findings 1–4 and 15–22 folded in as decisions, findings 3–4 as fixes to the port needed regardless of the look, finding 7 as a constraint on D11's URL contract, and the "not changed, flagged" list above as parity items to decide. The branch `prototype/mis-look` (`3b21f916..96479ab9`) is the primary source the implementation issue should point at; it is never merged.
