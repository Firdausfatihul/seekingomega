/* Seekingomega Capital. Language toggle and current-section marker.
   English is written in the HTML. Indonesian strings live below, keyed by data-i18n. */
(function () {
  "use strict";

  var ID = {
    /* shared */
    "meta.title": "Seekingomega Capital",
    "meta.desc": "Seekingomega Capital adalah kemitraan tertutup tiga orang associate di Jakarta yang membeli saham perusahaan kecil di BEI yang sedang menjalani aksi korporasi. NAB per unit dibandingkan IHSG sejak Mei 2020.",
    "skip": "Langsung ke konten",
    "notice": "Kami tidak pernah menghimpun dana atau memberikan rekomendasi saham melalui WhatsApp, Telegram, atau media sosial. seekingomega.capital adalah satu-satunya situs kami.",
    "nav.label": "Utama",
    "nav.approach": "Pendekatan",
    "nav.record": "Rekam jejak",
    "nav.holdings": "Kepemilikan",
    "nav.people": "Tim",
    "nav.contact": "Kontak",
    "nav.home": "Kembali ke halaman utama",
    "lang.label": "Bahasa",

    /* hero */
    "hero.eyebrow": "Jakarta, sejak Mei 2020",
    "hero.h1": "Kami membeli saham perusahaan kecil di Indonesia ketika kepemilikan, permodalan, atau strukturnya akan&nbsp;berubah.",
    "hero.body": "Seekingomega Capital adalah kemitraan tertutup tiga orang associate di Jakarta. Sejak Mei 2020 kami menempatkan modal milik para mitra sendiri pada perusahaan di Bursa Efek Indonesia yang sedang menjalani aksi korporasi: penambahan modal dengan HMETD (rights issue), penawaran tender, penggabungan usaha, backdoor listing, restrukturisasi, dan pemisahan usaha.",
    "hero.link": "Lihat angka tahunan",
    "facts.base.t": "Berkedudukan di",
    "facts.base.d": "Jakarta, Indonesia",
    "facts.since.t": "Berinvestasi sejak",
    "facts.since.d": "Mei 2020",
    "facts.market.t": "Pasar",
    "facts.market.d": "Perusahaan kecil yang tercatat di BEI",
    "facts.capital.t": "Modal",
    "facts.capital.d": "USD xx.xxx.xxx (tidak dipublikasikan)",
    "facts.open.t": "Terbuka untuk umum",
    "facts.open.d": "Tidak. Hanya melalui pembicaraan tertutup.",

    /* approach */
    "ap.eyebrow": "Pendekatan",
    "ap.h2": "Aksi korporasi pada perusahaan kecil di BEI",
    "ap.objective": "Kami menilai hasil kerja kami dengan satu angka: perubahan nilai aktiva bersih (NAB) per unit, dibandingkan dengan IHSG, Indeks Harga Saham Gabungan.",
    "ap.how": "Cara kami bekerja",
    "ap.p1.t": "Berangkat dari dokumen keterbukaan",
    "ap.p1.d": "Aksi korporasi di BEI diumumkan melalui keterbukaan informasi, sistem pengungkapan publik milik bursa. Sebuah gagasan berawal dari prospektus penambahan modal dengan HMETD, pengumuman penawaran tender, atau mata acara rapat umum pemegang saham.",
    "ap.p2.t": "Tetap pada perusahaan kecil",
    "ap.p2.d": "Kami memiliki saham perusahaan tercatat berukuran kecil. Satu aksi korporasi dapat mengubah siapa pemilik usahanya dan dengan ketentuan apa.",
    "ap.p3.t": "Mengukur satu angka",
    "ap.p3.d": "NAB per unit, dengan setiap setoran dan penarikan dihitung dalam satuan unit, dibandingkan dengan IHSG. Periode ketika kami tertinggal tetap tercantum di tabel, berdampingan dengan periode ketika kami unggul.",
    "ap.p4.t": "Modal sendiri, dibicarakan secara tertutup",
    "ap.p4.d": "Modal yang kami tempatkan adalah modal milik para mitra sendiri yang dihimpun bersama. Kami tidak menghimpun dana dari masyarakat, dan pembicaraan mengenai modal hanya kami lakukan secara tertutup.",
    "ap.sit": "Situasi yang kami cari",
    "ap.s1.t": "Penambahan modal dengan HMETD",
    "ap.s1.g": "<span lang=\"en\">rights issue</span>",
    "ap.s1.d": "Siapa pembeli siaganya, untuk apa dananya digunakan, dan apa dampak harga pelaksanaannya bagi pemegang saham yang tidak menggunakan haknya.",
    "ap.s2.t": "Penawaran tender",
    "ap.s2.g": "<span lang=\"en\">tender offer</span>",
    "ap.s2.d": "Harga yang ditawarkan, persyaratan yang menyertainya, dan nasib saham yang tidak ikut dijual.",
    "ap.s3.t": "Penggabungan usaha dan pengambilalihan",
    "ap.s3.g": "merger dan akuisisi",
    "ap.s3.d": "Rasio konversi atau harga, siapa yang akhirnya memegang kendali, dan apakah penawaran tender wajib akan menyusul.",
    "ap.s4.t": "Pencatatan melalui pintu belakang",
    "ap.s4.g": "<span lang=\"en\">backdoor listing</span>",
    "ap.s4.d": "Usaha tertutup masuk ke bursa melalui perusahaan yang sudah tercatat. Kami membaca apa yang dimasukkan dan pada nilai berapa.",
    "ap.s5.t": "Restrukturisasi",
    "ap.s5.g": "<span lang=\"en\">restructuring</span>",
    "ap.s5.d": "Utang dikonversi menjadi saham, aset dijual, atau neraca disusun ulang. Kami membaca siapa yang memiliki perusahaan setelah semuanya selesai.",
    "ap.s6.t": "Pemisahan usaha",
    "ap.s6.g": "<span lang=\"en\">spin-off</span>",
    "ap.s6.d": "Usaha yang dipisahkan dari induknya dan diserahkan kepada pemegang saham yang tidak memilih untuk memilikinya.",

    /* record */
    "rec.eyebrow": "Rekam jejak",
    "rec.h2": "NAB per unit dibandingkan IHSG, periode demi periode",
    "rec.intro": "Perubahan nilai aktiva bersih per unit kami pada setiap periode, berdampingan dengan IHSG pada tanggal yang sama. Periode ketika kami tertinggal tetap tercantum di tabel.",
    "rec.caption": "Perubahan NAB per unit dan IHSG dalam persen, Mei 2020 sampai 30 September 2026",
    "rec.asof": "Angka per 30 September 2026.",
    "rec.col.period": "Periode",
    "rec.col.us": "Seeking&shy;omega, %",
    "rec.col.ihsg": "IHSG, %",
    "rec.col.diff": "Selisih, poin",
    "rec.r2020": "2020, Mei&nbsp;s.d.&nbsp;Des<sup><a href=\"#fn1\" aria-label=\"Catatan 1\">1</a></sup>",
    "rec.r2024": "Jan&nbsp;2024 s.d. Apr&nbsp;2025<sup><a href=\"#fn2\" aria-label=\"Catatan 2\">2</a></sup>",
    "rec.r2025": "Mei&nbsp;s.d.&nbsp;Des 2025",
    "rec.r2026": "2026, Jan&nbsp;s.d. 30&nbsp;Sep",
    "rec.since": "Sejak awal, Mei&nbsp;2020 s.d. Sep&nbsp;2026",
    "rec.ann": "Pertumbuhan majemuk per tahun, selama 6,4&nbsp;tahun",
    "rec.dd": "Penurunan terdalam dari puncak, Okt&nbsp;2023 s.d. Jun&nbsp;2025",
    "rec.na": "Tidak diban&shy;dingkan",
    "rec.months": "Dari 68 bulan yang tercatat, 31 bulan naik, 24 bulan turun, dan 13 bulan datar.",
    "rec.fn1": "2020 bukan tahun penuh. Rekam jejak dimulai dari NAB per unit kami pada 30 April 2020.",
    "rec.fn2": "NAB bulanan tidak dicatat dari Agustus 2024 sampai April 2025. Selama jeda tersebut NAB dianggap tetap, sehingga baris ini membandingkan seluruh rentang Januari 2024 sampai April 2025 dengan IHSG pada rentang yang sama.",
    "rec.fn3": "IHSG adalah indeks harga dan tidak memperhitungkan dividen. Harga penutupan indeks berasal dari data BEI sebagaimana diberitakan media. Selisih dinyatakan dalam poin persentase dan dihitung dari angka sebelum pembulatan.",
    "rec.fn4": "Angka kami adalah NAB per unit atas modal milik para mitra sendiri yang dihimpun bersama, dengan setoran dan penarikan dihitung dalam satuan unit. Angka ini kami hitung sendiri dari catatan kami dan tidak diaudit.",
    "rec.notoffer": "Angka ini menggambarkan modal milik para mitra sendiri. Angka ini bukan penawaran unit atau ajakan untuk berinvestasi, dan kinerja masa lalu bukan merupakan indikator hasil di masa depan.<br> <a href=\"disclosures/\">Baca pengungkapan lengkap</a>",

    /* holdings */
    "hold.eyebrow": "Kepemilikan",
    "hold.h2": "Saham yang kami miliki",
    "hold.ex": "BEI",
    "hold.ades": "Air minum dalam kemasan dan produk perawatan diri.",
    "hold.heli": "Jasa sewa helikopter dan layanan penerbangan.",
    "hold.inps": "Logistik pengangkutan bahan bakar dan gas.",
    "hold.asof": "Posisi per 30 September 2026. Bukan rekomendasi. Kami dapat menjual sebagian atau seluruh saham ini tanpa memperbarui halaman ini.",

    /* people */
    "ppl.eyebrow": "Tim",
    "ppl.h2": "Tiga orang associate",
    "ppl.intro": "Kami bertiga memegang jabatan yang sama. Nama kami diurutkan menurut nama depan, sesuai abjad.",
    "ppl.role1": "Associate",
    "ppl.role2": "Associate",
    "ppl.role3": "Associate",
    "ppl.daus": "Firdaus, yang biasa dipanggil Daus, adalah analis saham berkapitalisasi kecil. Ia menelaah perusahaan-perusahaan kecil di BEI yang menjadi sebagian besar perhatian kami.",
    "ppl.ghafur": "Latar belakang Ghafur adalah aksi korporasi serta merger dan akuisisi. Ia menelaah ketentuan setiap transaksi yang kami pelajari: para pihak, harga, dan jadwalnya.",
    "ppl.josh": "Joshua berasal dari industri rokok, yang di Indonesia sebagian besar berarti kretek. Ia menilai perusahaan konsumen yang kami pelajari dengan latar belakang tersebut.",

    /* contact */
    "ct.eyebrow": "Kontak",
    "ct.h2": "Hubungi para associate melalui surel",
    "ct.p1": "Pembicaraan mengenai modal hanya kami lakukan secara tertutup. Perorangan yang memenuhi syarat, perusahaan, maupun sesama investor dipersilakan menulis kepada kami.",
    "ct.p2": "Satu surel akan sampai kepada kami bertiga. Kami tidak membicarakan dana melalui WhatsApp, Telegram, atau media sosial.",
    "ct.button": "Kirim surel kepada ketiga associate",
    "ct.place": "Jakarta, Indonesia",

    /* footer */
    "ft.entity": "Seekingomega Capital adalah nama yang digunakan oleh CV Maju Insan Sejahtera, Jakarta.",
    "ft.legal": "Kami tidak memiliki izin OJK sebagai manajer investasi maupun penasihat investasi, dan tidak ada isi situs ini yang merupakan penawaran atau rekomendasi. Kinerja masa lalu bukan merupakan indikator yang dapat diandalkan untuk hasil di masa depan.",
    "ft.disc": "Baca pengungkapan lengkap",
    "ft.home": "Kembali ke halaman utama",
    "ft.updated": "Halaman diperbarui Oktober 2026",

    /* disclosures page chrome */
    "dc.title": "Pengungkapan | Seekingomega Capital",
    "dc.desc": "Pengungkapan hukum Seekingomega Capital, nama yang digunakan oleh CV Maju Insan Sejahtera, Jakarta. Tidak berizin OJK. Bukan penawaran.",
    "dc.eyebrow": "Ketentuan hukum",
    "dc.h1": "Pengungkapan",
    "dc.stamp": "Angka dan kepemilikan yang disebut di sini adalah per 30 September 2026. Halaman diperbarui Oktober 2026."
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
