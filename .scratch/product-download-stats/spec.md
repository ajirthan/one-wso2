# Port Product Download Stats into Engineering

**Status:** ready-for-agent

## Problem Statement

People who want Product Download Stats today leave One and open a separate site. Engineering has no perspective in One, so the figures for release downloads, package downloads, and repository stats sit outside the place employees already work. Admins who add or deactivate a tracked repository do that on the same separate site, and the nightly collection reads that one list.

## Solution

Port the existing screens into a new Engineering perspective. Product Download Stats is its first app. Every signed-in employee can read the figures. An admin can still add, change, and deactivate tracked repositories. Both this port and the existing site call the same API, so they share one list and show the same figures, including ones that look odd, until the old site is retired. This port does not retire that site, and it does not change the API or the nightly jobs.

The perspective stays hidden until a preview switch is turned on. Opening Engineering lands on Overview. One's own shell replaces the standalone site's header and sidebar. The pages, the filters, and the way a view is shared in the URL stay as they are.

## User Stories

1. As a signed-in employee, I want an Engineering perspective, so that engineering tools live in One instead of on a separate site.
2. As a signed-in employee, I want Product Download Stats to be the first thing in that perspective, so that I can open the figures without hunting for a second app.
3. As a signed-in employee, I want Engineering to be absent from the waffle, the rail, favourites, and the landing choices while the preview switch is off, so that an unfinished port never appears in production.
4. As a signed-in employee, I want a direct visit to an Engineering address to explain that it is not available while the preview switch is off, so that a bookmark does not reveal a half-ready screen.
5. As a signed-in employee, I want opening Engineering to land on Overview, so that I see the summary before any narrower screen.
6. As a signed-in employee, I want the rail to list Overview, Downloads, Versions, Packages, Repository Stats, and Admin, so that I can reach the same screens I use on the existing site.
7. As a signed-in employee who is not an admin, I want the Admin row hidden, so that I am not offered an action I cannot take.
8. As a signed-in employee who is not an admin, I want a direct visit to Admin to say I am not allowed, so that the address itself is not a way in.
9. As an employee who is not signed in, I want One to send me to sign in before any Product Download Stats screen loads, so that the figures are not public.
10. As a signed-in employee, I want Overview to show yesterday's release downloads, this month's release downloads, the latest cumulative total, how many products are tracked, and clones over the last 14 days, so that I can read the headline figures in one place.
11. As a signed-in employee, I want yesterday's figure to show how it changed against the day before, so that I can see whether downloads moved.
12. As a signed-in employee, I want clicking yesterday's figure to open Downloads for that day, so that I can see which products made it up.
13. As a signed-in employee, I want clicking this month's figure to open Downloads grouped by month, so that I can read the month the headline came from.
14. As a signed-in employee, I want clicking the cumulative total to open Downloads as a running total, so that I can see the stock of release downloads behind the headline.
15. As a signed-in employee, I want Overview to chart daily release downloads for the last 30 days across products, so that I can see the recent shape without setting a filter.
16. As a signed-in employee, I want Overview to list the top products by release downloads, so that I can see which products dominate.
17. As a signed-in employee, I want Overview to show a loading state while the summary is still arriving, so that a slow answer does not look like zero.
18. As a signed-in employee, I want Overview to show an error I can retry when the summary fails, so that a failed request is not a blank page.
19. As a signed-in employee, I want Downloads to cover the last 30 days through today when I open it with no dates, so that the screen has a useful default.
20. As a signed-in employee, I want to limit Downloads to chosen products, so that I can ignore the rest.
21. As a signed-in employee, I want to switch Downloads between daily, monthly, and cumulative, so that I can read release downloads at the grain I need.
22. As a signed-in employee, I want to change the date range on Downloads, so that I can look at a period other than the default.
23. As a signed-in employee, I want a daily Downloads chart I can switch between line and bar, so that I can read the same series either way.
24. As a signed-in employee, I want monthly Downloads drawn as bars, so that a month reads as a bucket rather than a point on a line.
25. As a signed-in employee, I want a table of release downloads by product for the selected range and grain, so that I can compare the numbers and not only the chart.
26. As a signed-in employee, I want the Downloads filters kept in the address, so that I can share or bookmark a view.
27. As a signed-in employee, I want an empty Downloads range to say there is no data, so that zero series are not mistaken for a broken chart.
28. As a signed-in employee, I want Versions to open on the first tracked product when I have not chosen one, so that the screen is not blank on arrival.
29. As a signed-in employee, I want to pick which product Versions describes, and to have that choice in the address, so that a shared link opens the same product.
30. As a signed-in employee, I want Versions to switch between daily, monthly, and cumulative release downloads, so that I can read a product's releases at the grain I need.
31. As a signed-in employee, I want the Versions chart to start with the five most recent releases, so that a long history does not drown the chart.
32. As a signed-in employee, I want to choose which releases appear on the Versions chart, including all of them, so that I can focus the chart without losing the full table.
33. As a signed-in employee, I want the Versions table to list every release in the range, with its share of the downloads shown, so that I can compare releases even when the chart is narrowed.
34. As a signed-in employee, I want to search the Versions table, so that I can find a release by name.
35. As a signed-in employee, I want clicking a release to list the files in that release and their release downloads, so that I can see which file was actually downloaded.
36. As a signed-in employee, I want Versions to say when a product has no releases or no files in the range, so that an empty product is explicit.
37. As a signed-in employee, I want Packages to list only products whose package downloads are collected, so that products with no container packages are not an empty page.
38. As a signed-in employee, I want Packages to say when no product has package downloads, so that the absence of collection is visible.
39. As a signed-in employee, I want to pick a product on Packages and switch daily, monthly, and cumulative, so that I can read package downloads the same way I read release downloads.
40. As a signed-in employee, I want the Packages chart to start with the five most active packages, and to let me show every package, so that the chart stays readable.
41. As a signed-in employee, I want the Packages table to list every package in the range, so that the table stays complete when the chart is narrowed.
42. As a signed-in employee, I want clicking a package to show its tagged versions and their package downloads, so that I can see which version was pulled.
43. As a signed-in employee, I want Repository Stats to show stars, forks, watchers, and open issues over the selected range, so that I can follow those counts the way I follow downloads.
44. As a signed-in employee, I want Repository Stats to show clone counts and unique cloners, so that I can tell total clones from distinct people.
45. As a signed-in employee, I want a note that unique cloners are summed per day and the same person on two days counts twice, so that I do not read the total as distinct people across the range.
46. As a signed-in employee, I want to filter Repository Stats by product and by daily, monthly, or cumulative, with that choice in the address, so that a shared link reproduces the view.
47. As a signed-in employee, I want to search the Repository Stats table, so that I can find a product by name.
48. As an admin, I want the Admin row and the Admin screen, so that I can manage tracked repositories inside One.
49. As an admin, I want the list to include inactive tracked repositories, so that I can see what was turned off as well as what is collected.
50. As an admin, I want to add a tracked repository with its GitHub organisation, repository name, optional product name, release-file prefixes, whether collection is on, and whether package downloads are collected, so that a new product starts appearing.
51. As an admin, I want organisation and repository name to be required when I add a tracked repository, so that I cannot save one the API would reject.
52. As an admin, I want to change a tracked repository's product name, release-file prefixes, whether it is active, and whether package downloads are collected, so that I can correct how it is counted.
53. As an admin, I want organisation and repository name to stay fixed after creation, so that I cannot silently point an existing history at a different GitHub repository.
54. As an admin, I want to deactivate a tracked repository, so that collection stops without deleting its history.
55. As an admin, I want a deactivated product to disappear from the read screens, so that employees no longer see a product that is not being collected.
56. As an admin, I want an edit I make in One to be the same edit on the existing site, so that there is one tracked-repository list rather than two.
57. As an admin, I want to read the history of the collection jobs, including status, counts, time, and errors, so that I can see whether a night failed.
58. As an admin, I want no button that starts a collection run, so that the nightly jobs remain the only way figures are gathered.
59. As a signed-in employee, I want a missing API address to say the screen is not connected, so that a forgotten setting is distinguishable from a product with no data.
60. As a signed-in employee, I want a failed request on any of these screens to show an error I can retry, so that a blip is recoverable.
61. As a signed-in employee, I want the same range on this port and on the existing site to show the same figures, so that I can trust the port during the overlap.
62. As a signed-in employee, I want a figure that looks wrong to match the existing site, so that a disagreement always means a port error and not a silent fix.

## Implementation Decisions

- Engineering is its own perspective, as recorded in ADR 0001. It is not placed under Infra Portal or Me. The whole perspective is preview-gated the same way other unfinished perspectives are: absent from the waffle, rail, favourites, and landing choices until the switch is on, and the address is closed too. Opening it forwards to Overview because the perspective has no separate home page worth stopping on.
- The port is the screens only. The existing API, its database, and both nightly jobs stay as they are. One calls that API through its public gateway address, configured per One environment. Production One uses the same API as the existing production site. Another One environment uses the matching API, so stage is compared with stage and production with production.
- One sends the signed-in employee's access token. The gateway turns that into the assertion the API already checks. The port does not learn admin group names. It asks the API whether the caller is an admin, and the API keeps enforcing admin actions itself. A person who is not an admin and opens Admin sees One's not-allowed state; the API would reject the action anyway.
- The rail is one group named Product Download Stats. Its children are Overview, Downloads, Versions, Packages, Repository Stats, and Admin. Admin is included in the group only when the API says the caller is an admin.
- Filters live in the address: products, date range, grain (daily, monthly, cumulative), the repository-stats measure, and the product chosen on Versions and Packages. The default range is the last 30 days through today, in UTC, matching the existing screens. KPI clicks on Overview write the same address Downloads already understands.
- Read screens list active tracked repositories only. Admin lists inactive ones as well. Deactivate marks a tracked repository inactive. It does not remove history. Organisation and repository name can be set only when adding. Product name, release-file prefixes, active, and whether package downloads are collected can be changed later. An empty prefix list still means every release file is counted, because that is what the API does today.
- Versions and Packages charts start narrowed to five series. The tables under them stay complete. Clearing the chart selection shows every series. Packages offers only products the API says have package downloads.
- Repository stats measures are stars, forks, watchers, and open issues, plus clone count and unique cloners. The unique-cloner explanation stays on the screen.
- Loading, empty, and error-with-retry states stay. A slow summary stays a loading state until the API answers. The port does not add a timeout, a cache, or a manual collection button.
- The current screens do not show the API's last-collection timestamp. The port does not add that banner.
- There is no separate compare screen. The API's compare operation is unused by the current screens and stays unused.
- One's existing shell, sign-in, and responsive layout are reused. The standalone site's own header, sidebar, and sign-in are not copied.
- Odd figures are reproduced. Date labels are whatever the API already returns. The port does not shift them again.

## Testing Decisions

- A good test proves what a person can see and do: which rows exist, which figures render from a given API response, where a click navigates, what the address remembers, and what a person who is not an admin cannot open. It does not assert component structure, hook names, or query keys.
- One seam: the Product Download Stats screens, rendered on the Engineering route with the HTTP boundary mocked. The same tests cover the preview switch hiding the perspective, the admin row appearing only for an admin, and a direct Admin visit by anyone else.
- Prior art is the Finance MIS screen tests, its preview-switch tests, and its rail tests. Those render a route, mock the API at the request boundary, and assert the screen. This port follows that, rather than adding a new harness or testing the unchanged API.
- The API, the database, and the nightly jobs are not given new tests here.

## Out of Scope

- Any change to the API, the database schema, the collection job, or the package-download job.
- Turning off the existing site, or deciding when that happens.
- Correcting a figure that looks wrong, including slow summaries and date labeling. Those wait until the old site is gone.
- A control that starts a collection run.
- New measures, a compare screen, or a last-collection banner.
- A second engineering app, or any change to Infra Portal.
- A separate mobile client. The screens use One's existing layout.

## Further Notes

- ADR 0001 records why Engineering is its own perspective.
- Glossary terms for this port live in the root context: Perspective, Engineering, Product Download Stats, Product, Tracked repository, Admin, Release download, Package download, Repository stats, and Port.
- For the port to answer at all, One's sign-in application has to be allowed to call the existing API through the gateway. That is a gateway setting, not a code change. Until it is set, every screen fails closed with the error state.
- The existing production site remains the place people use until someone retires it. This spec does not include that retirement.
