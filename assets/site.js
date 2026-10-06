/* Seekingomega Capital. Language toggle and current-section marker.
   English is written in the HTML. Indonesian strings live below, keyed by data-i18n. */
(function () {
  "use strict";

  var ID = {
    /* shared */
    "meta.title": "Seekingomega Capital",
    "meta.desc": "Tiga associate di Jakarta yang membeli saham emiten kecil BEI di tengah aksi korporasi. Sejak Mei 2020.",
    "skip": "Langsung ke konten",
    "notice": "Kami tidak punya grup WhatsApp atau Telegram, dan tidak membagi rekomendasi saham. Yang menghimpun dana atas nama kami, itu bukan kami.",
    "nav.label": "Utama",
    "nav.approach": "Pendekatan",
    "nav.record": "Kinerja",
    "nav.holdings": "Portofolio",
    "nav.people": "Tim",
    "nav.contact": "Kontak",
    "nav.home": "Beranda",
    "lang.label": "Bahasa",

    /* hero */
    "hero.eyebrow": "Jakarta, sejak Mei 2020",
    "hero.h1": "Kami membeli saham emiten kecil di BEI menjelang perubahan pemilik, modal, atau&nbsp;strukturnya.",
    "facts.capital.t": "Modal",
    "facts.capital.d": "USD xx.xxx.xxx. Cukup kecil untuk membeli yang tak bisa dibeli dana besar.",
    "facts.open.t": "Terbuka untuk umum",
    "facts.open.d": "Tidak.",

    /* approach */
    "ap.h2": "Emiten kecil, prospektus tebal",
    "ap.objective": "Bacaan wajib: keterbukaan informasi BEI.",
    "ap.s1.t": "<span lang=\"en\">Rights issue</span>",
    "ap.s1.d": "Siapa pembeli siaganya, dan siapa yang terdilusi.",
    "ap.s2.t": "<span lang=\"en\">Tender offer</span>",
    "ap.s2.d": "Harga penawarannya. Lalu sisa untuk pemegang saham lain.",
    "ap.s3.t": "Merger dan akuisisi",
    "ap.s3.d": "Siapa pengendali barunya. Apakah tender offer wajib menyusul.",
    "ap.s4.t": "<span lang=\"en\">Backdoor listing</span>",
    "ap.s4.d": "Apa yang dimasukkan ke cangkangnya, dan berapa harganya.",
    "ap.s5.t": "Restrukturisasi",
    "ap.s5.d": "Siapa pemiliknya setelah utang menjadi saham.",
    "ap.s6.t": "<span lang=\"en\">Spin-off</span>",
    "ap.s6.d": "Usaha yang diserahkan kepada pemegang saham yang tidak pernah memintanya.",

    /* record */
    "rec.h2": "Dibanding IHSG",
    "rec.intro": "Tahun 2022 bagus sekali. Belum terulang.",
    "rec.caption": "Perubahan %, hingga 30 September 2026",
    "rec.col.period": "Periode",
    "rec.col.diff": "Selisih, poin",
    "rec.r2020": "2020, Mei&nbsp;s.d.&nbsp;Des",
    "rec.r2024": "Jan&nbsp;2024 s.d.&nbsp;Apr&nbsp;2025<sup><a href=\"#fn1\" aria-label=\"Catatan 1\">1</a></sup>",
    "rec.r2025": "Mei&nbsp;s.d.&nbsp;Des 2025",
    "rec.r2026": "2026, Jan&nbsp;s.d. 30&nbsp;Sep",
    "rec.since": "Sejak Mei&nbsp;2020",
    "rec.ann": "Disetahunkan",
    "rec.dd": "Penurunan terdalam, Okt&nbsp;2023 s.d.&nbsp;Jun&nbsp;2025",
    "rec.na": "Tidak dibandingkan",
    "rec.months": "68 bulan: 31 naik, 24 turun, 13 datar.",
    "rec.fn1": "NAB tidak tercatat Agu 2024 s.d. Apr 2025.",
    "rec.fn2": "Modal para mitra sendiri, dihitung per unit, tidak diaudit. IHSG tanpa dividen.",

    /* holdings */
    "hold.h2": "Saham yang kami pegang",
    "hold.ex": "BEI",
    "hold.ades": "Air minum dalam kemasan dan produk perawatan diri.",
    "hold.heli": "Sewa helikopter dan jasa penerbangan.",
    "hold.inps": "Logistik BBM dan gas.",
    "hold.asof": "Per 30 September 2026. Bukan rekomendasi. Bisa saja sudah kami jual sebelum halaman ini diperbarui.",

    /* people */
    "ppl.h2": "Tiga associate",
    "ppl.daus": "Analis <span lang=\"en\">small cap</span>. Biasa dipanggil Daus.",
    "ppl.ghafur": "Aksi korporasi serta merger dan akuisisi. Membedah setiap transaksi: para pihak, harga, jadwal.",
    "ppl.josh": "Dari industri rokok. Negeri kretek.",

    /* contact */
    "ct.h2": "Kirim email ke kami",
    "ct.p1": "Khusus perorangan yang memenuhi syarat, perusahaan, dan sesama investor.",
    "ct.button": "Email ketiga associate",

    /* footer */
    "ft.entity": "Seekingomega Capital adalah nama yang dipakai PT Triple Delapan Investama Sedaya.",
    "ft.legal": "Tidak berizin OJK. Bukan penawaran, bukan nasihat. Kinerja masa lalu tidak mencerminkan kinerja masa datang.",
    "ft.disc": "Pengungkapan",
    "ft.updated": "Diperbarui Oktober 2026",

    /* disclosures page chrome */
    "dc.title": "Pengungkapan | Seekingomega Capital",
    "dc.desc": "Seekingomega Capital adalah nama yang dipakai PT Triple Delapan Investama Sedaya. Tidak berizin OJK. Bukan penawaran.",
    "dc.h1": "Pengungkapan"
  };

  var root = document.documentElement;
  var KEY = "so-lang";

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ }
  }

  /* Remember the English that ships in the HTML so it can be restored. */
  var textNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n]")).map(function (el) {
    return { el: el, key: el.getAttribute("data-i18n"), en: el.innerHTML };
  });
  var contentNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-content]")).map(function (el) {
    return { el: el, key: el.getAttribute("data-i18n-content"), en: el.getAttribute("content") };
  });
  var ariaNodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n-aria]")).map(function (el) {
    return { el: el, key: el.getAttribute("data-i18n-aria"), en: el.getAttribute("aria-label") };
  });
  var numNodes = Array.prototype.slice.call(document.querySelectorAll(".n")).map(function (el) {
    return { el: el, en: el.textContent };
  });
  var blocks = document.querySelectorAll("[data-lang-block]");
  var buttons = document.querySelectorAll("[data-lang-set]");

  /* 1,234.5 becomes 1.234,5 */
  function idNumber(s) {
    return s.replace(/[.,]/g, function (c) { return c === "." ? "," : "."; });
  }

  function apply(lang) {
    var id = lang === "id";
    textNodes.forEach(function (n) {
      var v = id && Object.prototype.hasOwnProperty.call(ID, n.key) ? ID[n.key] : n.en;
      if (n.el.tagName === "TITLE") { document.title = v; } else { n.el.innerHTML = v; }
    });
    contentNodes.forEach(function (n) {
      n.el.setAttribute("content", id && ID[n.key] ? ID[n.key] : n.en);
    });
    ariaNodes.forEach(function (n) {
      n.el.setAttribute("aria-label", id && ID[n.key] ? ID[n.key] : n.en);
    });
    numNodes.forEach(function (n) {
      n.el.textContent = id ? idNumber(n.en) : n.en;
    });
    Array.prototype.forEach.call(blocks, function (b) {
      b.hidden = b.getAttribute("data-lang-block") !== lang;
    });
    Array.prototype.forEach.call(buttons, function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-set") === lang));
    });
    root.setAttribute("lang", id ? "id" : "en");
    /* Lets assets/chart.js re-label itself. */
    try { document.dispatchEvent(new Event("langchange")); } catch (e) { /* very old browser */ }
  }

  function initial() {
    var q = /[?&]lang=(en|id)\b/.exec(window.location.search);
    if (q) { write(q[1]); return q[1]; }
    var s = read();
    if (s === "en" || s === "id") return s;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return /^id\b|^in\b/i.test(nav) ? "id" : "en";
  }

  Array.prototype.forEach.call(buttons, function (b) {
    b.addEventListener("click", function () {
      var lang = b.getAttribute("data-lang-set");
      write(lang);
      apply(lang);
    });
  });

  var start = initial();
  if (start !== "en") apply(start);

  /* Mark the section in view in the nav. No scroll listeners. */
  var links = document.querySelectorAll('.nav a[href^="#"]');
  if ("IntersectionObserver" in window && links.length) {
    var byId = {};
    Array.prototype.forEach.call(links, function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      Object.keys(byId).forEach(function (k) { if (visible[k] && current === null) current = k; });
      Object.keys(byId).forEach(function (k) {
        if (k === current) byId[k].setAttribute("aria-current", "true");
        else byId[k].removeAttribute("aria-current");
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    Object.keys(byId).forEach(function (k) {
      var s = document.getElementById(k);
      if (s) io.observe(s);
    });
  }
})();
