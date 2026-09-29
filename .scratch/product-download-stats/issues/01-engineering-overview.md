# 01: Engineering Overview

**What to build:** A signed-in employee can open a preview-gated Engineering perspective and land on Product Download Stats Overview. Overview shows yesterday's release downloads (and how they changed against the day before), this month's release downloads, the latest cumulative total, how many products are tracked, clones over the last 14 days, a chart of daily release downloads for the last 30 days, and the top products. Figures come from the existing API, unchanged. While the preview switch is off, Engineering does not appear anywhere and a direct address says it is not available.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

**Spec:** `.scratch/product-download-stats/spec.md`

- [ ] With the preview switch off, Engineering is absent from the waffle, the rail, favourites, and the landing choices, and a direct visit says it is not available.
- [ ] With the preview switch on, a signed-in employee can open Engineering and lands on Overview.
- [ ] Someone who is not signed in is sent to sign in before Overview loads.
- [ ] Overview shows yesterday's release downloads with the change against the day before, this month's release downloads, the cumulative total, products tracked, and clones over the last 14 days.
- [ ] Overview charts daily release downloads for the last 30 days and lists the top products.
- [ ] A slow summary stays a loading state until the API answers. A failed summary shows an error the person can retry.
- [ ] A missing API address says the screen is not connected, which is distinct from a product with no data.
- [ ] The port calls the existing API and does not reinterpret its dates or totals. A figure that looks odd still matches the API.
- [ ] A test renders Overview on the Engineering route with the HTTP boundary mocked and asserts what the person sees, including the preview switch hiding the perspective.
