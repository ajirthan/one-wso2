# 04: Packages

**What to build:** A signed-in employee can open Packages under Product Download Stats and see package downloads for products that collect them. Products with no package downloads are not offered. They can pick a product and switch daily, monthly, and cumulative. The chart starts with the five most active packages and can show every package. The table lists every package in the range. Choosing a package shows its tagged versions and their package downloads.

**Blocked by:** 01 Engineering Overview

**Status:** ready-for-agent

**Spec:** `.scratch/product-download-stats/spec.md`

- [ ] Packages is in the Product Download Stats rail and lists only products the API says have package downloads.
- [ ] When no product has package downloads, the screen says so.
- [ ] The person can pick a product and switch among daily, monthly, and cumulative. The product and the grain stay in the address.
- [ ] The chart starts with the five most active packages. The person can show every package. The table still lists every package in the range.
- [ ] Choosing a package shows its tagged versions and their package downloads.
- [ ] A failed request shows an error the person can retry. Counts match the API.
- [ ] A test renders Packages with the HTTP boundary mocked and asserts that products without package downloads are absent, the chart starts at five, the table is complete, and a chosen package shows its versions.
