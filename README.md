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
| `assets/data.js` | Monthly series for the chart and the simulator: Seekingomega, IHSG, S&P 500 and gold, indexed to 100 at 30 April 2020. |
| `assets/sim.js`, `assets/sim.css` | The Rp1 juta simulator under the record table. Its EN / ID strings are in `sim.js`. |
| `assets/favicon.svg` | Tab icon. |
| `news/index.html` | News page ("Updates" / "Kabar"). Filled in by `assets/news.js` from `news/posts.js`. |
| `news/posts.js` | Every news post and category. The only file to edit for news. See "Adding a post". |
| `news/files/` | PDFs linked from posts. |
| `news/photos/` | Photos shown in posts. |
| `assets/news.js` | Renders the news page, the category filter, the photo viewer and the home page "Latest" block. |
| `assets/news.css` | Styles for the news page and the "Latest" block. |
| `tools/check-news.cjs` | Checks `news/posts.js` and that every file and photo it names exists. `node tools/check-news.cjs` |
| `.github/workflows/pages.yml` | Publishes the site, only when `tools/check-news.cjs` and a syntax check of every script pass. |
| `CNAME` | Custom domain: `seekingomega.capital`. Kept as a record; with GitHub Actions publishing, the domain set under **Settings > Pages** is what counts. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. Harmless with GitHub Actions publishing, kept in case the source is ever set back to a branch. |
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

The workflow `.github/workflows/pages.yml` publishes the repository root on every push to `main`. Every file in it except `.git` and `.github`, including this README and `tools/`, can be opened by anyone at `https://seekingomega.capital/<file>`. Keep internal notes, drafts and questions for counsel out of the repository.

Before publishing, the workflow runs `node tools/check-news.cjs` and `node --check` on every `assets/*.js` and on `news/posts.js`. If any of them fails, nothing is published, the previous site stays up, and GitHub emails a failed **Check and publish** run that names the file and line.

This repository already publishes from a branch. When you push the commit that adds `.github/workflows/pages.yml`, set **Settings**, **Pages**, **Source** to **GitHub Actions** at the same time (step 4). Until you do, every push sends a failed **Check and publish** email while the branch keeps publishing without the check. Steps 1 and 2 are only for a new repository.

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
4. Under **Build and deployment**, set **Source** to **GitHub Actions**. Nothing else to choose: the workflow in `.github/workflows/pages.yml` is used.
5. Open the **Actions** tab and wait for **Check and publish** to finish with a green tick (run it by hand with **Run workflow** if no push has happened since the switch). The site is now at `https://<user>.github.io/seekingomega-site/`. Check it there before pointing the domain.

If the default branch is not `main`, change `branches: [main]` in the workflow. To go back to publishing without the check, set **Source** to **Deploy from a branch**, branch **main**, folder **/ (root)**, and delete `.github/workflows/pages.yml`.

## Point the domain

1. In **Settings**, **Pages**, enter `seekingomega.capital` under **Custom domain** and save. With GitHub Actions publishing this setting is what counts; the `CNAME` file holds the same value as a record.
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
4. **Chart data.** In `assets/data.js`, append the new month to `months` (`"2026-10"`), a `1` to `recorded`, and one value to each of the four `series`, all indexed to 100 at 30 April 2020:
   - `fund`: NAV per unit ÷ 1,000 × 100.
   - `ihsg`: IHSG close ÷ 4,716.40 × 100.
   - `spx`: S&P 500 close (Yahoo `^GSPC`) × USD/IDR (Yahoo `IDR=X`), both at month end, ÷ 44,369,812 (2,912.43 × 15,234.64 at 30 April 2020, computed from the unrounded closes) × 100.
   - `gold`: gold close (Yahoo `GC=F`) × the same USD/IDR, ÷ 25,658,174 (1,684.20 × 15,234.64 at 30 April 2020, computed from the unrounded closes) × 100.
   Set `asOf` to the NAV date. In `index.html`, update the date and the four numbers in the one-line chart summary (`data-chart-t="summary"`), which is what shows without JavaScript. If the worst fall changes, update `FALL` in `assets/chart.js`. Then update the S&P 500 and gold columns of the record table the same way as the others.
   - **Simulator** (`id="simulation"` in `index.html`). The month list, end date and results come from `assets/data.js`, so nothing else changes with JavaScript on. Without JavaScript the page shows the static default (Rp1,000,000 from April 2020); update it by hand:
     - Each row's value and % change: value = 1,000,000 × last ÷ first of that series (for example `Rp4.08 million`, `+308.3%`). The rows are listed from highest to lowest; reorder the `<li>` elements if that changes.
     - Bar widths: each row's `sim-fill` width = its value ÷ the highest value × 100%.
     - Marker: every `sim-mark` and the `sim-axis-l` label get `left` = 1,000,000 ÷ the highest value × 100%.
     - The end date in the `sim-nojs` line.
5. **IHSG closes.** In both language blocks of `disclosures/index.html`, replace the latest IHSG close (30 September 2026) with the new month-end close. Add a row only when a new year-end close is used.
6. **Updated.** Change `Updated October 2026` and `Diperbarui Oktober 2026` (`ft.updated`) on both pages.
7. **New year.** In January, add a row for the year just closed, start a new current-year row, and change `© 2020–2026` in the footer of both pages.
8. Check the page in both languages (`?lang=id`), then commit and push. The **Check and publish** run redeploys the site in about a minute; a red cross in the **Actions** tab means it was not published.

## Translation

English is written directly in the HTML so the page reads correctly without JavaScript and for search engines. Each translatable element carries `data-i18n="key"`, and the Indonesian text for that key lives in the `ID` object at the top of `assets/site.js`. When you change English copy, change the Indonesian entry with the same key. The toggle remembers the reader's choice in the browser, and a reader whose browser language is Indonesian sees Indonesian first.

## Changing the legal entity

The site names one legal entity, written identically everywhere: `PT Triple Delapan Investama Sedaya`. If the legal entity changes, replace these strings. Search the whole folder for `Triple Delapan` afterwards to confirm nothing is left.

| File | Where | What to change |
|---|---|---|
| `index.html` | Footer, `ft.entity` | "Seekingomega Capital is a name used by PT Triple Delapan Investama Sedaya." |
| `index.html` | Footer, `foot-meta` | "© 2026 PT Triple Delapan Investama Sedaya" |
| `disclosures/index.html` | Footer, `foot-meta` | "© 2026 PT Triple Delapan Investama Sedaya" |
| `news/index.html` | Footer, `foot-meta` | "© 2026 PT Triple Delapan Investama Sedaya" |
| `news/index.html` and `assets/site.js` | Meta description, `nw.desc` | "PT Triple Delapan Investama Sedaya" |
| `disclosures/index.html` | Meta description and `og:description` | "a name used by PT Triple Delapan Investama Sedaya" |
| `disclosures/index.html` | "Who we are", English | Entity name and legal form "a limited liability company (perseroan terbatas)" |
| `disclosures/index.html` | "Siapa kami", Indonesian | Entity name and domicile wording "berkedudukan di Jakarta" |
| `assets/site.js` | `ft.entity` and `dc.desc` | Indonesian versions of the entity sentence and the disclosures meta description |

The legal form wording ("limited liability company", "berkedudukan di Jakarta") appears only on the disclosures page. When the registration number (NIB or AHU) is known, add it as a sentence in "Who we are" and "Siapa kami".

The convertible notes post in `news/posts.js` also names the entity. Leave it: it is a record of what that entity did.

## Adding a post

News lives on one page, `news/` ("Updates" / "Kabar"). The home page shows the three newest posts under "Latest". Every post and every category is in one file: `news/posts.js`. Nothing else needs to change.

**One rule for commas:** every line ends with a comma, except a line that ends with `{` or `[`. The last item in a list gets a comma too.

### Add a post

1. On GitHub, open `news/posts.js` and click the pencil icon (**Edit this file**).
2. Copy the template below. Paste it under the line that says `posts: [` (not into the example at the top of the file; that one is only a comment and does nothing).
3. Fill it in.
4. Click **Commit changes**. The site updates about a minute later.

```js
    {
      slug: "rups-2026",
      date: "2026-06-30",
      category: "rups",
      title: {
        en: `Annual general meeting 2026`,
        id: `RUPS tahunan 2026`,
      },
      body: {
        en: `First paragraph.

Second paragraph after an empty line.`,
        id: `Paragraf pertama.

Paragraf kedua setelah satu baris kosong.`,
      },
      files: [
        { label: { en: "Minutes", id: "Risalah" }, href: "files/2026-06-rups-minutes.pdf" },
      ],
      photos: [
        { src: "photos/rups-2026/01.jpg", alt: { en: "Shareholders at the meeting", id: "Pemegang saham dalam rapat" } },
        { src: "photos/rups-2026/02.jpg", alt: { en: "The vote", id: "Pemungutan suara" } },
      ],
    },
```

| Field | What to write |
|---|---|
| `slug` | Short name used in the link, `news/#rups-2026`. Lowercase letters, numbers and hyphens. If you leave it out, or use one twice, the page makes one up. |
| `date` | Keep the quotes. `"2026-06-30"` is best; `"30-06-2026"`, `"30/6/2026"` and `"30 Juni 2026"` also work. Posts are sorted newest first by this date, so where you paste the block does not matter. |
| `category` | One of the codes under `categories`: `"laporan-keuangan"`, `"update"` or `"rups"`. The button text (`"RUPS"`, `"Laporan keuangan"`) works too. |
| `title`, `body` | `en` is English, `id` is Bahasa Indonesia. Write the text between backticks (`` ` ``). Apostrophes, quotes and line breaks are fine there. An empty line starts a new paragraph. No HTML. If one language is missing, the other is shown. |
| `files` | Optional. One line per PDF, each ending with a comma. `label` is the link text; "(PDF)" is added automatically. |
| `photos` | Optional. One line per photo, each ending with a comma. `alt` describes the photo for screen readers and is shown under it when enlarged. |
| `facts` | Optional. A short label and value list, as in the convertible notes post: `{ label: { en: "Tenor", id: "Tenor" }, value: { en: "5 years", id: "5 tahun" } },`. |

Delete any optional part you do not need (`files`, `photos`, `facts`), from its name to its closing `],`.

**Inside the text, do not type `` ` `` or `${`.** Both break the whole file. If a text has to contain them, or backticks are hard to type on your keyboard, use double quotes and one quoted text per paragraph instead:

```js
      body: {
        en: ["First paragraph.", "Second paragraph. Apostrophes like PT's are fine here."],
        id: ["Paragraf pertama.", "Paragraf kedua."],
      },
```

Inside double quotes, do not type another `"` and do not press Enter.

### Upload a PDF or photos

1. On GitHub, open the folder `news/files` (PDFs) or `news/photos` (photos).
2. Click **Add file**, then **Upload files**, drag the files in, and click **Commit changes**.
3. To keep one meeting's photos together, drag a whole folder from your computer (for example `rups-2026` with `01.jpg`, `02.jpg` inside) onto the upload page. GitHub keeps the folder.
4. In `news/posts.js`, write the path starting from `files/` or `photos/`: `files/2026-06-rups-minutes.pdf`, `photos/rups-2026/01.jpg`. Copy the file name from the GitHub folder list. Upper and lower case must match: `IMG_0001.JPG` is not `IMG_0001.jpg`.

Photos must be JPG or PNG. iPhone HEIC photos do not show in Chrome: set **Settings > Camera > Formats > Most Compatible**, or export them as JPG first. Keep photos under about 500 KB each (2000 pixels on the long side is plenty). File names without spaces are safest. A photo that cannot be found is left out of the page.

### Remove a post

Delete its whole block, from `{` to the matching `},`. Delete the PDF or photos in `news/files` or `news/photos` too if nothing else uses them (open the file on GitHub, then the **…** menu, **Delete file**).

### Add or remove a category

Categories are at the top of `news/posts.js`:

```js
  categories: [
    { code: "laporan-keuangan", en: "Financial reports", id: "Laporan keuangan" },
    { code: "update", en: "Company news", id: "Kabar perusahaan" },
    { code: "rups", en: "Shareholder meetings", id: "RUPS" },
  ],
```

`code` is the short name posts use. `en` and `id` are the button text in English and Indonesian.

- **Add:** copy a line, give it a new `code` (lowercase, hyphens) and the two labels. Every line ends with a comma. It appears as a filter button on the news page in the order listed.
- **Rename:** change `en` and `id`. Leave `code` alone, posts point to it.
- **Remove:** first press Ctrl+F (Cmd+F on a Mac) and search `posts.js` for the code. Change or delete every post that uses it. Then delete the category line. Posts that still use a removed code disappear from the news page and from the home page "Latest" block.

A category with no posts shows "No posts yet." when selected. Link to one category with `news/?cat=rups`.

### If something does not show

- **The news page says "news/posts.js has a typing error at or just above line N"**: open `news/posts.js` and look at that line and the line above it. Usually a comma is missing at the end of the line above, or a quote or backtick is missing or extra. Fix it and commit again.
- **To undo your last change completely:** open `news/posts.js` on GitHub, click **History**, open the change before yours, click the **…** menu, **View file**, then **Raw**. Select everything, copy it, open `news/posts.js` in the editor again, replace everything with what you copied, and commit.
- **The page only says "Updates could not be loaded."**: `news/posts.js` is missing or was renamed, or the page is open from your own computer, where the browser does not say which line. Use the steps above.
- **One post is missing:** its `category` is not one of the codes or button labels, or it has no `title`. A post whose date cannot be read is shown at the bottom without a date. The browser console (right click, **Inspect**, **Console**) names the post and the reason.
- **A post sits above everything else:** its date is in the future.
- **GitHub emails "Check and publish" failed**: the change was not published and the site still shows the previous version. Open the failed run; it names the line in `news/posts.js` or the file name that does not match. Fix it and commit again.
- **A photo is missing:** the path in `photos` does not match the uploaded file name exactly, or it is a HEIC file.
