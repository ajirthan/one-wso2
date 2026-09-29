# 06: Admin

**What to build:** An admin can open Admin under Product Download Stats and manage the one tracked-repository list the existing site and the nightly jobs already use. They can add a tracked repository, change its product name, release-file prefixes, whether it is active, and whether package downloads are collected, and deactivate it without deleting history. They can read collection-job history. A person who is not an admin does not see Admin, and a direct visit says they are not allowed. There is no control that starts a collection run.

**Blocked by:** 01 Engineering Overview

**Status:** ready-for-agent

**Spec:** `.scratch/product-download-stats/spec.md`

- [ ] The Admin row appears only when the API says the caller is an admin. A person who is not an admin does not see it, and a direct visit says they are not allowed.
- [ ] The list includes inactive tracked repositories as well as active ones. Read screens elsewhere still show only active products.
- [ ] An admin can add a tracked repository. GitHub organisation and repository name are required. Product name, release-file prefixes, whether collection is on, and whether package downloads are collected can be set. An empty prefix list still means every release file is counted.
- [ ] An admin can change the product name, release-file prefixes, whether it is active, and whether package downloads are collected. Organisation and repository name stay fixed after creation.
- [ ] An admin can deactivate a tracked repository. That stops collection and removes it from the read screens. It does not delete history.
- [ ] The add, change, and deactivate actions call the existing API, so the existing site sees the same list.
- [ ] Job history shows status, counts, time, and errors for the collection runs. There is no button that starts a run.
- [ ] A failed request shows an error the person can retry.
- [ ] A test renders Admin with the HTTP boundary mocked and asserts the hidden row, the not-allowed visit, adding and deactivating a tracked repository, and the job history.
