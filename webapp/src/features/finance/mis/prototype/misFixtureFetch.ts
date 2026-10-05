// PROTOTYPE (branch prototype/mis-look) — throwaway, never merge.
//
// A dev-only fixture mode for the Finance MIS screens. Every MIS read goes
// through `@api/http` → `fetchWithReauth` → `window.fetch`, so wrapping fetch
// once here covers all ten ARR endpoints without touching a hook. It is
// installed from `main.tsx` only when `import.meta.env.DEV` is on AND
// `ONE_WSO2_MIS_ARR_BACKEND_URL` points at the placeholder host below, which no
// real deployment ever will.
//
// Figures are deterministic (seeded on the request body) so screenshots are
// reproducible, and shaped per `api/misTypes.ts`, `components/*Rows.ts`.
// Read-only; nothing is persisted.

export const MIS_FIXTURE_HOST = "https://mis-fixtures.prototype.invalid";

type Json = unknown;

export function misFixtureModeEnabled(): boolean {
  const url = window.config?.ONE_WSO2_MIS_ARR_BACKEND_URL ?? "";
  return import.meta.env.DEV && url.startsWith(MIS_FIXTURE_HOST);
}

/** Wraps `window.fetch`; requests to the fixture host are answered locally. */
export function installMisFixtureFetch(): void {
  const realFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (!url.startsWith(MIS_FIXTURE_HOST)) return realFetch(input, init);
    const { pathname, searchParams } = new URL(url);
    const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {};
    // A touch of latency so skeletons are visible for a frame, like a real read.
    await new Promise((resolve) => setTimeout(resolve, 120 + Math.random() * 180));
    const payload = answer(pathname.replace(/^\/v1/, ""), body, searchParams);
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  console.info("[mis-prototype] fixture fetch installed for", MIS_FIXTURE_HOST);
}

function answer(path: string, body: Record<string, unknown>, query: URLSearchParams): Json {
  switch (path) {
    case "/user-info":
      return USER_INFO;
    case "/app-configs":
      return APP_CONFIGS;
    case "/arr-summary":
      return arrSummary(body);
    case "/accounts":
      return accounts(body);
    case "/arr-summary/customers":
      return drillDownCustomers(body);
    case "/arr-summary/region-exit":
      return regionExit(body);
    case "/arr-summary/bu-exit":
      return buExit(body);
    case "/arr-summary/region-metrics":
      return regionMetrics(body);
    case "/exit-arr/search":
      return exitArrSearch(body);
    case "/opportunities":
      return opportunities(query.get("accountId") ?? "", query.get("endDate") ?? "");
    default:
      console.warn("[mis-prototype] no fixture for", path);
      return {};
  }
}

// ---- seeded randomness ------------------------------------------------------

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let state = hash(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 100000) / 100000;
  };
}

const between = (random: () => number, low: number, high: number) => low + (high - low) * random();
const round = (value: number, digits = 2) => Number(value.toFixed(digits));

const yearOf = (date: unknown): number => {
  const match = /^(\d{4})/.exec(String(date ?? ""));
  return match ? Number(match[1]) : 2026;
};

// ---- /user-info, /app-configs ------------------------------------------------

const USER_INFO = {
  firstName: "Finance",
  lastName: "Reviewer",
  workEmail: "finance.reviewer@wso2.com",
  employeeThumbnail: "",
  jobRole: "Finance Analyst",
  privileges: [987, 789],
};

const SALES_REGIONS = ["APAC", "EU", "NA", "ME", "LatAm"];
const SUB_REGIONS = ["ANZ", "ASEAN", "DACH", "Nordics", "UK & Ireland", "US East", "US West", "GCC", "Brazil"];
const COUNTRIES = [
  "Australia", "Brazil", "Canada", "Denmark", "Germany", "India", "Japan", "Netherlands",
  "Saudi Arabia", "Singapore", "Sri Lanka", "Sweden", "United Arab Emirates", "United Kingdom",
  "United States",
];
const INDUSTRIES = [
  "Finance and Insurance", "Public Administration", "Information",
  "Health Care and Social Assistance", "Retail Trade", "Utilities", "Manufacturing",
  "Educational Services", "Transportation and Warehousing",
];
const SUB_INDUSTRIES = ["Banking", "Insurance", "Telecom", "Software", "Hospitals", "E-commerce", "Energy"];
const OWNERS = ["Amara Perera", "Dilan Fernando", "Ishara Silva", "Kasun Jayasuriya", "Nadeesha Wickrama", "Tharindu Bandara"];
const TECHNICAL_OWNERS = ["Chamath Gunasekara", "Hiruni Rathnayake", "Pasindu Weerasinghe"];
const CHANNEL_MANAGERS = ["Ravindu Senanayake", "Sachini Dias"];

const APP_CONFIGS = {
  billingCountries: COUNTRIES,
  shippingCountries: COUNTRIES,
  salesRegions: SALES_REGIONS,
  subRegions: SUB_REGIONS,
  industries: INDUSTRIES,
  subIndustries: SUB_INDUSTRIES,
  technicalOwners: TECHNICAL_OWNERS,
  channelManagers: CHANNEL_MANAGERS,
  accountOwners: OWNERS.map((name) => ({ name, email: `${name.toLowerCase().replace(/\s+/g, ".")}@wso2.com` })),
  businessUnits: ["APIM_BU", "IAM_BU", "INTEGRATION_BU", "CHOREO_BU", "AGENT_PLATFORM_BU"],
  productUnits: ["APIM_SOFTWARE", "IAM_SOFTWARE", "INTEGRATION_SOFTWARE", "APIM_CLOUD", "IAM_CLOUD", "INTEGRATION_CLOUD", "CHOREO_CLOUD", "AGENT_PLATFORM_CLOUD", "MOESIF_CLOUD"],
  helpEmail: "finance-mis@wso2.com",
  productsUsageEnabled: true,
};

// ---- /arr-summary ------------------------------------------------------------

/** The book's size for one unit selection — so Choreo is smaller than All. */
function unitShare(businessUnits: unknown): number {
  const units = Array.isArray(businessUnits) ? (businessUnits as string[]) : ["ALL_BU"];
  const share: Record<string, number> = {
    ALL_BU: 1,
    APIM_BU: 0.44,
    IAM_BU: 0.27,
    INTEGRATION_BU: 0.21,
    CHOREO_BU: 0.05,
    AGENT_PLATFORM_BU: 0.03,
    APIM_SOFTWARE: 0.3,
    IAM_SOFTWARE: 0.18,
    INTEGRATION_SOFTWARE: 0.15,
    APIM_CLOUD: 0.14,
    IAM_CLOUD: 0.09,
    INTEGRATION_CLOUD: 0.06,
    CHOREO_CLOUD: 0.05,
    AGENT_PLATFORM_CLOUD: 0.03,
    MOESIF_CLOUD: 0.02,
    ALL_SOFTWARE: 0.63,
    ALL_CLOUD: 0.37,
  };
  const total = units.reduce((sum, unit) => sum + (share[unit] ?? 0.1), 0);
  return Math.min(1, Math.max(0.02, total));
}

/** Opening ARR for a given year, before the unit share. ~18% compound growth. */
const openingFor = (year: number, monthsSpan: number) =>
  52_000_000 * Math.pow(1.18, year - 2022) * Math.pow(1.18, -(12 - monthsSpan) / 12);

function spanMonths(body: Record<string, unknown>): number {
  const start = String(body.startDate ?? "");
  const end = String(body.endDate ?? "");
  const s = /^(\d{4})-(\d{2})/.exec(start);
  const e = /^(\d{4})-(\d{2})/.exec(end);
  if (!s || !e) return 12;
  const months = (Number(e[1]) - Number(s[1])) * 12 + (Number(e[2]) - Number(s[2]));
  return Math.max(1, Math.min(12, months || 12));
}

function arrSummary(body: Record<string, unknown>) {
  const random = rng(`arr-summary:${body.startDate}:${body.endDate}:${JSON.stringify(body.businessUnits)}:${body.partnerType ?? ""}`);
  const share = unitShare(body.businessUnits) * (body.partnerType ? 0.55 : 1);
  const months = spanMonths(body);
  const year = yearOf(body.endDate);
  const scale = months / 12;

  const opening = openingFor(year, 12) * share;
  const newArr = opening * between(random, 0.1, 0.16) * scale;
  const transferredIn = newArr * between(random, 0.05, 0.12);
  const expansions = opening * between(random, 0.08, 0.14) * scale;
  const reductions = -opening * between(random, 0.025, 0.045) * scale;
  const transferredOut = -Math.abs(reductions) * between(random, 0.08, 0.15);
  const lost = -opening * between(random, 0.04, 0.07) * scale;
  const ending = opening + newArr + expansions + reductions + lost;
  const netNew = ending - opening;
  const totalNew = newArr + expansions;
  const totalChurn = reductions + lost;

  const openingCustomers = Math.round(640 * share * Math.pow(1.12, year - 2022));
  const newCustomers = Math.round(openingCustomers * between(random, 0.1, 0.15) * scale);
  const lostCustomers = Math.round(openingCustomers * between(random, 0.04, 0.07) * scale);
  const transferredInCount = Math.round(newCustomers * 0.1);
  const transferredOutCount = Math.round(lostCustomers * 0.12);

  const pct = (part: number, whole: number) => round((part / whole) * 100);

  return {
    openingArr: round(opening),
    newArr: round(newArr),
    transferredIn: round(transferredIn),
    expansions: round(expansions),
    reductions: round(reductions),
    transferredOut: round(transferredOut),
    lost: round(lost),
    endingArr: round(ending),
    endingArrYoyGrowth: round(between(random, 14, 22)),
    netNew: round(netNew),
    netNewYoyGrowth: round(between(random, -6, 28)),
    totalNewArr: round(totalNew),
    totalNewArrYoyGrowth: round(between(random, 4, 19)),
    totalChurnArr: round(totalChurn),
    totalChurnArrYoyGrowth: round(between(random, -12, 9)),
    grossDollarRetention: pct(opening + reductions + lost, opening),
    netDollarRetention: pct(opening + expansions + reductions + lost, opening),
    dollarRetentionLostOnly: pct(opening + lost, opening),
    dollarRetentionReductionAndLost: pct(opening + reductions + lost, opening),
    dollarRetentionReductionAndIncreases: pct(opening + expansions + reductions, opening),
    dollarRetentionIncreasesReductionAndLost: pct(opening + expansions + reductions + lost, opening),
    percentNewTotal: pct(newArr, opening),
    percentIncreasesUpsellsTotal: pct(expansions, opening),
    percentReductionsTotal: pct(reductions, opening),
    percentLostTotal: pct(lost, opening),
    openingSubscriptionCustomers: openingCustomers,
    newCustomers,
    transferredInCount,
    lostCustomers,
    transferredOutCount,
    closingSubscriptionCustomers: openingCustomers + newCustomers - lostCustomers,
    percentNewLogos: pct(newCustomers, openingCustomers),
    percentLostLogos: pct(lostCustomers, openingCustomers),
  };
}

// ---- /accounts ---------------------------------------------------------------

const ACCOUNT_NAMES = [
  "Acme Financial Group", "Borealis Health Network", "Cedar Utilities", "Delta Retail Holdings",
  "Everest Insurance", "Fjord Telecom", "Granite Public Services", "Harbor Logistics",
  "Ionic Media", "Juniper Bank", "Kestrel Energy", "Lumen Hospitals", "Meridian Payments",
  "Nimbus Software", "Orchid Airlines", "Pinnacle Manufacturing", "Quartz Capital",
  "Riverbend Education", "Summit Pharma", "Tidewater Ports", "Umbra Security",
  "Vantage Mobility", "Willow Foods", "Xenon Semiconductors", "Yarrow Municipal",
  "Zephyr Travel", "Atlas Reinsurance", "Beacon Credit Union", "Cobalt Grid",
  "Dune Hospitality", "Ember Analytics", "Falcon Defence Systems", "Glacier Water",
  "Helix Genomics", "Iris Telehealth", "Jade Commerce", "Kite Learning",
  "Lantern Government Services", "Mosaic Retail", "Nova Broadcasting",
];
const PARTNER_TYPES = ["Direct", "Channel"];
const RATINGS = ["A", "B", "C"];

function accountFigures(seed: string, year: number, growthBase = 1) {
  const random = rng(seed);
  const size = Math.pow(1.17, year - 2022) * between(random, 40_000, 2_400_000) * growthBase;
  const apimBu = size * between(random, 0.2, 0.6);
  const iamBu = size * between(random, 0.05, 0.4);
  const integrationBu = size * between(random, 0, 0.35);
  const choreoBu = random() > 0.7 ? size * between(random, 0.02, 0.12) : 0;
  const agentPlatformBu = random() > 0.85 ? size * between(random, 0.01, 0.08) : 0;
  const moesifBu = random() > 0.8 ? apimBu * between(random, 0.05, 0.2) : 0;
  const cloudShare = between(random, 0.15, 0.6);
  const apimSoftware = apimBu * (1 - cloudShare);
  const iamSoftware = iamBu * (1 - cloudShare);
  const integrationSoftware = integrationBu * (1 - cloudShare);
  const apimCloud = apimBu * cloudShare;
  const iamCloud = iamBu * cloudShare;
  const integrationCloud = integrationBu * cloudShare;
  const arrSoftwareTotal = apimSoftware + iamSoftware + integrationSoftware;
  const arrCloudTotal = apimCloud + iamCloud + integrationCloud + choreoBu + agentPlatformBu;
  return {
    apimBuTotal: round(apimBu),
    iamBuTotal: round(iamBu),
    integrationBuTotal: round(integrationBu),
    choreoBuTotal: round(choreoBu),
    agentPlatformBuTotal: round(agentPlatformBu),
    moesifBuTotal: round(moesifBu),
    apimSoftwareTotal: round(apimSoftware),
    iamSoftwareTotal: round(iamSoftware),
    integrationSoftwareTotal: round(integrationSoftware),
    arrSoftwareTotal: round(arrSoftwareTotal),
    apimCloudTotal: round(apimCloud),
    iamCloudTotal: round(iamCloud),
    integrationCloudTotal: round(integrationCloud),
    choreoCloudTotal: round(choreoBu),
    agentPlatformCloudTotal: round(agentPlatformBu),
    arrCloudTotal: round(arrCloudTotal),
    arrGrandTotal: round(arrSoftwareTotal + arrCloudTotal),
  };
}

function accountIdentity(index: number) {
  const random = rng(`account:${index}`);
  const name = ACCOUNT_NAMES[index % ACCOUNT_NAMES.length] + (index >= ACCOUNT_NAMES.length ? ` ${Math.floor(index / ACCOUNT_NAMES.length) + 1}` : "");
  const region = SALES_REGIONS[Math.floor(random() * SALES_REGIONS.length)];
  const country = COUNTRIES[Math.floor(random() * COUNTRIES.length)];
  const industry = INDUSTRIES[Math.floor(random() * INDUSTRIES.length)];
  return {
    id: `001${String(100000 + index).padStart(12, "0")}`,
    name,
    accountOwnerName: OWNERS[Math.floor(random() * OWNERS.length)],
    partnerType: PARTNER_TYPES[random() > 0.6 ? 1 : 0],
    primaryPartnerName: random() > 0.6 ? "Northwind Partners" : "",
    primaryPartnerRole: random() > 0.6 ? "Reseller" : "",
    billingCountry: country,
    shippingCountry: country,
    naicsIndustry: industry,
    subIndustry: SUB_INDUSTRIES[Math.floor(random() * SUB_INDUSTRIES.length)],
    salesRegions: region,
    subRegion: SUB_REGIONS[Math.floor(random() * SUB_REGIONS.length)],
    activationDate: `${2015 + Math.floor(random() * 9)}-0${1 + Math.floor(random() * 9)}-15`,
    churnDate: "",
    lostReasonCategory: "",
    accountRating: RATINGS[Math.floor(random() * RATINGS.length)],
    employeeCount: Math.round(between(random, 200, 60000)),
    customerLifetime: String(1 + Math.floor(random() * 9)),
    productsInUse: ["API Manager", "Identity Server", "Micro Integrator", "Choreo"].slice(0, 1 + Math.floor(random() * 3)),
  };
}

const ACCOUNT_COUNT = 72;

function accounts(body: Record<string, unknown>) {
  const year = yearOf(body.endDate);
  const share = unitShare(body.businessUnits);
  const count = Math.round(ACCOUNT_COUNT * Math.min(1, 0.55 + 0.1 * (year - 2021)));
  return Array.from({ length: count }, (_, index) => ({
    ...accountIdentity(index),
    delayedDateCount: 0,
    ...accountFigures(`figures:${index}:${year}`, year, share),
  }));
}

// ---- /arr-summary/customers (drill-down) --------------------------------------

function drillDownCustomers(body: Record<string, unknown>) {
  const random = rng(`drill:${body.customerArrType}:${body.endDate}`);
  const year = yearOf(body.endDate);
  const count = body.customerArrType === "Closing" ? 48 : 8 + Math.floor(random() * 10);
  const sign = body.customerArrType === "Lost" || body.customerArrType === "Reductions" || body.customerArrType === "Transferred Out" ? -1 : 1;
  return Array.from({ length: count }, (_, index) => {
    const identity = accountIdentity((index * 7 + year) % 60);
    const figures = accountFigures(`figures:${(index * 7 + year) % 60}:${year}`, year);
    return {
      accountId: identity.id,
      name: identity.name,
      salesRegion: identity.salesRegions,
      subRegion: identity.subRegion,
      amount: round(sign * figures.arrGrandTotal * (body.customerArrType === "Closing" ? 1 : between(random, 0.08, 0.4))),
      activationDate: identity.activationDate,
      churnDate: sign < 0 ? `${year}-0${1 + Math.floor(random() * 9)}-28` : undefined,
      lostReasonCategory: sign < 0 ? "Budget" : undefined,
      lostReason: sign < 0 ? "Consolidated vendors" : undefined,
      accountRating: identity.accountRating,
      customerLifetime: identity.customerLifetime,
      technicalOwner: TECHNICAL_OWNERS[index % TECHNICAL_OWNERS.length],
      accountOwner: identity.accountOwnerName,
    };
  });
}

// ---- Exit ARR summaries ------------------------------------------------------

const BU_KEYS = ["apim", "iam", "integration", "choreo", "agentPlatform", "moesif"] as const;
const BU_WEIGHT: Record<(typeof BU_KEYS)[number], number> = {
  apim: 0.44, iam: 0.27, integration: 0.21, choreo: 0.05, agentPlatform: 0.03, moesif: 0.04,
};

function buFigures(seed: string, total: number) {
  const random = rng(seed);
  const figures: Record<string, number> = {};
  let sum = 0;
  for (const key of BU_KEYS) {
    const value = total * BU_WEIGHT[key] * between(random, 0.85, 1.15);
    figures[key] = round(value);
    if (key !== "moesif") sum += value;
  }
  figures.all = round(sum);
  return figures;
}

const REGION_WEIGHT: Record<string, number> = { NA: 0.41, EU: 0.27, APAC: 0.18, ME: 0.09, LatAm: 0.05 };
const SUB_REGION_WEIGHT: Record<string, number> = {
  "US East": 0.24, "US West": 0.17, DACH: 0.1, "UK & Ireland": 0.09, Nordics: 0.08,
  ANZ: 0.09, ASEAN: 0.09, GCC: 0.09, Brazil: 0.05,
};

function regionExit(body: Record<string, unknown>) {
  const year = yearOf(body.endDate);
  const total = openingFor(year, 12) * 1.12 * (body.partnerType ? 0.55 : 1);
  const weights = body.isSalesRegionSummary === false ? SUB_REGION_WEIGHT : REGION_WEIGHT;
  const response: Record<string, unknown> = {};
  let grand = 0;
  for (const [region, weight] of Object.entries(weights)) {
    const figures = buFigures(`region-exit:${region}:${year}`, total * weight);
    response[region] = figures;
    grand += figures.all as number;
  }
  response.Total = { all: round(grand) };
  return response;
}

function buExit(body: Record<string, unknown>) {
  const year = yearOf(body.endDate);
  return buFigures(`bu-exit:${year}`, openingFor(year, 12) * 1.12 * (body.partnerType ? 0.55 : 1));
}

function regionMetrics(body: Record<string, unknown>) {
  const year = yearOf(body.endDate);
  const share = unitShare(body.businessUnits);
  const months = spanMonths(body);
  const weights = body.isSalesRegionSummary === false ? SUB_REGION_WEIGHT : REGION_WEIGHT;
  const response: Record<string, unknown> = {};
  for (const [region, weight] of Object.entries(weights)) {
    const random = rng(`region-metrics:${region}:${year}:${months}`);
    const opening = openingFor(year, 12) * weight * share;
    const firstSale = opening * between(random, 0.08, 0.15) * (months / 12);
    const expansions = opening * between(random, 0.06, 0.13) * (months / 12);
    const reductions = -opening * between(random, 0.02, 0.05) * (months / 12);
    const lost = -opening * between(random, 0.03, 0.07) * (months / 12);
    const netNew = firstSale + expansions + reductions + lost;
    response[region] = {
      opening: round(opening),
      firstSale: round(firstSale),
      expansions: round(expansions),
      reductions: round(reductions),
      lost: round(lost),
      netNew: round(netNew),
      ending: round(opening + netNew),
    };
  }
  return response;
}

// ---- ARR Analysis ------------------------------------------------------------

function exitArrSearch(body: Record<string, unknown>) {
  const year = yearOf(body.endDate);
  const share = unitShare(body.businessUnits);
  let figure = openingFor(year, 12) * 1.12 * share;
  if (body.partnerType === "Channel") figure *= 0.38;
  else if (body.partnerType === "Direct") figure *= 0.62;
  const industries = Array.isArray(body.industries) ? (body.industries as string[]) : [];
  if (industries.length) {
    const weight: Record<string, number> = {
      "Finance and Insurance": 0.31,
      "Public Administration": 0.17,
      Information: 0.15,
      "Health Care and Social Assistance": 0.11,
      "Retail Trade": 0.08,
      Utilities: 0.05,
    };
    figure *= weight[industries[0]] ?? 0.03;
  }
  if (Array.isArray(body.salesRegions) && body.salesRegions.length) {
    figure *= (body.salesRegions as string[]).reduce((sum, region) => sum + (REGION_WEIGHT[region] ?? 0.05), 0);
  }
  return round(figure);
}

// ---- /opportunities ----------------------------------------------------------

function opportunities(accountId: string, endDate: string) {
  const random = rng(`opps:${accountId}:${endDate}`);
  const year = yearOf(endDate);
  const count = 2 + Math.floor(random() * 4);
  const stages = ["Closed Won", "Closed Won", "Negotiation", "Proposal"];
  return Array.from({ length: count }, (_, index) => {
    const figures = accountFigures(`opp:${accountId}:${index}`, year);
    const total = figures.arrGrandTotal / count;
    return {
      id: `006${String(hash(`${accountId}${index}`)).padStart(12, "0").slice(0, 12)}`,
      name: `${["Renewal", "Expansion", "New business", "Upsell"][index % 4]} FY${String(year).slice(2)}`,
      stageName: stages[index % stages.length],
      confidence: ["High", "Medium", "Low"][index % 3],
      partnerType: PARTNER_TYPES[index % 2],
      subscriptionStartDate: `${year}-01-01`,
      subscriptionEndDate: `${year}-12-31`,
      apimArr: round(total * 0.4),
      iamArr: round(total * 0.2),
      integrationArr: round(total * 0.15),
      apimCloudArr: round(total * 0.1),
      iamCloudArr: round(total * 0.05),
      integrationCloudArr: round(total * 0.04),
      choreoArr: round(total * 0.04),
      agentPlatformArr: round(total * 0.02),
      moesifArr: 0,
      arr: round(total * 0.75),
      cloudArr: round(total * 0.25),
    };
  });
}
