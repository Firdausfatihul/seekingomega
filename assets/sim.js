/* Seekingomega "Rp1 juta" simulator. Hand-written, no library.
   Reads the shared monthly series (window.SO_DATA, assets/data.js; indexed to 100 at 30 April 2020,
   rupiah terms). End is the last month in the data. The HTML holds the default result
   (Rp1,000,000 from April 2020) as static rows, so it reads the same without JS. */
(function () {
  "use strict";

  /* Data: window.SO_DATA from assets/data.js.
     { asOf: "YYYY-MM-DD", months: ["YYYY-MM", ...], series: { fund, ihsg, spx, gold }, recorded: [1|0, ...] } */
  function adapt(src) {
    var s = src && src.series, n = src && src.months && src.months.length;
    if (!s || !n || n < 2) return null;
    var d = { months: src.months, fund: s.fund, ihsg: s.ihsg, spx: s.spx, gold: s.gold };
    var ok = KEYS.every(function (k) {
      return d[k] && d[k].length === n && d[k].every(function (v) { return typeof v === "number" && v > 0; });
    });
    if (!ok) return null;
    d.recorded = src.recorded && src.recorded.length === n ? src.recorded : src.months.map(function () { return 1; });
    d.day = +(/^\d{4}-\d{2}-(\d{2})$/.exec(src.asOf || "") || [0, 30])[1];
    return d;
  }

  var MIN = 100000, MAX = 100000000000, DEF = 1000000;
  var KEYS = ["fund", "spx", "gold", "ihsg"];   // fixed order: ties keep this order

  var T = {
    en: {
      title: "{a} in four places",
      amount: "Amount",
      start: "From",
      end: "To",
      fund: "Seekingomega", ihsg: "IHSG", spx: "S&P\u00a0500", gold: "Gold",
      million: "million", billion: "billion",
      gap: "No NAV recorded that month. Last recorded value used.",
      err: "From Rp100,000 to Rp100 billion.",
      errEmpty: "Enter an amount.",
      live: "{a} from {s}: {r}.",
      fine: "Hypothetical. Month-end prices, no costs, taxes or dividends. Not a forecast.",
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      loc: "en-US",
      dec: "."
    },
    id: {
      title: "{a} di empat tempat",
      amount: "Jumlah",
      start: "Dari",
      end: "Hingga",
      fund: "Seekingomega", ihsg: "IHSG", spx: "S&P\u00a0500", gold: "Emas",
      million: "juta", billion: "miliar",
      gap: "NAB bulan itu tidak tercatat. Dipakai nilai tercatat terakhir.",
      err: "Antara Rp100.000 dan Rp100 miliar.",
      errEmpty: "Isi jumlahnya.",
      live: "{a} dari {s}: {r}.",
      fine: "Hipotetis. Harga akhir bulan, tanpa biaya, pajak, atau dividen. Bukan proyeksi.",
      months: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
      loc: "id-ID",
      dec: ","
    }
  };

  function lang() { return (document.documentElement.getAttribute("lang") || "en").slice(0, 2) === "id" ? "id" : "en"; }
  function fill(s, o) { return s.replace(/\{(\w)\}/g, function (_, k) { return o[k]; }); }

  var nfCache = {};
  function nf(loc, min, max) {
    var k = loc + min + max;
    if (!nfCache[k]) {
      try { nfCache[k] = new Intl.NumberFormat(loc, { minimumFractionDigits: min, maximumFractionDigits: max }); }
      catch (e) { nfCache[k] = null; }
    }
    return nfCache[k];
  }
  function num(v, min, max) {
    var t = T[lang()], f = nf(t.loc, min, max);
    if (f) return f.format(v);
    var s = v.toFixed(max), p = s.split("."), g = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    s = p[1] ? g + "." + p[1] : g;
    return lang() === "id" ? s.replace(/[.,]/g, function (c) { return c === "." ? "," : "."; }) : s;
  }
  /* Full grouping: Rp1,000,000 / Rp1.000.000 */
  function full(v) { return "Rp" + num(Math.round(v), 0, 0); }
  /* Compact for a million and up: Rp4.08 million / Rp4,08 juta; Rp150 million, not Rp150.00.
     Below a million: full grouping, so 999,999 never shows as "Rp1 million".
     The unit is picked after rounding: 999,999,999 is Rp1 billion, not Rp1,000.00 million.
     Values are always positive here. */
  function money(v, loose) {
    var t = T[lang()];
    if (v < 1e6) return full(v);
    var x = Math.round(v / 1e4) / 100, unit = t.million;
    if (x >= 1000) { x = Math.round(v / 1e7) / 100; unit = t.billion; }
    return "Rp" + num(x, loose || x === Math.round(x) ? 0 : 2, 2) + " " + unit;
  }
  function pct(p) {
    var s = num(Math.abs(p), 1, 1);
    return (p < 0 && s.replace(/[^1-9]/g, "") ? "−" : "+") + s + "%";
  }
  function monthName(ym) {
    var t = T[lang()];
    return t.months[+ym.slice(5, 7) - 1] + " " + ym.slice(0, 4);
  }

  function Sim(root, data) {
    this.root = root;
    this.d = data;
    this.n = data.months.length;
    this.amt = DEF;
    this.start = 0;
    this.q = function (s) { return root.querySelector(s); };
    this.input = this.q(".sim-amt input");
    this.title = this.q(".sim-title");
    this.select = this.q(".sim-start");
    this.err = this.q(".sim-err");
    this.gap = this.q(".sim-gap");
    this.list = this.q(".sim-rows");
    this.axis = this.q(".sim-axis-l");
    this.live = this.q(".sim-live");
    this.rows = {};
    var self = this;
    KEYS.forEach(function (k) {
      var li = self.list.querySelector('[data-k="' + k + '"]');
      self.rows[k] = {
        li: li,
        name: li.querySelector(".sim-name"),
        val: li.querySelector(".sim-val"),
        pct: li.querySelector(".sim-pct"),
        fill: li.querySelector(".sim-fill"),
        mark: li.querySelector(".sim-mark")
      };
    });

    root.classList.add("is-ready");
    this.options();
    this.bind();
    this.text();
    this.update(false);
  }

  Sim.prototype.options = function () {
    var sel = this.select;
    if (!sel) return;
    var keep = sel.value;
    sel.textContent = "";
    for (var i = 0; i < this.n - 1; i++) {   // any month before the last; the last is the fixed end
      var o = document.createElement("option");
      o.value = String(i);
      o.textContent = monthName(this.d.months[i]);
      sel.appendChild(o);
    }
    sel.value = keep !== "" && +keep < this.n - 1 ? keep : String(this.start);
  };

  Sim.prototype.text = function () {
    var t = T[lang()], root = this.root;
    Array.prototype.forEach.call(root.querySelectorAll("[data-sim-t]"), function (el) {
      var k = el.getAttribute("data-sim-t");
      if (t[k]) el.textContent = t[k];
    });
    var last = this.d.months[this.n - 1];
    var endEl = root.querySelector(".sim-end-v:not(.sim-from-v)");
    if (endEl) endEl.textContent = this.d.day + " " + monthName(last);
    var self = this;
    KEYS.forEach(function (k) { self.rows[k].name.textContent = t[k]; });
    // keep the selected month, relabel options
    var sel = this.select;
    if (sel) Array.prototype.forEach.call(sel.options, function (o) { o.textContent = monthName(self.d.months[+o.value]); });
    if (document.activeElement !== this.input || this.valid) this.input.value = num(this.amt, 0, 0);
    if (!this.err.hidden) this.err.textContent = this.errKey ? t[this.errKey] : "";
  };

  Sim.prototype.bind = function () {
    var self = this, input = this.input;
    input.addEventListener("input", function () {
      var v = input.value, caret = input.selectionStart == null ? v.length : input.selectionStart;
      // Rupiah has no cents: a trailing decimal part (",50" in ID, ".50" in EN) is shown but not counted.
      var dec = T[lang()].dec, cut = v.lastIndexOf(dec), frac = "";
      if (cut >= 0 && /^\d{0,2}$/.test(v.slice(cut + 1))) { frac = v.slice(cut); v = v.slice(0, cut); } else cut = -1;
      var before = v.slice(0, caret).replace(/\D/g, "").length;
      var digits = v.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 12);
      var whole = digits ? num(+digits, 0, 0) : "";
      var out = whole && whole + frac;
      input.value = out;
      // put the caret back after the same number of digits (or at the same place in the decimals)
      var pos = 0, seen = 0;
      if (whole && cut >= 0 && caret > cut) pos = whole.length + caret - cut;
      else while (pos < whole.length && seen < before) { if (/\d/.test(whole[pos])) seen++; pos++; }
      try { input.setSelectionRange(pos, pos); } catch (e) { /* not focusable */ }
      self.read(digits);
    });
    input.addEventListener("blur", function () {
      if (self.valid) input.value = num(self.amt, 0, 0);
    });
    if (this.select) this.select.addEventListener("change", function () {
      self.start = +self.select.value;
      self.update(true);
    });
    var form = this.q(".sim-form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
    this.valid = true;
  };

  Sim.prototype.read = function (digits) {
    var v = digits ? +digits : NaN;
    if (!digits) return this.invalid("errEmpty");
    if (v < MIN || v > MAX) return this.invalid("err");
    this.valid = true;
    this.errKey = null;
    this.err.hidden = true;
    this.err.textContent = "";
    this.input.removeAttribute("aria-invalid");
    this.stale(false);
    this.amt = v;
    this.update(true);
  };
  Sim.prototype.invalid = function (key) {
    var self = this, msg = T[lang()][key];
    this.valid = false;
    this.errKey = key;
    this.err.textContent = msg;
    this.err.hidden = false;
    this.input.setAttribute("aria-invalid", "true");
    this.stale(true);
    // Screen readers hear the rejection once typing pauses, like the results.
    clearTimeout(this.timer);
    this.timer = setTimeout(function () { self.live.textContent = msg; }, 600);
  };
  /* Rows for the last valid amount fade while the field holds an invalid one. */
  Sim.prototype.stale = function (on) {
    this.root.classList.toggle("is-stale", on);
    if (on) this.list.setAttribute("aria-hidden", "true"); else this.list.removeAttribute("aria-hidden");
  };

  Sim.prototype.update = function (announce) {
    var d = this.d, s = this.start, e = this.n - 1, amt = this.amt, self = this;
    var res = KEYS.map(function (k, i) {
      var r = d[k][e] / d[k][s];
      return { k: k, i: i, v: amt * r, p: (r - 1) * 100 };
    });
    res.sort(function (a, b) { return (b.v - a.v) || (a.i - b.i); });
    var top = Math.max(amt, res[0].v);
    var markX = amt / top * 100;

    res.forEach(function (r) {
      var row = self.rows[r.k];
      row.val.textContent = money(r.v);
      row.pct.textContent = pct(r.p);
      row.fill.style.width = (r.v / top * 100).toFixed(2) + "%";
      row.mark.style.left = markX.toFixed(2) + "%";
      self.list.appendChild(row.li);   // reorder by result
    });

    this.axis.textContent = money(amt, true);
    if (this.title) this.title.textContent = fill(T[lang()].title, { a: money(amt, true) });
    this.axis.style.left = markX.toFixed(2) + "%";
    this.axis.classList.toggle("is-end", markX > 80);

    var gap = !d.recorded[s];
    this.gap.hidden = !gap;

    this.results = res;
    if (announce) {
      clearTimeout(this.timer);
      this.timer = setTimeout(function () { self.say(); }, 600);
    }
  };

  Sim.prototype.say = function () {
    var t = T[lang()];
    var r = this.results.map(function (x) { return t[x.k] + " " + money(x.v) + " (" + pct(x.p) + ")"; }).join(", ");
    var msg = fill(t.live, { a: money(this.amt), s: monthName(this.d.months[this.start]), r: r });
    if (!this.d.recorded[this.start]) msg += " Seekingomega: " + t.gap;
    this.live.textContent = msg;
  };

  Sim.prototype.relang = function () {
    this.text();
    this.update(false);
  };

  function init() {
    var data = adapt(window.SO_DATA);
    if (!data) return;   // static default rows stay
    Array.prototype.forEach.call(document.querySelectorAll("[data-sim]"), function (root) {
      var sim = new Sim(root, data);
      var cur = lang();
      document.addEventListener("langchange", function () {
        if (lang() !== cur) { cur = lang(); sim.relang(); }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
