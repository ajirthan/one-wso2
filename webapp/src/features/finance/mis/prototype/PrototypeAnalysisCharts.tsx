// PROTOTYPE (branch prototype/mis-look) — throwaway, never merge.
//
// D11, the ARR Analysis anatomy: KPI tiles (the ARR figure in brand text, plus
// Logo Count), a Partner Type PIE, and VERTICAL Industry bars with share labels
// — the source's forms (`ArrAnalysisDashboard.js`), on recharts rather than MUI
// X (D2). The data shaping is the port's own (`analysisBreakdowns.ts`); only the
// rendering is new here. Degraded states keep the port's sentences (D15).
//
//   A, C  the source's chrome: 20px cards with the slate border and soft
//         shadow, Channel in primary / Direct in slate, orange bars with the
//         share printed on the bar
//   B     Oxygen: outlined Cards, the validated chart palette (blue/orange)

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Box,
  Card,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useColorScheme,
  useTheme,
} from "@wso2/oxygen-ui";
import { TrendingUpIcon } from "@wso2/oxygen-ui-icons-react";
import ErrorNotice from "@components/error-notice/ErrorNotice";
import { CHART_SERIES_1, CHART_SERIES_2, chartChrome, seriesColor } from "@components/charts/chartPalette";
import { MIS_VALUE_TYPES, formatMisValue, misHeadlineAmount } from "../util/misMoney";
import type { MisScale } from "../util/misViewVocabulary";
import { industrySeries, partnerModelSlices, type PartnerModelSlice } from "../components/analysisBreakdowns";
import type { IndustryBreakdown, PartnerModelBreakdown } from "../api/useAnalysisBreakdowns";
import { useMisLook } from "./misLookPrototype";
import { brandText, cssVar, primaryTint } from "./misLookTokens";

/**
 * The LIVE colour scheme. FINDING: under Oxygen's CSS-variables theme
 * `theme.palette.mode` always reports the default scheme ("light"), so a chart
 * that keys its tick colours off it paints light-mode chrome on a dark page —
 * which is what the port's Analysis charts do today. `useColorScheme` is the
 * resolved answer, "system" included.
 */
function useLiveMode(): "light" | "dark" {
  const { mode, systemMode } = useColorScheme();
  const resolved = mode === "system" ? systemMode : mode;
  return resolved === "dark" ? "dark" : "light";
}

// ---- the card every piece sits in --------------------------------------------

function AnalysisCard({ children, sx }: { children: React.ReactNode; sx?: object }) {
  const look = useMisLook();
  if (look.gridHeader === "oxygen") {
    return (
      <Card variant="outlined" sx={{ p: 2, ...sx }}>
        {children}
      </Card>
    );
  }
  // The source's analysis card: 20px radius, slate hairline, soft lifted shadow.
  return (
    <Box
      sx={[
        {
          p: 2,
          borderRadius: "20px",
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 12px 24px -18px rgba(15,23,42,0.56), 0 2px 8px rgba(15,23,42,0.08)",
        },
        (theme) => theme.applyStyles("dark", { boxShadow: "none" }),
        sx ?? {},
      ]}
    >
      {children}
    </Box>
  );
}

const TITLE_SX = { fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 11 } as const;

// ---- KPI tiles -----------------------------------------------------------------

export function PrototypeKpiTiles({
  asOfLabel,
  arr,
  isLoading,
  isError,
  errorMessage,
  retry,
  logoCount,
  logosLoading,
}: {
  asOfLabel: string;
  arr?: number;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  retry: () => void;
  logoCount: number;
  logosLoading: boolean;
}) {
  const look = useMisLook();
  const faithful = look.gridHeader === "brand";
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        mb: 2,
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 0.9fr) minmax(0, 1.3fr)" },
      }}
    >
      <AnalysisCard>
        <Typography variant="overline" color="text.secondary" sx={TITLE_SX}>
          ARR as of {asOfLabel}
        </Typography>
        {isError ? (
          <ErrorNotice onRetry={retry} sx={{ mt: 1 }}>
            Couldn&apos;t load this figure. {errorMessage}
          </ErrorNotice>
        ) : isLoading ? (
          <Skeleton variant="text" width={180} height={56} />
        ) : (
          <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mt: 0.5 }}>
            {/* A HEADLINE: compact, in dollars, never scaled. Brand text per D5/D11. */}
            <Typography
              component="div"
              sx={[{ fontWeight: faithful ? 900 : 700, fontSize: { xs: "1.9rem", md: "2.3rem" }, lineHeight: 1.1 }, brandText]}
            >
              {arr == null ? "—" : misHeadlineAmount(arr)}
            </Typography>
            {faithful && (
              <Box
                aria-hidden
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  display: "grid",
                  placeItems: "center",
                  color: "primary.main",
                  background: `linear-gradient(135deg, ${primaryTint(0.22)}, ${primaryTint(0.08)})`,
                  border: `1px solid ${primaryTint(0.24)}`,
                }}
              >
                <TrendingUpIcon size={18} />
              </Box>
            )}
          </Stack>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Total annual recurring revenue across filtered accounts
        </Typography>
      </AnalysisCard>

      <AnalysisCard>
        <Typography variant="overline" color="text.secondary" sx={TITLE_SX}>
          Logo Count
        </Typography>
        {logosLoading ? (
          <Skeleton variant="text" width={90} height={56} />
        ) : (
          <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, mt: 0.5 }}>
            <Typography
              component="div"
              sx={{ fontWeight: faithful ? 900 : 700, fontSize: { xs: "1.9rem", md: "2.3rem" }, lineHeight: 1.1 }}
            >
              {formatMisValue(logoCount, MIS_VALUE_TYPES.COUNT)}
            </Typography>
            <Chip label="Live filtered" color="primary" size="small" variant="outlined" />
          </Stack>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Accounts in the table below, under the same filters
        </Typography>
      </AnalysisCard>
    </Box>
  );
}

// ---- Partner Type pie ----------------------------------------------------------

export function PrototypePartnerPie({ breakdown, scale }: { breakdown: PartnerModelBreakdown; scale: MisScale }) {
  const look = useMisLook();
  const theme = useTheme();
  const mode = useLiveMode();
  const faithful = look.gridHeader === "brand";

  const slices = partnerModelSlices({ channel: breakdown.channel, direct: breakdown.direct, asked: breakdown.asked });
  const unanswered =
    (breakdown.asked.has("Channel") && breakdown.channel == null) ||
    (breakdown.asked.has("Direct") && breakdown.direct == null);
  const askedNeither = breakdown.asked.size === 0;
  const hasFigures = !breakdown.isLoading && !breakdown.isError && slices.length > 0;

  // Source: Channel = brand orange, Direct = slate 700 (NO TOKEN: grey.700 light / grey.400 dark).
  // Oxygen: the validated pair, by ENTITY — Channel slot 1, Direct slot 2.
  const colourOf = (slice: PartnerModelSlice): string => {
    if (!faithful) return seriesColor(slice.slot === 1 ? CHART_SERIES_1 : CHART_SERIES_2, mode);
    if (slice.id === "channel") return theme.palette.primary.main;
    return mode === "dark" ? theme.palette.grey[400] : theme.palette.grey[700];
  };

  return (
    <AnalysisCard>
      <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
        ARR by Partner Type
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        How much of the book is sold through a partner, and how much direct.
      </Typography>

      {breakdown.isError ? (
        <ErrorNotice onRetry={breakdown.retry}>
          Couldn&apos;t load the partner split. {breakdown.errorMessage}
        </ErrorNotice>
      ) : breakdown.isLoading ? (
        <Skeleton variant="circular" width={200} height={200} sx={{ mx: "auto" }} />
      ) : unanswered ? (
        <ErrorNotice onRetry={breakdown.retry}>
          One partner model didn&apos;t load, so the split can&apos;t be shown.
        </ErrorNotice>
      ) : slices.length === 0 ? null : slices.length === 1 ? (
        // One model holds all the ARR: a single labelled bar, as the source does,
        // rather than a one-slice pie.
        <Stack spacing={1.5} sx={{ alignItems: "center", justifyContent: "center", px: 2, minHeight: 220 }}>
          <Typography variant="body2" color="text.secondary">
            All ARR in this view is {slices[0].label}
          </Typography>
          <Box role="img" aria-label={`${slices[0].label}: 100% of ARR`} sx={{ width: "100%", height: 16, borderRadius: 999, bgcolor: colourOf(slices[0]) }} />
          <Typography sx={[{ fontWeight: 800, fontSize: "1.1rem" }, brandText]}>100% {slices[0].label}</Typography>
        </Stack>
      ) : (
        <Box sx={{ height: 230 }} role="img" aria-label={slices.map((slice) => `${slice.label} ${Math.round(slice.share)}%`).join(", ")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <Pie
                data={slices.map((slice) => ({ name: slice.label, value: Math.round(slice.share * 10) / 10, id: slice.id }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                paddingAngle={2}
                cornerRadius={faithful ? 7 : 2}
                isAnimationActive={false}
                stroke="none"
                // The source's arc labels: inside the slice, white, 11px/700,
                // and only on a slice wide enough to hold them (arcLabelMinAngle 20°).
                label={({ value, cx, cy, midAngle, outerRadius, percent }) => {
                  if ((percent ?? 0) * 360 < 20) return null;
                  const radian = (-(midAngle ?? 0) * Math.PI) / 180;
                  const r = Number(outerRadius) * 0.6;
                  const x = Number(cx) + r * Math.cos(radian);
                  const y = Number(cy) + r * Math.sin(radian);
                  return (
                    <text x={x} y={y} fill="#ffffff" fontSize={12} fontWeight={700} textAnchor="middle" dominantBaseline="central">
                      {`${Math.round(Number(value))}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {slices.map((slice) => (
                  <Cell key={slice.id} fill={colourOf(slice)} />
                ))}
              </Pie>
              <RTooltip
                formatter={(value, name) => [`${Number(value).toFixed(1)}%`, String(name)]}
                contentStyle={{
                  background: cssVar("background-default"),
                  border: `1px solid ${cssVar("divider")}`,
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Box role="status" sx={{ minHeight: 18, mt: 0.5 }}>
        {!breakdown.isLoading && !breakdown.isError && !unanswered && slices.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            {askedNeither
              ? "Channel and Direct don't apply to the partner type this view is narrowed to."
              : "No ARR in this view."}
          </Typography>
        )}
      </Box>

      {hasFigures && (
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={HEAD_SX}>Partner Type</TableCell>
              <TableCell align="right" sx={HEAD_SX}>ARR</TableCell>
              <TableCell align="right" sx={HEAD_SX}>Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slices.map((slice) => (
              <TableRow key={slice.id}>
                <TableCell sx={CELL_SX}>
                  <Box aria-hidden component="span" sx={{ display: "inline-block", width: 8, height: 8, borderRadius: "2px", mr: 0.75, bgcolor: colourOf(slice) }} />
                  {slice.label}
                </TableCell>
                <TableCell align="right" sx={CELL_SX}>
                  {formatMisValue(slice.amount, MIS_VALUE_TYPES.CURRENCY, { scale })}
                </TableCell>
                <TableCell align="right" sx={CELL_SX}>
                  {formatMisValue(slice.share, MIS_VALUE_TYPES.PERCENTAGE, { scale })}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AnalysisCard>
  );
}

// ---- Industry bars --------------------------------------------------------------

const CHART_HEIGHT = 300;

export function PrototypeIndustryBars({
  breakdown,
  totalArr,
  scale,
}: {
  breakdown: IndustryBreakdown;
  totalArr?: number;
  scale: MisScale;
}) {
  const look = useMisLook();
  const theme = useTheme();
  const mode = useLiveMode();
  const chrome = chartChrome(mode);
  const faithful = look.gridHeader === "brand";
  const fill = faithful ? theme.palette.primary.main : seriesColor(CHART_SERIES_1, mode);

  const rows = useMemo(
    () => industrySeries({ byIndustry: breakdown.byIndustry, asked: breakdown.asked, totalArr }),
    [breakdown.byIndustry, breakdown.asked, totalArr],
  );
  const plotted = useMemo(() => {
    const withFigures = rows.filter((row) => row.amount != null);
    return withFigures.some((row) => (row.amount ?? 0) > 0) ? withFigures : [];
  }, [rows]);
  const unasked = rows.filter((row) => !row.asked);
  const unanswered = rows.filter((row) => row.asked && !row.answered);
  const hasFigures = !breakdown.isLoading && !breakdown.isError && plotted.length > 0;

  return (
    <AnalysisCard>
      <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
        ARR by Industry
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        The six industries this screen names, and everything else as Other. The share is printed on each bar.
      </Typography>

      {breakdown.isError ? (
        <ErrorNotice onRetry={breakdown.retry}>
          Couldn&apos;t load the industry breakdown. {breakdown.errorMessage}
        </ErrorNotice>
      ) : breakdown.isLoading ? (
        <Skeleton variant="rectangular" height={CHART_HEIGHT} sx={{ borderRadius: 1 }} />
      ) : plotted.length === 0 ? (
        <Box sx={{ height: CHART_HEIGHT }} />
      ) : (
        <Box sx={{ height: CHART_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={plotted} margin={{ top: 18, right: 12, bottom: 4, left: 8 }} barCategoryGap="30%" maxBarSize={64}>
              <CartesianGrid vertical={false} stroke={chrome.line} />
              <XAxis
                dataKey="industry"
                interval={0}
                tick={({ x, y, payload }) => <WrappedTick x={x} y={y} text={String(payload.value)} fill={chrome.tick} />}
                stroke={chrome.line}
                tickLine={false}
                height={54}
              />
              <YAxis
                tickFormatter={(value: number) => misHeadlineAmount(value)}
                tick={{ fill: chrome.tick, fontSize: 11 }}
                stroke={chrome.line}
                tickLine={false}
                width={64}
              />
              <RTooltip
                cursor={{ fill: chrome.line }}
                formatter={(value) => [misHeadlineAmount(Number(value)), "ARR"]}
                contentStyle={{
                  background: cssVar("background-default"),
                  border: `1px solid ${cssVar("divider")}`,
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="amount" radius={faithful ? [10, 10, 0, 0] : [4, 4, 0, 0]} isAnimationActive={false}>
                {plotted.map((row) => (
                  <Cell key={row.industry} fill={fill} />
                ))}
                {/* The share, once, on the bar — the axis names the industry and
                    the tooltip gives the amount. Lifted clear of short bars. */}
                <LabelList
                  dataKey="share"
                  position="top"
                  formatter={(value) => (value == null ? "" : `${Number(value).toFixed(1)}%`)}
                  style={{ fill: cssVar("text-primary"), fontSize: 11, fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      <Box role="status" sx={{ minHeight: 18, mt: 0.5 }}>
        {!breakdown.isLoading && !breakdown.isError && plotted.length === 0 && (
          <Typography variant="body2" color="text.secondary">No ARR in this view.</Typography>
        )}
        {hasFigures && unasked.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Not tracked here: {unasked.map((row) => row.industry).join(", ")}.
          </Typography>
        )}
        {hasFigures && unanswered.length > 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Didn&apos;t load: {unanswered.map((row) => row.industry).join(", ")}.
          </Typography>
        )}
      </Box>

      {hasFigures && (
        <Table size="small" sx={{ mt: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={HEAD_SX}>Industry</TableCell>
              <TableCell align="right" sx={HEAD_SX}>ARR</TableCell>
              <TableCell align="right" sx={HEAD_SX}>Share</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plotted.map((row) => (
              <TableRow key={row.industry}>
                <TableCell sx={CELL_SX}>{row.industry}</TableCell>
                <TableCell align="right" sx={CELL_SX}>
                  {formatMisValue(row.amount, MIS_VALUE_TYPES.CURRENCY, { scale })}
                </TableCell>
                <TableCell align="right" sx={CELL_SX}>
                  {row.share == null ? "—" : `${formatMisValue(row.share, MIS_VALUE_TYPES.PERCENTAGE)}%`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AnalysisCard>
  );
}

/** A category tick wrapped onto two lines, so "Health Care and Social Assistance" fits under its bar. */
function WrappedTick({ x, y, text, fill }: { x?: number | string; y?: number | string; text: string; fill: string }) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > 14 && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return (
    <text x={x} y={y} fill={fill} fontSize={11} fontWeight={500} textAnchor="middle">
      {lines.slice(0, 3).map((line, index) => (
        <tspan key={line} x={x} dy={index === 0 ? 12 : 13}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

const CELL_SX = { fontSize: 12.5, fontVariantNumeric: "tabular-nums" } as const;
const HEAD_SX = { fontSize: 11, fontWeight: 700, color: "text.secondary" } as const;
