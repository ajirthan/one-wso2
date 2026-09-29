# 03: Versions

**What to build:** A signed-in employee can open Versions under Product Download Stats and see one product's release downloads by version. With no product chosen, the screen uses the first active tracked repository. They can switch daily, monthly, and cumulative. The chart starts with the five most recent releases and can be widened to every release. The table always lists every release in the range, including each release's share of the downloads, and can be searched. Choosing a release lists that release's files and their release downloads.

**Blocked by:** 01 Engineering Overview

**Status:** ready-for-agent

**Spec:** `.scratch/product-download-stats/spec.md`

- [ ] Versions is in the Product Download Stats rail. With no product in the address, it shows the first active tracked repository. The chosen product stays in the address.
- [ ] The person can switch among daily, monthly, and cumulative release downloads for that product.
- [ ] The chart starts with the five most recent releases. The person can choose which releases appear, including all of them. The table still lists every release in the range, with its share of the downloads shown.
- [ ] The person can search the table by release name.
- [ ] Choosing a release lists the files in that release and their release downloads. The person can clear that selection.
- [ ] A product with no releases, or a release with no files in the range, says so. A failed request shows an error the person can retry.
- [ ] Dates and counts match the API. An empty release-file prefix list is not reinterpreted.
- [ ] A test renders Versions with the HTTP boundary mocked and asserts the default product, the narrowed chart, the full table, and the file list for a chosen release.
