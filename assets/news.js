/* Seekingomega Capital. News list, category filter, photo viewer and the home page "Latest" block.
   Posts and categories live in news/posts.js (window.SO_NEWS). Nothing to edit here to add a post.
   Containers:
     [data-news="list"]    news/index.html. Filter, all posts, ?cat=<code> in the address.
     [data-news="latest"]  home page. The newest posts as links; data-news-base="news/", data-news-limit="3".
   Language follows <html lang>, which assets/site.js sets; re-renders on its "langchange" event.
   posts.js is read forgivingly: label or code for a category, several date forms, slugs made up when missing,
   repo paths and GitHub links turned into relative paths. Only a post with no title or an unknown category is left out.
   window.SO_NEWS_CHECK() returns { ok, posts, problems } for tools/check-news.cjs. */
(function () {
  "use strict";

  var T = {
    en: {
      all: "All",
      filter: "Category",
      empty: "No posts yet.",
      error: "Updates could not be loaded.",
      errorAt: "news/posts.js has a typing error at or just above line {n}. Undo your last change to that file.",
      count1: "1 post",
      countN: "{n} posts",
      photo: "Photo {n} of {t}",
      photos: "Photos",
      close: "Close",
      prev: "Previous photo",
      next: "Next photo",
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    id: {
      all: "Semua",
      filter: "Kategori",
      empty: "Belum ada kabar.",
      error: "Kabar tidak dapat dimuat.",
      errorAt: "news/posts.js salah ketik di baris {n} atau tepat di atasnya. Batalkan perubahan terakhir pada file itu.",
      count1: "1 kabar",
      countN: "{n} kabar",
      photo: "Foto {n} dari {t}",
      photos: "Foto",
      close: "Tutup",
      prev: "Foto sebelumnya",
      next: "Foto berikutnya",
      months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    }
  };

  var root = document.documentElement;
  function lang() { return (root.getAttribute("lang") || "en").slice(0, 2) === "id" ? "id" : "en"; }
  function t() { return T[lang()]; }
  /* serious = something is missing from the page because of it. */
  var problems = [];
  function warn(msg, serious) {
    problems.push({ msg: msg, serious: !!serious });
    if (window.console) console.warn("news/posts.js: " + msg);
  }

  /* ---------- reading news/posts.js ---------- */

  function isObj(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function clean(v) { return typeof v === "string" ? v.trim() : ""; }
  /* Reads a key ignoring case and spaces, so ID:, Id: and "en " all work. names[0] is the real key. */
  function get(o, names, test) {
    if (!isObj(o)) return undefined;
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      if (names.indexOf(String(k).trim().toLowerCase()) < 0) continue;
      if (!test || test(o[k])) return o[k];
    }
    return undefined;
  }
  /* "RUPS 2026", "rups_2026" and "Rups-2026" all become "rups-2026". */
  function slugify(v) {
    var s = String(v == null ? "" : v).toLowerCase();
    if (s.normalize) s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return s.replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
  }

  /* A text is either "same in both languages" or { en, id }. Missing side falls back to the other. */
  function bi(v) {
    if (typeof v === "string" || Array.isArray(v)) return v.length ? { en: v, id: v, enLang: "en", idLang: "id", same: true } : null;
    if (!isObj(v)) return null;
    var en = get(v, ["en"], hasText);
    var id = get(v, ["id", "in"], hasText);
    if (en === undefined) en = null;
    if (id === undefined) id = null;
    if (en === null && id === null) return null;
    return { en: en !== null ? en : id, id: id !== null ? id : en, enLang: en !== null ? "en" : "id", idLang: id !== null ? "id" : "en" };
  }
  function hasText(v) {
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.some(function (s) { return typeof s === "string" && s.trim() !== ""; });
    return false;
  }
  /* Returns { s, lang } where lang is the language the text is actually written in. */
  function pick(b, l) {
    if (!b) return { s: "", lang: l };
    if (b.same) return { s: b[l], lang: l };
    return l === "id" ? { s: b.id, lang: b.idLang } : { s: b.en, lang: b.enLang };
  }

  /* Only relative paths and web links. Never javascript: or data:.
     Paths are relative to news/, so "news/files/a.pdf", "/news/files/a.pdf" and a GitHub link to the file
     (github.com/<owner>/<repo>/blob/main/news/files/a.pdf) all become "files/a.pdf". */
  function safeHref(v) {
    var s = clean(v).replace(/\\/g, "/");
    if (!s) return "";
    var gh = /^https?:\/\/(?:www\.)?github\.com\/[^\/]+\/[^\/]+\/(?:blob|raw)\/[^\/]+\/news\/([^?#]+)/i.exec(s) ||
      /^https?:\/\/raw\.githubusercontent\.com\/[^\/]+\/[^\/]+\/[^\/]+\/news\/([^?#]+)/i.exec(s);
    if (gh) s = gh[1];
    if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return /^https?:\/\/[^\/]/i.test(s) ? s : "";
    if (/^\/\//.test(s)) return "";
    return s.replace(/^(?:\.?\/)+/, "").replace(/^news\//i, "");
  }

  /* English and Indonesian month names and short forms. */
  var MONTHS = {
    jan: 1, january: 1, januari: 1, feb: 2, february: 2, februari: 2, mar: 3, march: 3, maret: 3,
    apr: 4, april: 4, may: 5, mei: 5, jun: 6, june: 6, juni: 6, jul: 7, july: 7, juli: 7,
    aug: 8, august: 8, agu: 8, agt: 8, agus: 8, agustus: 8, sep: 9, sept: 9, september: 9,
    oct: 10, october: 10, okt: 10, oktober: 10, nov: 11, november: 11, nopember: 11,
    dec: 12, december: 12, des: 12, desember: 12
  };
  function makeDate(y, mo, d) {
    var dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    function two(n) { return (n < 10 ? "0" : "") + n; }
    return { y: y, m: mo - 1, d: d, iso: y + "-" + two(mo) + "-" + two(d), key: y * 10000 + mo * 100 + d };
  }
  /* 2026-10-06, 2026-9-30, 2026/09/30, 30-09-2026, 30.9.2026, 30 September 2026, 30 Sep 2026, September 30, 2026.
     Returns null when it cannot be read or does not exist (2026-09-31). */
  function validDate(v, where) {
    var s = clean(v).toLowerCase().replace(/,/g, " ").replace(/\s+/g, " ");
    var m, r;
    if ((m = /^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/.exec(s))) return makeDate(+m[1], +m[2], +m[3]);
    if ((m = /^(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})$/.exec(s))) {
      /* Day first, the Indonesian habit. 09-30-2026 can only be month first. */
      r = makeDate(+m[3], +m[2], +m[1]);
      if (!r && (r = makeDate(+m[3], +m[1], +m[2]))) warn(where + ": date read as " + r.iso + " (month first).");
      return r;
    }
    if ((m = /^(\d{1,2})\.? ([a-z]+)\.? (\d{4})$/.exec(s)) && MONTHS[m[2]]) return makeDate(+m[3], MONTHS[m[2]], +m[1]);
    if ((m = /^([a-z]+)\.? (\d{1,2}) (\d{4})$/.exec(s)) && MONTHS[m[1]]) return makeDate(+m[3], MONTHS[m[1]], +m[2]);
    return null;
  }

  var cache = null;
  function load() {
    if (cache) return cache;
    problems = [];
    var data = window.SO_NEWS;
    if (!isObj(data)) {
      var e = window.SO_NEWS_ERROR;
      if (window.console) console.error("news/posts.js did not load, or has a typing error (a missing comma, quote or bracket)" + (e && e.line ? " at or just above line " + e.line + ": " + e.msg : "") + ". Nothing to show.");
      problems.push({ msg: "posts.js did not load", serious: true });
      cache = { ok: false, error: e && e.line ? e : null, cats: [], byCode: {}, posts: [], problems: problems };
      return cache;
    }

    /* code = what posts use. A category written without a code gets one from its id (or en) label. */
    var cats = [], byCode = {}, byLabel = {};
    var catList = get(data, ["categories", "kategori"]);
    (Array.isArray(catList) ? catList : []).forEach(function (c, i) {
      if (!isObj(c)) { warn("category " + (i + 1) + " is not a { ... } line. Skipped.", true); return; }
      var label = bi(c);
      var code = slugify(get(c, ["code", "kode"]));
      if (!code && label) {
        code = slugify(label.same ? label.en : (get(c, ["id", "in"], hasText) || get(c, ["en"], hasText)));
        if (code) warn("category " + (i + 1) + " has no code. Using \"" + code + "\".");
      }
      if (!code) { warn("category " + (i + 1) + " has no code and no label. Skipped.", true); return; }
      if (byCode[code]) { warn("category \"" + code + "\" is listed twice. The second one is skipped.", true); return; }
      var cat = { code: code, label: label || bi(code) };
      cats.push(cat);
      byCode[code] = cat;
    });
    /* Posts may also use a button label ("RUPS", "Laporan keuangan", "Shareholder meetings"). */
    cats.forEach(function (c) {
      [c.label.en, c.label.id].forEach(function (s) {
        var k = typeof s === "string" ? slugify(s) : "";
        if (k && !byCode[k] && !byLabel[k]) byLabel[k] = c;
      });
    });

    var posts = [], slugs = { main: true, latest: true };
    var today = new Date(), soon = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    var postList = get(data, ["posts", "post"]);
    (Array.isArray(postList) ? postList : []).forEach(function (p, i) {
      var where = "post " + (i + 1);
      if (!isObj(p)) { warn(where + " is not a { ... } block. Skipped.", true); return; }
      var rawSlug = get(p, ["slug"]);
      if (clean(rawSlug)) where = "post \"" + clean(rawSlug) + "\"";

      var title = bi(get(p, ["title", "judul"]));
      if (!title) { warn(where + ": has no title. Skipped.", true); return; }

      var rawDate = get(p, ["date", "tanggal"]);
      var date = validDate(rawDate, where);
      if (!date) {
        warn(where + (typeof rawDate === "number" ? ": date needs quotes around it, like \"2026-10-06\"." : ": date \"" + clean(rawDate) + "\" could not be read. Write it like \"2026-10-06\".") + " Shown at the bottom without a date.", true);
      } else if (Date.UTC(date.y, date.m, date.d) > soon) {
        warn(where + ": date " + date.iso + " is in the future, so this post stays at the top until then.");
      }

      var rawCat = get(p, ["category", "kategori"]);
      var code = slugify(rawCat);
      var cat = byCode[code] || byLabel[code];
      if (!cat) { warn(where + ": category \"" + clean(rawCat) + "\" is not in categories. Hidden.", true); return; }

      var slug = slugify(rawSlug);
      if (clean(rawSlug) && slug !== clean(rawSlug)) warn(where + ": slug written as \"" + slug + "\".");
      if (!slug) slug = slugify((date ? date.iso + " " : "") + pick(title, "en").s) || "post-" + (i + 1);
      if (slugs[slug]) {
        var n = 2;
        while (slugs[slug + "-" + n]) n++;
        warn(where + ": slug \"" + slug + "\" is already used. This post is at #" + slug + "-" + n + ".");
        slug = slug + "-" + n;
      }

      var facts = [];
      var factList = get(p, ["facts"]);
      (Array.isArray(factList) ? factList : []).forEach(function (f, j) {
        var label = bi(get(f, ["label"])), value = bi(get(f, ["value"]));
        if (!label || !value) { warn(where + ": fact " + (j + 1) + " needs a label and a value. Skipped.", true); return; }
        facts.push({ label: label, value: value });
      });
      var files = [];
      var fileList = get(p, ["files"]);
      (Array.isArray(fileList) ? fileList : []).forEach(function (f, j) {
        var href = isObj(f) ? safeHref(get(f, ["href", "src"])) : safeHref(f);
        if (!href) { warn(where + ": file " + (j + 1) + " has no usable href. Skipped.", true); return; }
        files.push({ href: href, label: bi(get(f, ["label"])) || bi(href.split("/").pop()) });
      });
      var photos = [];
      var photoList = get(p, ["photos", "photo"]);
      (Array.isArray(photoList) ? photoList : []).forEach(function (f, j) {
        var src = isObj(f) ? safeHref(get(f, ["src", "href"])) : safeHref(f);
        if (!src) { warn(where + ": photo " + (j + 1) + " has no usable src. Skipped.", true); return; }
        photos.push({ src: src, given: src, alt: bi(get(f, ["alt"])), broken: false, tried: false });
      });

      slugs[slug] = true;
      posts.push({ slug: slug, date: date, cat: cat, title: title, body: bi(get(p, ["body", "isi"])), facts: facts, files: files, photos: photos, order: i });
    });

    /* Newest first. Same date: the one higher up in posts.js first. No readable date: at the bottom. */
    posts.sort(function (a, b) {
      var ka = a.date ? a.date.key : -1, kb = b.date ? b.date.key : -1;
      return (kb - ka) || (a.order - b.order);
    });
    cache = { ok: true, cats: cats, byCode: byCode, posts: posts, problems: problems };
    return cache;
  }
  /* For tools/check-news.cjs. Reads posts.js afresh. */
  window.SO_NEWS_CHECK = function () { cache = null; return load(); };

  /* ---------- small DOM helpers ---------- */

  function h(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }
  /* Writes text and marks its language when it fell back to the other one. */
  function say(node, b, l) {
    var p = pick(b, l);
    node.textContent = typeof p.s === "string" ? p.s.trim() : "";
    if (p.lang !== l) node.setAttribute("lang", p.lang); else node.removeAttribute("lang");
    return p;
  }
  function dateText(d, l) { return d.d + " " + T[l].months[d.m] + " " + d.y; }
  function fill(s, o) { return s.replace(/\{(\w)\}/g, function (_, k) { return o[k]; }); }

  /* Plain text: an empty line starts a paragraph, a single line break stays a line break. */
  function paragraphs(text) {
    var list = Array.isArray(text) ? text : String(text).split(/\n[ \t]*\n/);
    return list.map(function (p) {
      return String(p).split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    }).filter(function (lines) { return lines.length; });
  }
  function bodyInto(parent, b, l) {
    var p = pick(b, l);
    paragraphs(p.s).forEach(function (lines) {
      var para = h("p", null, parent);
      if (p.lang !== l) para.setAttribute("lang", p.lang);
      lines.forEach(function (line, i) {
        if (i) para.appendChild(document.createElement("br"));
        para.appendChild(document.createTextNode(line));
      });
    });
  }
  function fileType(href) {
    var m = /\.([a-z0-9]{2,5})(?:[?#].*)?$/i.exec(href);
    return m ? m[1].toUpperCase() : "";
  }

  /* ---------- news page ---------- */

  function renderList(box) {
    var data = load();
    var l = lang();
    var listEl = box.querySelector("[data-news-list]");
    var emptyEl = box.querySelector("[data-news-empty]");
    var filterEl = box.querySelector("[data-news-filter]");
    if (!listEl) return;

    if (!data.ok) {
      listEl.textContent = "";
      if (filterEl) filterEl.hidden = true;
      /* The line number exists only when the page is served over http(s); file:// hides it. */
      if (emptyEl) { emptyEl.textContent = data.error ? fill(t().errorAt, { n: data.error.line }) : t().error; emptyEl.hidden = false; }
      return;
    }

    var current = currentCat(data);
    var statusEl = box.querySelector("[data-news-status]");
    if (statusEl) statusEl.textContent = "";

    /* Filter buttons */
    if (filterEl) {
      filterEl.textContent = "";
      filterEl.setAttribute("aria-label", t().filter);
      [{ code: "", label: null }].concat(data.cats).forEach(function (c) {
        var b = h("button", "news-filter-b", filterEl);
        b.type = "button";
        b.setAttribute("data-cat", c.code);
        b.setAttribute("aria-pressed", String(c.code === current));
        if (c.label) say(b, c.label, l); else b.textContent = t().all;
        b.addEventListener("click", function () { choose(box, c.code, true, false); });
      });
      filterEl.hidden = false;
    }

    /* Posts */
    listEl.textContent = "";
    data.posts.forEach(function (p) {
      var art = h("article", "post", listEl);
      art.id = p.slug;
      art.setAttribute("data-cat", p.cat.code);
      art.setAttribute("aria-labelledby", p.slug + "-t");
      var wrap = h("div", "wrap grid", art);

      var meta = h("div", "post-meta", wrap);
      say(h("p", "eyebrow post-cat", meta), p.cat.label, l);
      if (p.date) {
        var time = h("time", "post-date", h("p", null, meta));
        time.setAttribute("datetime", p.date.iso);
        time.textContent = dateText(p.date, l);
      }

      var main = h("div", "post-main", wrap);
      var title = h("h2", "post-title", main);
      title.id = p.slug + "-t";
      say(title, p.title, l);

      if (p.body) bodyInto(h("div", "post-body", main), p.body, l);

      if (p.facts.length) {
        var dl = h("dl", "post-facts", main);
        p.facts.forEach(function (f) {
          var row = h("div", null, dl);
          say(h("dt", null, row), f.label, l);
          say(h("dd", null, row), f.value, l);
        });
      }

      if (p.files.length) {
        var ul = h("ul", "post-files", main);
        p.files.forEach(function (f) {
          var fa = h("a", null, h("li", null, ul));
          fa.href = f.href;
          var name = h("span", null, fa);
          say(name, f.label, l);
          var type = fileType(f.href);
          if (type) { var s = h("span", "post-type", fa); s.textContent = " (" + type + ")"; }
        });
      }

      var shown = p.photos.filter(function (ph) { return !ph.broken; });
      if (shown.length) {
        var grid = h("ul", "post-photos", main);
        grid.setAttribute("aria-label", t().photos);
        shown.forEach(function (ph, i) { photoThumb(p, ph, i, shown.length, grid, l); });
      }
    });

    applyFilter(box, current, false);
    /* A #slug link overrode ?cat=. Make the address match what is shown. */
    if (state.dropCat) { state.dropCat = false; choose(box, "", false, true); }
  }

  /* Phones save IMG_0001.JPG; posts.js often says .jpg. GitHub Pages is case-sensitive, so try the other case once. */
  function otherCase(src) {
    var m = /^(.*\.)([A-Za-z0-9]+)$/.exec(src);
    if (!m) return "";
    var ext = m[2] === m[2].toLowerCase() ? m[2].toUpperCase() : m[2].toLowerCase();
    return ext === m[2] ? "" : m[1] + ext;
  }
  function photoThumb(p, ph, i, n, grid, l) {
    var li = h("li", null, grid);
    var pa = h("a", "post-photo", li);
    pa.href = ph.src;
    var img = h("img", null, pa);
    img.loading = "lazy";
    img.decoding = "async";
    var alt = ph.alt ? pick(ph.alt, l) : null;
    img.alt = alt ? alt.s.trim() : "";
    if (alt && alt.lang !== l) img.setAttribute("lang", alt.lang);
    if (!img.alt) pa.setAttribute("aria-label", fill(t().photo, { n: i + 1, t: n }));
    ph.li = li;
    img.addEventListener("load", function () {
      if (ph.src !== ph.given) warn("photo " + ph.given + " is really " + ph.src + ". Change it in posts.js to match.");
    });
    img.addEventListener("error", function () {
      var other = ph.tried ? "" : otherCase(ph.src);
      ph.tried = true;
      if (other) { ph.src = other; pa.href = other; img.src = other; return; }
      ph.src = ph.given;
      photoBroken(ph);
    });
    img.src = ph.src;
    pa.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
      if (openViewer(p, ph, pa)) e.preventDefault();
    });
  }
  /* A photo that does not load is taken out: no empty tile, not in the viewer. */
  function photoBroken(ph) {
    if (ph.broken) return;
    ph.broken = true;
    warn("photo not found: " + ph.given + ". Check the name in news/photos, including upper and lower case.", true);
    var li = ph.li;
    if (!li || !li.parentNode) return;
    var grid = li.parentNode;
    li.hidden = true;
    if (!grid.querySelector("li:not([hidden])")) grid.hidden = true;
  }

  function currentCat(data) {
    var c = (/[?&]cat=([^&#]*)/.exec(window.location.search) || [])[1];
    try { c = c ? slugify(decodeURIComponent(c.replace(/\+/g, " "))) : ""; } catch (e) { c = ""; }
    if (state.cat !== null) c = state.cat;
    if (c && !data.byCode[c]) { warn("?cat=" + c + " is not a category. Showing all."); c = ""; }
    /* A link to one post (#slug) must show that post. */
    var hash = window.location.hash.slice(1);
    if (state.cat === null && hash && c) {
      var hit = data.posts.filter(function (p) { return p.slug === hash; })[0];
      if (hit && hit.cat.code !== c) { c = ""; state.dropCat = true; }
    }
    state.cat = c;
    return c;
  }
  var state = { cat: null, dropCat: false };

  function applyFilter(box, code, announce) {
    var posts = box.querySelectorAll(".post");
    var shown = 0;
    Array.prototype.forEach.call(posts, function (p) {
      var on = !code || p.getAttribute("data-cat") === code;
      p.hidden = !on;
      if (on) shown++;
    });
    var emptyEl = box.querySelector("[data-news-empty]");
    if (emptyEl) { emptyEl.textContent = t().empty; emptyEl.hidden = shown > 0; }
    Array.prototype.forEach.call(box.querySelectorAll("[data-cat]"), function (b) {
      if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.getAttribute("data-cat") === code));
    });
    var statusEl = box.querySelector("[data-news-status]");
    if (statusEl && announce) {
      statusEl.textContent = shown ? (shown === 1 ? t().count1 : fill(t().countN, { n: shown })) : t().empty;
    }
  }

  function choose(box, code, announce, keepHash) {
    state.cat = code;
    applyFilter(box, code, announce);
    /* Reflect the filter in the address so it can be linked. Other parameters stay; ?lang= follows the page. */
    try {
      var q = window.location.search.replace(/^\?/, "").split("&").filter(function (kv) { return kv && !/^cat=/.test(kv); })
        .map(function (kv) { return /^lang=/.test(kv) ? "lang=" + lang() : kv; });
      if (code) q.push("cat=" + encodeURIComponent(code));
      window.history.replaceState(null, "", window.location.pathname + (q.length ? "?" + q.join("&") : "") + (keepHash ? window.location.hash : ""));
    } catch (e) { /* file:// in some browsers */ }
  }

  /* Same-page jump to #slug while a filter hides that post: show all, then go there. */
  function onHash() {
    var box = document.querySelector('[data-news="list"]');
    var hash = window.location.hash.slice(1);
    if (!box || !hash || !/^[a-z0-9-]+$/i.test(hash)) return;
    var target = document.getElementById(hash);
    if (!target || !target.classList.contains("post")) return;
    if (target.hidden) choose(box, "", true, true);
    target.scrollIntoView();
  }

  /* ---------- photo viewer ---------- */

  var viewer = null;
  function buildViewer() {
    var d = document.createElement("dialog");
    if (typeof d.showModal !== "function") return null;
    d.className = "viewer";
    var bar = h("div", "viewer-bar", d);
    var count = h("p", "viewer-count", bar);
    count.setAttribute("aria-hidden", "true");
    var close = h("button", "viewer-b viewer-close", bar);
    close.type = "button";
    var fig = h("figure", "viewer-fig", d);
    var img = h("img", null, fig);
    /* The caption repeats the alt text, so screen readers get it once, from the image. */
    var cap = h("figcaption", "viewer-cap", fig);
    cap.setAttribute("aria-hidden", "true");
    var nav = h("div", "viewer-nav", d);
    var prev = h("button", "viewer-b", nav);
    prev.type = "button";
    var next = h("button", "viewer-b", nav);
    next.type = "button";
    /* Says "Photo 2 of 3. <alt>" when the arrows change the photo. */
    var live = h("p", "vh", d);
    live.setAttribute("aria-live", "polite");
    document.body.appendChild(d);

    var v = { d: d, count: count, close: close, img: img, cap: cap, prev: prev, next: next, nav: nav, live: live, post: null, list: [], i: 0, from: null };
    close.addEventListener("click", function () { d.close(); });
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    /* Click on the backdrop closes. */
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
    d.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
      else if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
      else if (e.key === "Tab") {
        /* Keep focus inside the viewer. */
        var f = Array.prototype.filter.call(d.querySelectorAll("button"), function (b) { return !b.hidden && !b.disabled && !(b.parentNode && b.parentNode.hidden); });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
        else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    });
    /* The full image failed too: drop it and show a neighbour, or close. */
    img.addEventListener("error", function () {
      var ph = v.list[v.i];
      if (!ph || !v.d.open) return;
      photoBroken(ph);
      v.list.splice(v.i, 1);
      if (!v.list.length) { d.close(); return; }
      show(Math.min(v.i, v.list.length - 1), false);
    });
    d.addEventListener("close", function () {
      root.classList.remove("viewer-open");
      v.live.textContent = "";
      if (v.from && document.contains(v.from) && !(v.from.parentNode && v.from.parentNode.hidden)) v.from.focus();
    });
    return v;
  }
  function step(dir) {
    if (!viewer || !viewer.post) return;
    var i = viewer.i + dir;
    if (i < 0 || i >= viewer.list.length) return;
    show(i, true);
  }
  function show(i, announce) {
    var v = viewer, l = lang(), n = v.list.length, ph = v.list[i];
    v.i = i;
    v.img.src = ph.src;
    var alt = ph.alt ? pick(ph.alt, l) : null;
    var altText = alt ? alt.s.trim() : "";
    v.img.alt = altText;
    if (alt && alt.lang !== l) v.img.setAttribute("lang", alt.lang); else v.img.removeAttribute("lang");
    v.cap.textContent = altText;
    v.cap.hidden = !altText;
    if (alt && alt.lang !== l) v.cap.setAttribute("lang", alt.lang); else v.cap.removeAttribute("lang");
    var countText = fill(t().photo, { n: i + 1, t: n });
    v.count.textContent = countText;
    v.count.hidden = n < 2;
    v.nav.hidden = n < 2;
    v.prev.disabled = i === 0;
    v.next.disabled = i === n - 1;
    if (announce) v.live.textContent = countText + (altText ? ". " + altText : "");
    /* A button that just became disabled drops focus. Move it to the other arrow, or to Close. */
    var a = document.activeElement;
    if (a && (a.disabled || (a.parentNode && a.parentNode.hidden))) {
      if (a === v.prev && !v.next.disabled && !v.nav.hidden) v.next.focus();
      else if (a === v.next && !v.prev.disabled && !v.nav.hidden) v.prev.focus();
      else v.close.focus();
    }
  }
  function labelViewer() {
    if (!viewer) return;
    viewer.close.textContent = t().close;
    viewer.prev.textContent = "←";
    viewer.prev.setAttribute("aria-label", t().prev);
    viewer.next.textContent = "→";
    viewer.next.setAttribute("aria-label", t().next);
    if (viewer.post) {
      viewer.d.setAttribute("aria-label", pick(viewer.post.title, lang()).s.trim());
      if (viewer.d.open) show(viewer.i, false);
    }
  }
  function openViewer(post, ph, from) {
    if (!viewer) viewer = buildViewer();
    if (!viewer) return false;
    var list = post.photos.filter(function (x) { return !x.broken; });
    var i = list.indexOf(ph);
    if (i < 0) return false;
    viewer.post = post;
    viewer.list = list;
    viewer.from = from;
    viewer.live.textContent = "";
    labelViewer();
    show(i, false);
    root.classList.add("viewer-open");
    viewer.d.showModal();
    viewer.close.focus();
    return true;
  }

  /* ---------- home page: latest ---------- */

  function renderLatest(box) {
    var data = load();
    var l = lang();
    var listEl = box.querySelector("[data-news-list]");
    if (!listEl) return;
    var base = box.getAttribute("data-news-base") || "news/";
    var limit = parseInt(box.getAttribute("data-news-limit"), 10) || 3;
    listEl.textContent = "";
    var posts = data.posts.slice(0, limit);
    posts.forEach(function (p) {
      var li = h("li", "latest-item", listEl);
      if (p.date) {
        var time = h("time", "latest-date", li);
        time.setAttribute("datetime", p.date.iso);
        time.textContent = dateText(p.date, l);
      }
      say(h("span", "latest-cat", li), p.cat.label, l);
      var a = h("a", "latest-title", li);
      a.href = base + "#" + p.slug;
      say(a, p.title, l);
    });
    /* The block ships hidden (no JS, or posts.js broken). Show it only with something in it. */
    box.hidden = posts.length === 0;
  }

  /* ---------- start ---------- */

  function renderAll() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-news="list"]'), renderList);
    Array.prototype.forEach.call(document.querySelectorAll('[data-news="latest"]'), renderLatest);
    labelViewer();
  }

  function start() {
    renderAll();
    /* Content arrived after the browser tried to jump to #slug. Jump now. */
    var hash = window.location.hash.slice(1);
    if (hash && /^[a-z0-9-]+$/i.test(hash) && document.querySelector('[data-news="list"]')) {
      var target = document.getElementById(hash);
      if (target && !target.hidden) target.scrollIntoView();
    }
    window.addEventListener("hashchange", onHash);
    var last = lang();
    function relang() { if (lang() !== last) { last = lang(); renderAll(); } }
    document.addEventListener("langchange", relang);
    if ("MutationObserver" in window) new MutationObserver(relang).observe(root, { attributes: true, attributeFilter: ["lang"] });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
