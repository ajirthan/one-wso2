// PROTOTYPE (branch prototype/mis-look) — throwaway, never merge.
//
// The source app's look (apps/mis `theme.css`, `TableNavigation.css`,
// `FilterBar.css`, `DataGrid.css`), written as Oxygen theme tokens. This file
// doubles as the TOKEN MAPPING the handoff asks for: every colour, radius and
// weight the real implementation should use is named here once, with the
// source value it stands in for, and the few places no token exists are marked
// `NO TOKEN`.
//
//   source                         token here
//   ------------------------------ ----------------------------------------------
//   --primary-500 #ff7800 fills    primary.main                 (shell's orange)
//   --text-brand  #c2410c text     primary.dark in light, primary.main in dark
//   --primary-50  #fff7ed hover    rgba(primary.mainChannel / .06)
//   rgba(primary, .12) selected    rgba(primary.mainChannel / .12)
//   --primary-300 hover border     primary.light
//   --secondary-50 #f8fafc slate   NO TOKEN — grey.50 light / action.hover dark
//   --secondary-200 #e2e8f0 border divider
//   --secondary-600 #475569 text   text.secondary (NB: Oxygen's text.secondary
//                                  equals text.primary in both shipped themes,
//                                  so "slate for structure" has no tonal step)
//   --bg-primary #fff surfaces     background.paper (translucent in Oxygen;
//                                  composited opaquely where a cell is sticky)
//   --radius-sm/md/lg 4/8/12px     literal px — shape.borderRadius is 12 or 20
//                                  in the shipped themes, so the source radii
//                                  are NOT derivable from the shape token
//   --shadow-sm/md                 theme.shadows[1] / theme.shadows[3]
//   Inter                          typography.fontFamily (already Inter Variable)

import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";

/** `var(--oxygen-palette-…)` — the shell's CSS-variable prefix. */
export const cssVar = (path: string) => `var(--oxygen-palette-${path})`;

/** The primary at an alpha, scheme-aware: tints the shell's orange, never #ff7800. */
export const primaryTint = (alpha: number) =>
  `rgba(${cssVar("primary-mainChannel")} / ${alpha})`;

/**
 * Orange TEXT, contrast-safe: `primary.dark` on light surfaces (what the a11y
 * overlay already does for outlined primary chips and buttons), `primary.main`
 * in dark mode where the orange clears AA on its own.
 */
export const brandText = (theme: Theme) => ({
  color: cssVar("primary-main"),
  ...theme.applyStyles("light", { color: cssVar("primary-dark") }),
});

/** The source's slate fill for structure (section rows, pill rests). NO TOKEN. */
export const slateFill = (theme: Theme) => ({
  backgroundColor: cssVar("action-hover"),
  ...theme.applyStyles("light", { backgroundColor: cssVar("grey-50") }),
});

/** The orange gradient the source paints a grand total with. */
export const primaryGradient = `linear-gradient(135deg, ${cssVar("primary-main")}, ${cssVar("primary-dark")})`;

/** Source radii, as literals — see the header note. */
export const RADIUS = { sm: "4px", md: "8px", lg: "12px", pill: "999px" } as const;

// ---- Period segments (SegmentedFilter.js) ------------------------------------

export const periodSegmentSx = (pressed: boolean) => (theme: Theme) => ({
  height: 32,
  px: "12px",
  minWidth: 96,
  borderRadius: RADIUS.md,
  border: "1px solid",
  borderColor: pressed ? cssVar("primary-main") : cssVar("divider"),
  backgroundColor: pressed ? primaryTint(0.12) : "transparent",
  color: pressed ? cssVar("text-primary") : cssVar("text-secondary"),
  fontFamily: "inherit",
  fontSize: 12.5,
  fontWeight: pressed ? 700 : 500,
  whiteSpace: "nowrap",
  transition: "all 150ms ease-in-out",
  "&:hover": {
    borderColor: cssVar("primary-main"),
    backgroundColor: pressed ? primaryTint(0.18) : primaryTint(0.08),
    color: cssVar("text-primary"),
  },
  "&.Mui-focusVisible": { outline: `2px solid ${cssVar("primary-main")}`, outlineOffset: 2 },
  ...theme.applyStyles("dark", {
    borderColor: pressed ? cssVar("primary-main") : "rgba(255,255,255,0.18)",
  }),
});

// ---- Table tabs (TableNavigation.css .table-nav-tab) ---------------------------

export const underlineTabRowSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  gap: 0.5,
  borderBottom: "1px solid",
  borderColor: "divider",
  mb: 1.5,
};

export const underlineTabSx = (active: boolean) => (theme: Theme) => ({
  background: "transparent",
  border: "none",
  borderBottom: "3px solid transparent",
  borderBottomColor: active ? cssVar("primary-main") : "transparent",
  borderRadius: `${RADIUS.sm} ${RADIUS.sm} 0 0`,
  px: "10px",
  py: "14px",
  fontFamily: "inherit",
  fontSize: "0.875rem",
  fontWeight: 600,
  lineHeight: 1,
  color: active ? cssVar("text-primary") : cssVar("text-secondary"),
  // Oxygen's text.secondary equals text.primary, so the resting tab needs the
  // step the source gets for free: opacity stands in for the slate 600.
  opacity: active ? 1 : 0.72,
  transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    ...brandText(theme),
    opacity: 1,
    borderBottomColor: active ? cssVar("primary-main") : cssVar("primary-light"),
  },
  "&.Mui-focusVisible": { outline: `2px solid ${cssVar("primary-main")}`, outlineOffset: 2 },
});

// ---- Unit pills (TableNavigation.css .table-nav-subtab) -----------------------

export const unitPillSx = (active: boolean) => (theme: Theme) => ({
  height: 28,
  px: "12px",
  borderRadius: RADIUS.pill,
  border: "1px solid",
  borderColor: active ? cssVar("primary-main") : cssVar("divider"),
  backgroundColor: active ? primaryTint(0.12) : "transparent",
  color: cssVar("text-primary"),
  opacity: active ? 1 : 0.78,
  fontFamily: "inherit",
  fontSize: "0.8125rem",
  fontWeight: active ? 700 : 500,
  whiteSpace: "nowrap",
  transition: "all 150ms ease-in-out",
  "&:hover": {
    opacity: 1,
    borderColor: cssVar("primary-light"),
    backgroundColor: active ? primaryTint(0.16) : primaryTint(0.06),
  },
  "&.Mui-focusVisible": { outline: `2px solid ${cssVar("primary-main")}`, outlineOffset: 2 },
  ...theme.applyStyles("dark", {
    borderColor: active ? cssVar("primary-main") : "rgba(255,255,255,0.18)",
  }),
});

// ---- Filter card (FilterBar.css .filter-bar) -----------------------------------

/** The white→slate gradient card, light border, 12px radius, soft shadow. */
export const gradientCardSx = (theme: Theme) => ({
  p: 1.5,
  borderRadius: RADIUS.lg,
  border: "1px solid",
  borderColor: cssVar("divider"),
  background: `linear-gradient(180deg, ${cssVar("background-paper")}, ${cssVar("grey-50")})`,
  boxShadow: "0 6px 16px -10px rgba(15, 23, 42, 0.28)",
  ...theme.applyStyles("dark", {
    background: `linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
    boxShadow: "none",
  }),
});

/** The source's text button: uppercase 12px/700, letter-spacing .35px, 8px radius. */
export const faithfulTextButtonSx = (theme: Theme) => ({
  textTransform: "uppercase",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.35px",
  borderRadius: RADIUS.md,
  px: "10px",
  py: "6px",
  color: cssVar("text-secondary"),
  opacity: 0.85,
  "&:hover": { ...brandText(theme), opacity: 1, backgroundColor: primaryTint(0.08) },
});

/** The source's Apply: filled primary, uppercase 12px/600, 4px radius. */
export const faithfulApplySx = {
  textTransform: "uppercase",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.5px",
  borderRadius: RADIUS.sm,
  px: 1,
  py: "4px",
  boxShadow: 1,
  "&:not(:disabled)": { background: cssVar("primary-main"), color: cssVar("primary-contrastText") },
  "&:hover:not(:disabled)": { background: cssVar("primary-dark"), boxShadow: 3 },
} as const;

/** The source's outlined button: primary border, brand text, uppercase 12px/700, 8px radius. */
export const faithfulOutlinedSx = (theme: Theme) => ({
  textTransform: "uppercase",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.35px",
  borderRadius: RADIUS.md,
  px: "10px",
  py: "5px",
  borderColor: cssVar("primary-main"),
  ...brandText(theme),
  "&:hover": { backgroundColor: primaryTint(0.12), borderColor: cssVar("primary-dark") },
});

/** Applied-filter chips: primary tint, brand text, 700. */
export const faithfulChipSx = (theme: Theme) => ({
  height: 24,
  fontSize: 12,
  fontWeight: 700,
  backgroundColor: primaryTint(0.12),
  border: `1px solid ${primaryTint(0.24)}`,
  ...brandText(theme),
  "& .MuiChip-deleteIcon": { color: "inherit", opacity: 0.7, "&:hover": { opacity: 1 } },
});

// ---- Per-grid header (DataGrid.css .data-grid-header) --------------------------

export const gridHeaderBarSx = (theme: Theme) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1.5,
  px: 2,
  py: 1,
  backgroundColor: cssVar("background-paper"),
  borderBottom: "1px solid",
  borderColor: cssVar("divider"),
  boxShadow: theme.shadows[1],
});

/** The Table title: 1.375rem/400, -0.025em, brand text. */
export const gridTitleSx = (theme: Theme) => ({
  m: 0,
  fontSize: "1.375rem",
  fontWeight: 400,
  letterSpacing: "-0.025em",
  lineHeight: 1.2,
  ...brandText(theme),
});

/** The source's Export: filled primary, uppercase 12px/600, 4px radius. */
export const faithfulExportSx = faithfulApplySx;

// ---- The grid (DataGrid.css AG Grid quartz overrides) --------------------------

export const faithfulGridFrameSx = (theme: Theme) => ({
  border: "1px solid",
  borderColor: cssVar("divider"),
  borderRadius: RADIUS.sm,
  overflow: "hidden",
  backgroundColor: cssVar("background-paper"),
  boxShadow: theme.shadows[3],
});

/** Header cell: white, 600, 0.875rem, no uppercase, light right rule. */
export const faithfulHeadCellSx = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "none",
  lineHeight: 1.3,
  py: 0.75,
  px: 1.25,
  color: "text.secondary",
  borderRight: "1px solid",
  borderRightColor: "divider",
} as const;

/** Section row label: 11px/700 uppercase, letter-spacing .4px, slate text. */
export const sectionLabelSx = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.4px",
  textTransform: "uppercase",
  color: "text.secondary",
  opacity: 0.85,
} as const;

/** A figure: 0.875rem/500, text.primary, tabular. */
export const faithfulNumericSx = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "text.primary",
  py: 0.5,
  px: 1.5,
} as const;

/** A row header: 0.875rem/500, text.primary, primary-200 right rule. */
export const faithfulRowLabelSx = {
  fontSize: "0.875rem",
  fontWeight: 500,
  py: 0.4,
  px: 1.5,
  borderRightColor: primaryTint(0.35),
} as const;

/** Grand total column (Customers' Total): orange gradient, white text, 700. */
export const grandTotalCellSx = {
  backgroundColor: "transparent",
  backgroundImage: primaryGradient,
  color: cssVar("primary-contrastText"),
  fontWeight: 700,
} as const;
