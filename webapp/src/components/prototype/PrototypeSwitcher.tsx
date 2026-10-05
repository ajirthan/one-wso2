// PROTOTYPE (branch prototype/mis-look) — throwaway, never merge.
//
// The floating variant switcher every UI prototype shares: a high-contrast pill
// fixed at the bottom centre, with ← / → arrows that cycle the `?variant=`
// search param (wrapping), the current key and its name, and keyboard arrows
// doing the same unless a text field has focus. Hidden outside dev so a stray
// merge can never ship it.

import { useEffect } from "react";
import { Box, IconButton, Typography } from "@wso2/oxygen-ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@wso2/oxygen-ui-icons-react";

export interface PrototypeVariant {
  key: string;
  name: string;
}

export default function PrototypeSwitcher({
  variants,
  current,
  onChange,
  hint,
}: {
  variants: readonly PrototypeVariant[];
  current: string;
  onChange: (key: string) => void;
  /** One line under the name — what this variant is testing. */
  hint?: string;
}) {
  const index = Math.max(0, variants.findIndex((variant) => variant.key === current));
  const step = (delta: number) =>
    onChange(variants[(index + delta + variants.length) % variants.length].key);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (import.meta.env.PROD) return null;

  return (
    <Box
      role="toolbar"
      aria-label="Prototype variant"
      sx={{
        position: "fixed",
        left: "50%",
        bottom: 16,
        transform: "translateX(-50%)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 999,
        bgcolor: "#111827",
        color: "#f9fafb",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.12)",
        fontFamily: "Inter Variable, Inter, system-ui, sans-serif",
      }}
    >
      <IconButton size="small" onClick={() => step(-1)} aria-label="Previous variant" sx={{ color: "inherit" }}>
        <ChevronLeftIcon size={16} />
      </IconButton>
      <Box sx={{ textAlign: "center", minWidth: 220, lineHeight: 1.15 }}>
        <Typography component="div" sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3 }}>
          {current} · {variants[index]?.name}
        </Typography>
        {hint && (
          <Typography component="div" sx={{ fontSize: 10.5, opacity: 0.75 }}>
            {hint}
          </Typography>
        )}
      </Box>
      <IconButton size="small" onClick={() => step(1)} aria-label="Next variant" sx={{ color: "inherit" }}>
        <ChevronRightIcon size={16} />
      </IconButton>
    </Box>
  );
}
