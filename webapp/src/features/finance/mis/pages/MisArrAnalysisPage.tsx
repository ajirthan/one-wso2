// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import { useMemo, useState } from "react";
import { Navigate } from "react-router";
import { Box, Typography } from "@wso2/oxygen-ui";
import { useDocumentTitle } from "@hooks/useDocumentTitle";
import ErrorNotice from "@components/error-notice/ErrorNotice";
import { misPaths } from "@constants/misApps";
import MisShell from "../components/MisShell";
import MisAnalysisFilters from "../components/MisAnalysisFilters";
import AnalysisAccountGrid from "../components/AnalysisAccountGrid";
import { MisLookPrototypeProvider } from "../prototype/misLookPrototype";
import {
  PrototypeIndustryBars,
  PrototypeKpiTiles,
  PrototypePartnerPie,
} from "../prototype/PrototypeAnalysisCharts";
import PrototypeGridHeader from "../prototype/PrototypeGridHeader";
import PrototypeExportMenu from "../prototype/PrototypeExportMenu";

// PROTOTYPE (branch prototype/mis-look): D11 anatomy — KPI tiles with the ARR
// figure in brand text and a Logo Count, a Partner Type pie, vertical Industry
// bars with share labels, then the accounts grid under a per-grid header with
// the Scale and an Export ▾. Three chrome variants via `?variant=`.
import {
  analysisScrapedOptions,
  mergeScrapedOptions,
  EMPTY_SCRAPED_OPTIONS,
  type AnalysisScrapedOptions,
} from "../components/analysisAccountRows";
import { useMisAppConfigs } from "../api/useMisAppConfigs";
import { useAnalysisAccounts, useAnalysisHeadlineArr } from "../api/useAnalysisAccounts";
import {
  useAnalysisIndustries,
  useAnalysisPartnerModels,
} from "../api/useAnalysisBreakdowns";
import { useDebouncedValue } from "../util/useDebouncedValue";
import { analysisMenus } from "../util/misAnalysisMenus";
import {
  defaultAnalysisFilters,
  isoCivilDate,
  isSameCivilDate,
  type MisAnalysisFilters as Filters,
} from "../util/misAnalysisFilters";
import { pacificCivilDate } from "../util/misPacificTime";
import { useScalePreference } from "../util/ScalePreferenceContext";
import { misExportFilename } from "../export/misExportFilename";

// ARR Analysis — current ARR over an account-level table, behind a server-side
// flag.
//
// ---- two refusals that must not be confused with each other ----------------
//
//   `productsUsageEnabled` is false   the screen does not exist FOR ANYONE, so
//                                     the route redirects to ARR Build and the
//                                     rail carries no entry at all
//   no ARR privilege                  the screen exists and this reader may not
//                                     open it, so it says so where they are
//
// A redirect asserts a fact about the app; a locked panel asserts one about the
// reader. Which is why the flag is read HERE as well as inside `useMisGate`:
// the gate folds it into one boolean, which is the right shape for the rail,
// and loses the distinction this route needs.
//
// It also means the two states where the flag is simply UNKNOWN can be neither.
// Still in flight, a redirect would bounce a bookmarked link on every cold
// load; failed, it would relocate someone because of a gateway blip and tell
// them nothing. Both are held by `MisShell`'s prerequisite rung instead.
//
// ---- where the Build's screens have a URL and this one does not ------------
//
// Every filter here is component state, so a shared link opens on the defaults.
// Putting them in the query string would be a new contract: nothing on this
// screen is serialised today.

/** The screen's own name, in the rail, the tab title and the heading. */
const TITLE = "ARR Analysis";

export default function MisArrAnalysisPage() {
  useDocumentTitle(TITLE);
  const configs = useMisAppConfigs();

  // The redirect fires ONLY on a confirmed `false`. `analysisEnabled` is also
  // false while loading and after a failure, so the two guards above it are
  // what keep those from being read as an answer — see `useMisAppConfigs`.
  if (!configs.isLoading && !configs.isError && !configs.analysisEnabled) {
    // `replace`, so Back returns to wherever the reader came from rather than
    // to a URL that will bounce them here again.
    return <Navigate to={misPaths.arrBuild} replace />;
  }

  return (
    <MisShell
      gateId="mis-analysis"
      title={TITLE}
      subtitle="Current recurring revenue across the customer book, account by account."
      prerequisite={{
        isLoading: configs.isLoading,
        isError: configs.isError,
        errorMessage: configs.errorMessage,
        retry: configs.retry,
        describe: "whether ARR Analysis is available",
      }}
    >
      <MisLookPrototypeProvider>
        <ArrAnalysis />
      </MisLookPrototypeProvider>
    </MisShell>
  );
}

/** Inside the shell, so it is only mounted once the flag and the gate agree. */
function ArrAnalysis() {
  // Read once per mount, not per render: every request body resolves "no date
  // chosen" against it, and a value that moved mid-session would silently
  // re-key every query at midnight Pacific.
  const [today] = useState(pacificCivilDate);
  const [filters, setFilters] = useState<Filters>(() => defaultAnalysisFilters(today));

  const configs = useMisAppConfigs();

  // The reads are keyed on the SETTLED filters, the controls on the live ones.
  // Named `settled` rather than `applied`: an applied filter is one serialised
  // into the query string, and nothing on this screen is.
  // The charts take the reads to ten — one per industry, two for the partner
  // split — so a reader stepping through four Sales Regions would fire forty.
  // Debounced in ONE
  // place so all four reads move together: staggering them would leave the
  // table and the charts above it briefly answering different questions, which
  // is the one thing a screen built for comparing them must not do.
  const settled = useDebouncedValue(filters);

  const accounts = useAnalysisAccounts(settled, today);
  const headline = useAnalysisHeadlineArr(settled, today);
  const partnerModels = useAnalysisPartnerModels(settled, today);
  const industries = useAnalysisIndustries(settled, today, configs.options.industries);

  // The scraped fallback menus, widened by each fetch and never narrowed — see
  // `mergeScrapedOptions` for why that matters.
  const [scraped, setScraped] = useState<AnalysisScrapedOptions>(EMPTY_SCRAPED_OPTIONS);
  const arrived = analysisScrapedOptions(accounts.rows);
  if (mergeScrapedOptions(scraped, arrived) !== scraped) {
    // A render-phase setState, which React re-renders through immediately
    // rather than painting the stale menus first. The alternative is an effect,
    // which paints, then paints again — and this derives entirely from `rows`.
    setScraped((held) => mergeScrapedOptions(held, arrived));
  }

  const menus = useMemo(() => analysisMenus(configs.options, scraped), [configs.options, scraped]);

  // The stored preference DIRECTLY, not through `useMisScale`. That hook
  // reconciles a Scale carried in a link against the stored one, and this
  // screen's view reaches no link — so there is nothing to reconcile, and
  // asking it would mean inventing a view state for a screen that has none.
  // The preference is shared with every Build screen either way, which is the
  // half that matters: a reader who works in thousands keeps working in
  // thousands on the way here.
  const { preference: scale, setPreference: setScale } = useScalePreference();

  return (
    <Box>
      <MisAnalysisFilters
        filters={filters}
        today={today}
        menus={menus}
        menusLoading={configs.isLoading}
        // Only when the lists actually FAILED. A panel still loading them says
        // so in the menus themselves.
        menusErrorMessage={configs.isError ? configs.errorMessage : ""}
        onRetryMenus={configs.retry}
        onChange={setFilters}
      />

      <PrototypeKpiTiles
        asOfLabel={
          settled.asOf && !isSameCivilDate(settled.asOf, today) ? isoCivilDate(settled.asOf) : "today"
        }
        arr={headline.arr}
        isLoading={headline.isLoading}
        isError={headline.isError}
        errorMessage={headline.errorMessage}
        retry={headline.retry}
        logoCount={accounts.rows.length}
        logosLoading={accounts.isLoading}
      />

      {/* Always mounted, so the region exists before it has anything to say —
          one created at the moment its text appears is announced unreliably or
          not at all, which is the reason `MisFilterBar` keeps its own mounted.
          It matters MORE here than there: this panel has no Apply, so a filter
          takes effect with no button press to explain the table changing under
          a reader who cannot see it. */}
      <Typography
        role="status"
        variant="caption"
        component="p"
        color="text.secondary"
        sx={{ minHeight: 18, mb: 0.25 }}
      >
        {accounts.isLoading
          ? "Loading accounts…"
          : accounts.isError
            ? ""
            : `${accounts.rows.length} ${accounts.rows.length === 1 ? "account" : "accounts"}`}
      </Typography>

      {/* The two breakdowns, above the table they are cut from. Each ships a
          companion table beneath it, per the house convention. */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          mb: 2,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.8fr) minmax(0, 1.2fr)" },
        }}
      >
        <PrototypePartnerPie breakdown={partnerModels} scale={scale} />
        <PrototypeIndustryBars breakdown={industries} totalArr={headline.arr} scale={scale} />
      </Box>

      {/* D4 step 5 on this screen too: the Table title, the units caption, the
          Scale and the Export ▾ travel with the table, because Finance crops
          tables into decks. */}
      <PrototypeGridHeader
        title="Account performance detail"
        scale={scale}
        onScale={setScale}
        exportMenu={
          <PrototypeExportMenu filename={() => misExportFilename(["arr_analysis", "accounts"])} />
        }
      />

      {accounts.isError ? (
        <ErrorNotice onRetry={accounts.retry} sx={{ mt: 1.5 }}>
          Couldn&apos;t load the accounts. {accounts.errorMessage}
        </ErrorNotice>
      ) : (
        <AnalysisAccountGrid rows={accounts.rows} scale={scale} isLoading={accounts.isLoading} />
      )}
    </Box>
  );
}
