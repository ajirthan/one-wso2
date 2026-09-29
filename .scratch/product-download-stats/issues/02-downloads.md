# 02: Downloads

**What to build:** A signed-in employee can open Downloads under Product Download Stats and read release downloads by product. The screen defaults to the last 30 days through today (UTC). They can limit the products, change the date range, and switch among daily, monthly, and cumulative. Daily can be a line or a bar chart; monthly is bars. A table lists the same figures. The filters stay in the address, and the Overview headlines open this screen already filtered.

**Blocked by:** 01 Engineering Overview

**Status:** ready-for-agent

**Spec:** `.scratch/product-download-stats/spec.md`

- [ ] Downloads is in the Product Download Stats rail and opens on the last 30 days through today when the address has no dates.
- [ ] The person can limit the products, change the date range, and switch among daily, monthly, and cumulative. Those choices stay in the address, so a shared link opens the same view.
- [ ] Daily release downloads can be shown as a line or as bars. Monthly release downloads are bars. Cumulative is a running total.
- [ ] A table lists release downloads by product for the selected range and grain.
- [ ] An empty range says there is no data. A failed request shows an error the person can retry.
- [ ] Clicking yesterday on Overview opens Downloads for that day. Clicking this month opens Downloads grouped by month. Clicking the cumulative total opens Downloads as a running total.
- [ ] Only active tracked repositories are offered. Dates and totals are shown as the API returns them.
- [ ] A test renders Downloads with the HTTP boundary mocked and asserts the figures, the address, the empty state, and the Overview headline links.
