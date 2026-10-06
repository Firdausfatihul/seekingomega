/* =====================================================================
   Seekingomega Capital: news posts and categories.
   This is the only file to edit when adding or removing news.

   en = English, id = Bahasa Indonesia. Everywhere in this file.
   If one language is missing, the other is shown.

   ONE RULE FOR COMMAS: every line ends with a comma, except a line
   that ends with { or [. The last item in a list gets a comma too.

   ADD A POST: copy the example below and paste it under the line
   that says  posts: [  further down. Then fill it in. The page
   sorts posts by date itself, newest first.

   ----- EXAMPLE ONLY. Editing it here does nothing. Copy it. -----

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

   ----- END OF EXAMPLE -----

   - slug: short name for the link (news/#rups-2026). Lowercase
     letters, numbers and hyphens. If left out, one is made up.
   - date: year-month-day, for example "2026-06-30". Keep the quotes.
     "30-06-2026" and "30 Juni 2026" also work.
   - category: one of the codes under "categories" below.
   - Text goes between backticks ` ` so apostrophes, quotes and line
     breaks are fine. An empty line starts a new paragraph.
     Inside the text, do not type ` or ${ .
   - files, photos and facts are optional. Delete the lines you do
     not need. Upload PDFs to news/files and photos to news/photos
     first. Copy the file name from the GitHub folder list, so upper
     and lower case match (.jpg is not .JPG). Photos: JPG or PNG.
   - facts (optional) is a short list of label and value, see the
     convertible notes post below.

   REMOVE A POST: delete its whole block, from { to },

   CATEGORIES: add one line like the ones below.
   code = the short name posts use in category: "...".
   en / id = button text in English / Indonesian.
   Removing a category hides every post that still uses its code,
   on the news page and on the home page.
   ===================================================================== */

window.SO_NEWS = {
  categories: [
    { code: "laporan-keuangan", en: "Financial reports", id: "Laporan keuangan" },
    { code: "update", en: "Company news", id: "Kabar perusahaan" },
    { code: "rups", en: "Shareholder meetings", id: "RUPS" },
  ],

  posts: [
    {
      slug: "convertible-notes-2026",
      date: "2026-10-06",
      category: "update",
      title: {
        en: `Convertible notes, Rp405 million`,
        id: `Surat utang konversi (convertible notes) Rp405 juta`,
      },
      body: {
        en: `PT Triple Delapan Investama Sedaya will issue convertible notes.

Private placement with a committed standby buyer. Not offered to the public.`,
        id: `PT Triple Delapan Investama Sedaya akan menerbitkan surat utang konversi.

Penempatan tertutup dengan pembeli siaga yang sudah berkomitmen. Tidak ditawarkan kepada publik.`,
      },
      facts: [
        { label: { en: "Amount", id: "Jumlah" }, value: { en: "Rp405 million", id: "Rp405 juta" } },
        { label: { en: "Conversion price", id: "Harga konversi" }, value: { en: "Rp1,000 per share", id: "Rp1.000 per saham" } },
        { label: { en: "Interest", id: "Bunga" }, value: { en: "0%", id: "0%" } },
        { label: { en: "Tenor", id: "Tenor" }, value: { en: "5 years", id: "5 tahun" } },
      ],
    },
  ],
};
