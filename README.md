# seekingomega.capital

Static site for Seekingomega Capital. Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies. The only external request is Google Fonts (Newsreader and IBM Plex Sans).

## Files

| Path | What it is |
|---|---|
| `index.html` | The home page, in English. Indonesian is applied by `assets/site.js`. |
| `disclosures/index.html` | Full legal disclosures. Both languages are in the file; the toggle shows one. |
| `404.html` | Page GitHub Pages shows for a missing address. Styles are inline because it can be served at any path. |
| `assets/site.css` | All styles. Colour, type and spacing tokens are at the top. In dark mode `--paper-sunk` is `#2A241D` rather than `#221D17`, because `#221D17` cannot be told apart from the record panel (`--paper-raised`, `#1F1B16`). |
| `assets/site.js` | EN / ID toggle, the Indonesian dictionary, and the current-section marker in the nav. |
| `assets/favicon.svg` | Tab icon. |
| `CNAME` | Custom domain for GitHub Pages: `seekingomega.capital`. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |
| `robots.txt` | Allows all crawlers. |
| `.gitignore` | Keeps macOS `.DS_Store` files out of the repository. |

All links between files are relative (`assets/site.css`, `../assets/site.css`), so the site works both at `https://<user>.github.io/<repo>/` and at `https://seekingomega.capital/`.

## Preview locally

Open `index.html` in a browser, or run a small server from this folder:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Add `?lang=id` to the address to see the Indonesian version, for example `http://localhost:8000/?lang=id`. The same works on the live site and is useful for sharing a link in Indonesian. The choice is remembered, so the reader stays in Indonesian on the disclosures page.

## Publish on GitHub Pages

This repository is published from its root, so every file in it, including this README, can be opened by anyone at `https://seekingomega.capital/<file>`. Keep internal notes, drafts and questions for counsel out of the repository.

1. Create a repository on GitHub, for example `seekingomega-site`. It can be public or, on a paid plan, private.
2. From this folder:

   ```sh
   git init
   git add .
   git commit -m "First version of seekingomega.capital"
   git branch -M main
   git remote add origin git@github.com:<user>/seekingomega-site.git
   git push -u origin main
   ```

3. On GitHub, open the repository, then **Settings**, then **Pages**.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
5. Wait for the first deploy (the **Actions** tab shows it). The site is now at `https://<user>.github.io/seekingomega-site/`. Check it there before pointing the domain.

## Point the domain

1. In **Settings**, **Pages**, enter `seekingomega.capital` under **Custom domain** and save. The `CNAME` file in this repository already holds the same value.
2. At the registrar or DNS host for `seekingomega.capital`, create these records for the apex domain (`@`):

   | Type | Name | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | AAAA | @ | 2606:50c0:8000::153 |
   | AAAA | @ | 2606:50c0:8001::153 |
   | AAAA | @ | 2606:50c0:8002::153 |
   | AAAA | @ | 2606:50c0:8003::153 |
   | CNAME | www | `<user>.github.io` |

   Remove any other A, AAAA or ALIAS records on `@` that point elsewhere.
3. DNS changes can take up to a day to spread. When GitHub shows the domain as verified, tick **Enforce HTTPS**.
4. Optional but recommended: verify the domain for your GitHub account (**Settings** of your profile or organisation, then **Pages**, then **Add a domain**) so nobody else can claim it.

## Monthly update

Do this once a month, after the month-end NAV is final. Every figure on the site carries a date, so all of them move together.

1. **Record table** in `index.html`, section `id="record"`:
   - Update the figures in the row for the current year (`2026, Jan to 30 Sep` becomes `2026, Jan to 31 Oct`, and so on). Change the label text in `index.html` and the matching `rec.r2026` entry in `assets/site.js`.
   - Update the three closing rows: since May 2020, annualised, and the worst fall if it has changed. Their labels are `rec.since`, `rec.ann` and `rec.dd` in `assets/site.js`.
   - Update the month count line under the table (`rec.months`, "68 months: 31 up, 24 down, 13 flat.").
   - Update the caption end date (`rec.caption`, "% change, to 30 September 2026").
   - Write figures with one decimal, a plus sign for gains and a true minus sign (−, not a hyphen) for losses. The Indonesian decimal comma is applied automatically.
2. **Dates.** Search `index.html`, `assets/site.js` and `disclosures/index.html` for the old date (for example `30 September 2026`) and replace every occurrence: the table caption (`rec.caption`), the holdings line (`hold.asof`). Write the Indonesian dates with Indonesian month names (for example `31 Oktober 2026`) in `assets/site.js` and in the Indonesian block of the disclosures page; a search and replace of the English date will not change those.
3. **Holdings.** If a position was bought or sold, edit the list in `index.html` (`id="holdings"`), and the Indonesian descriptions (`hold.*`) in `assets/site.js`.
4. **Chart.** In `assets/chart.js`, append the new month-end value to `FUND` and to `IHSG` (both indexed to 100 at 30 April 2020: NAV per unit ÷ inception NAV × 100, IHSG close ÷ 4,716.40 × 100) and set `AS_OF` to the day of the month-end NAV. In `index.html`, update the date and the two numbers in the one-line chart summary (`data-chart-t="summary"`), which is what shows without JavaScript. If the worst fall changes, update `FALL`.
5. **IHSG closes.** In both language blocks of `disclosures/index.html`, replace the latest IHSG close (30 September 2026) with the new month-end close. Add a row only when a new year-end close is used.
6. **Updated.** Change `Updated October 2026` and `Diperbarui Oktober 2026` (`ft.updated`) on both pages.
7. **New year.** In January, add a row for the year just closed, start a new current-year row, and change `© 2020–2026` in the footer of both pages.
8. Check the page in both languages (`?lang=id`), then commit and push. GitHub Pages redeploys in about a minute.

## Translation

English is written directly in the HTML so the page reads correctly without JavaScript and for search engines. Each translatable element carries `data-i18n="key"`, and the Indonesian text for that key lives in the `ID` object at the top of `assets/site.js`. When you change English copy, change the Indonesian entry with the same key. The toggle remembers the reader's choice in the browser, and a reader whose browser language is Indonesian sees Indonesian first.

## Changing the legal entity

The site names one legal entity, written identically everywhere: `CV Maju Insan Sejahtera`. If the legal entity changes, replace these strings. Search the whole folder for `Maju Insan` afterwards to confirm nothing is left.

| File | Where | What to change |
|---|---|---|
| `index.html` | Footer, `ft.entity` | "Seekingomega Capital is a name used by CV Maju Insan Sejahtera, Jakarta." |
| `index.html` | Footer, `foot-meta` | "© 2020–2026 CV Maju Insan Sejahtera" |
| `disclosures/index.html` | Footer, `foot-meta` | "© 2020–2026 CV Maju Insan Sejahtera" |
| `disclosures/index.html` | Meta description and `og:description` | "a name used by CV Maju Insan Sejahtera, Jakarta" |
| `disclosures/index.html` | "Who we are", English | Entity name and legal form "a limited partnership (persekutuan komanditer)" |
| `disclosures/index.html` | "Siapa kami", Indonesian | Entity name and legal form "persekutuan komanditer" |
| `assets/site.js` | `ft.entity` and `dc.desc` | Indonesian versions of the entity sentence and the disclosures meta description |

The legal form wording ("limited partnership", "persekutuan komanditer") appears only on the disclosures page. When the registration number (NIB or AHU) is known, add it as a sentence in "Who we are" and "Siapa kami".
