# 05: Repository Stats

**What to build:** A signed-in employee can open Repository Stats under Product Download Stats and follow stars, forks, watchers, and open issues, plus clone counts and unique cloners, for the products and range they choose. Unique cloners are explained as a per-day sum: the same person on two days counts twice. The measure, the products, the grain, and the dates stay in the address. The table can be searched by product name.

**Blocked by:** 01 Engineering Overview

**Status:** ready-for-agent

**Spec:** `.scratch/product-download-stats/spec.md`

- [ ] Repository Stats is in the Product Download Stats rail.
- [ ] The person can view stars, forks, watchers, or open issues over the selected range, and can switch among daily, monthly, and cumulative.
- [ ] The person can view clone counts and unique cloners. The screen explains that unique cloners are summed per day and the same person on different days counts separately.
- [ ] The person can limit the products and change the date range. The default range is the last 30 days through today. The measure, products, grain, and dates stay in the address.
- [ ] A table lists the figures by product, and the person can search it by product name.
- [ ] An empty range says there is no data. A failed request shows an error the person can retry. Figures match the API.
- [ ] A test renders Repository Stats with the HTTP boundary mocked and asserts the measure switch, the unique-cloner explanation, the address, and the table search.
