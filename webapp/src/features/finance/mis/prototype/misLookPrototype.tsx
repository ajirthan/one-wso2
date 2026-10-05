// PROTOTYPE (branch prototype/mis-look) — throwaway, never merge.
//
// Three variants of the ARR Dashboard's chrome, switchable via `?variant=`, on
// the existing /finance/mis/arr-build and /finance/mis/analysis routes.
//
// All three render the SAME decided anatomy (D4); they disagree only about how
// faithful the chrome is to the standalone app where its look meets the shell:
//
//   A  Faithful                 the source's chrome, rebuilt in Oxygen tokens
//   B  Shell-native             the same anatomy in Oxygen defaults
//   C  Faithful on shell        A's tabs, pills and per-grid header on B's
//                               surfaces and spacing
//
// The variant is read from the URL, but the MIS view state rewrites the whole
// query string on every filter change (`useUrlViewState.setView`) and the
// Period control navigates to a bare path — so the choice is also kept in
// sessionStorage and re-applied to the URL whenever it goes missing. That keeps
// the URL shareable and the choice stable across a session.

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useSearchParams } from "react-router";
import PrototypeSwitcher from "@components/prototype/PrototypeSwitcher";

export type MisLookKey = "A" | "B" | "C";

export interface MisLook {
  key: MisLookKey;
  name: string;
  hint: string;
  /** Annually | Quarterly | Monthly | TTM. */
  periodControl: "segments" | "toggle";
  /** The seven Table tabs. */
  tableTabs: "underline" | "oxygen";
  /** The Unit row under a Build tab. */
  unitPills: "pills" | "toggle";
  /** The filter card's surface. */
  filterCard: "gradient" | "outlined";
  /** More/Less · Apply · Clear All. */
  filterButtons: "faithful" | "oxygen";
  /** The per-grid header: title in brand text, caption, toggles, Export ▾. */
  gridHeader: "brand" | "oxygen";
  /** The table itself: header, section rows, hover, totals. */
  gridSurface: "faithful" | "oxygen";
  /** Whether the Customers table's Total column wears the orange gradient. */
  grandTotalGradient: boolean;
}

export const MIS_LOOKS: Readonly<Record<MisLookKey, MisLook>> = {
  A: {
    key: "A",
    name: "Faithful",
    hint: "source chrome in Oxygen tokens",
    periodControl: "segments",
    tableTabs: "underline",
    unitPills: "pills",
    filterCard: "gradient",
    filterButtons: "faithful",
    gridHeader: "brand",
    gridSurface: "faithful",
    grandTotalGradient: true,
  },
  B: {
    key: "B",
    name: "Shell-native",
    hint: "same anatomy, Oxygen defaults",
    periodControl: "toggle",
    tableTabs: "oxygen",
    unitPills: "toggle",
    filterCard: "outlined",
    filterButtons: "oxygen",
    gridHeader: "oxygen",
    gridSurface: "oxygen",
    grandTotalGradient: false,
  },
  C: {
    key: "C",
    name: "Faithful on shell surfaces",
    hint: "A's tabs, pills, grid header · B's card and grid",
    periodControl: "segments",
    tableTabs: "underline",
    unitPills: "pills",
    filterCard: "outlined",
    filterButtons: "oxygen",
    gridHeader: "brand",
    gridSurface: "oxygen",
    grandTotalGradient: false,
  },
};

const VARIANT_KEYS: readonly MisLookKey[] = ["A", "B", "C"];
const STORAGE_KEY = "mis-look-prototype.variant";
const PARAM = "variant";

const isLookKey = (value: unknown): value is MisLookKey =>
  typeof value === "string" && (VARIANT_KEYS as readonly string[]).includes(value);

const MisLookContext = createContext<MisLook>(MIS_LOOKS.A);

/** The variant on screen. Defaults to A anywhere outside the provider. */
export const useMisLook = (): MisLook => useContext(MisLookContext);

export function MisLookPrototypeProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get(PARAM);
  const stored = readStored();
  const key: MisLookKey = isLookKey(fromUrl) ? fromUrl : (stored ?? "A");

  // Keep the URL honest. The view state and the Period control both drop the
  // param; put it back so a copied link carries the variant being looked at.
  useEffect(() => {
    if (fromUrl === key) return;
    setParams(
      (previous) => {
        previous.set(PARAM, key);
        return previous;
      },
      { replace: true },
    );
  }, [fromUrl, key, setParams]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, key);
    } catch {
      // Private mode; the URL still carries it.
    }
  }, [key]);

  const change = (next: string) => {
    if (!isLookKey(next)) return;
    setParams(
      (previous) => {
        previous.set(PARAM, next);
        return previous;
      },
      { replace: true },
    );
  };

  const look = MIS_LOOKS[key];
  return (
    <MisLookContext.Provider value={look}>
      {children}
      <PrototypeSwitcher
        variants={VARIANT_KEYS.map((one) => ({ key: one, name: MIS_LOOKS[one].name }))}
        current={key}
        onChange={change}
        hint={look.hint}
      />
    </MisLookContext.Provider>
  );
}

function readStored(): MisLookKey | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    return isLookKey(value) ? value : null;
  } catch {
    return null;
  }
}
