/* Seekingomega growth chart. Hand-written SVG, no library.
   Data: window.SO_DATA from assets/data.js (load it first). Four series, all indexed to 100 at
   30 April 2020, month-end, in rupiah. To add a month, edit assets/data.js only, then the
   date and the four numbers in the no-JS line in index.html. */
(function () {
  "use strict";

  var D = window.SO_DATA;
  if (!D || !D.months || !D.series) return;

  var S = D.series;
  var N = D.months.length;
  // Legend, end labels and tooltip read top to bottom in this order. Drawn back to front in reverse.
  var KEYS = ["fund", "spx", "gold", "ihsg"];
  var START = { y: +D.months[0].slice(0, 4), m: +D.months[0].slice(5, 7) - 1 };
  var AS_OF = +D.asOf.slice(8, 10);
  // Not-recorded stretch: last recorded month before it to the first recorded month after it.
  var GAP = (function () {
    var a = D.recorded.indexOf(0), b = D.recorded.lastIndexOf(0);
    return a < 0 ? null : { from: a - 1, to: b + 1 };
  })();
  var FALL = { from: D.months.indexOf("2023-10"), to: D.months.indexOf("2025-06"), pct: "46.5" }; // fund, peak to trough
  var Y_MIN = 50, Y_MAX = 700, Y_TICKS = [100, 200, 300, 400, 500, 600], Y_TICKS_NARROW = [100, 300, 500];

  var T = {
    en: {
      title: "Rp100 invested on 30 April 2020",
      fund: "Seekingomega", spx: "S&P\u00a0500", gold: "Gold", ihsg: "IHSG",
      gap: "not recorded",
      gapShort: "no data",
      fall: "Worst fall −{p}%",
      noRec: "not recorded",
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      label: "Rp100 invested on 30 April 2020, by {d}: Seekingomega {f}, S&P\u00a0500 {s}, gold {g}, IHSG {i}. In rupiah. Arrow keys move by month.",
      summary: "By {d}: Seekingomega {f}, S&P\u00a0500 {s}, gold {g}, IHSG {i}.",
      dec: "."
    },
    id: {
      title: "Rp100 yang diinvestasikan 30 April 2020",
      fund: "Seekingomega", spx: "S&P\u00a0500", gold: "Emas", ihsg: "IHSG",
      gap: "tidak tercatat",
      gapShort: "tanpa data",
      fall: "Penurunan terdalam −{p}%",
      noRec: "tidak tercatat",
      months: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
      label: "Rp100 yang diinvestasikan 30 April 2020, per {d}: Seekingomega {f}, S&P\u00a0500 {s}, emas {g}, IHSG {i}. Dalam rupiah. Tombol panah berpindah per bulan.",
      summary: "Per {d}: Seekingomega {f}, S&P\u00a0500 {s}, emas {g}, IHSG {i}.",
      dec: ","
    }
  };

  var NS = "http://www.w3.org/2000/svg";

  function lang() { return (document.documentElement.getAttribute("lang") || "en").slice(0, 2) === "id" ? "id" : "en"; }
  function t() { return T[lang()]; }
  function fmt(v) { return String(Math.round(v)); }
  function fill(s, o) { return s.replace(/\{(\w)\}/g, function (_, k) { return o[k]; }); }
  function monthOf(i) { var a = START.m + i; return { y: START.y + Math.floor(a / 12), m: a % 12 }; }
  function recorded(i) { return !!D.recorded[i]; }
  function shown(k, i) { return k !== "fund" || recorded(i); }

  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function path(xs, ys, from, to) {
    var d = "";
    for (var i = from; i <= to; i++) d += (i === from ? "M" : "L") + xs(i).toFixed(1) + " " + ys(i).toFixed(1);
    return d;
  }
  // Spread label centres at least `gap` apart, keeping each as close to its line end as it can.
  function spread(items, gap, lo, hi) {
    items.sort(function (a, b) { return a.y - b.y; });
    // Overlapping labels merge into a block centred on the mean of their line ends.
    var blocks = items.map(function (it) { return { items: [it], sum: it.y }; });
    function top(b) {
      var c = b.sum / b.items.length, span = (b.items.length - 1) * gap;
      return Math.max(lo, Math.min(hi - span, c - span / 2));
    }
    for (var merged = true; merged;) {
      merged = false;
      for (var j = 1; j < blocks.length; j++) {
        var a = blocks[j - 1], b = blocks[j];
        if (top(b) < top(a) + a.items.length * gap) {
          blocks.splice(j - 1, 2, { items: a.items.concat(b.items), sum: a.sum + b.sum });
          merged = true;
          break;
        }
      }
    }
    blocks.forEach(function (b) {
      var y = top(b);
      b.items.forEach(function (it, n) { it.y = y + n * gap; });
    });
    return items;
  }

  function Chart(fig) {
    this.fig = fig;
    this.plot = fig.querySelector(".chart-plot");
    this.legend = fig.querySelector(".chart-legend");
    this.live = fig.querySelector(".chart-live");
    this.active = null;
    this.w = 0;
    fig.classList.add("is-ready");
    this.text();
    var self = this;
    if ("ResizeObserver" in window) {
      new ResizeObserver(function (entries) {
        var w = Math.round(entries[0].contentRect.width);
        if (w && w !== self.w) { self.w = w; self.render(); }
      }).observe(this.plot);
    } else {
      this.w = this.plot.clientWidth; this.render();
    }
    // Re-label when the site toggles language. site.js fires "langchange";
    // the lang attribute observer is a fallback. Each language renders once.
    this.lang = lang();
    function relang() {
      if (lang() === self.lang) return;
      self.lang = lang(); self.text(); self.render();
    }
    new MutationObserver(relang)
      .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    document.addEventListener("langchange", relang);
    // A tap or click outside the chart clears a touch-held tooltip.
    document.addEventListener("pointerdown", function (e) {
      if (self.hideOutside) self.hideOutside(e.target);
    });
  }

  Chart.prototype.text = function () {
    var L = t(), last = monthOf(N - 1), e = N - 1;
    var vals = {
      f: fmt(S.fund[e]), s: fmt(S.spx[e]), g: fmt(S.gold[e]), i: fmt(S.ihsg[e]),
      d: AS_OF + " " + L.months[last.m] + " " + last.y
    };
    Array.prototype.forEach.call(this.fig.querySelectorAll("[data-chart-t]"), function (n) {
      var k = n.getAttribute("data-chart-t");
      if (L[k]) n.textContent = fill(L[k], vals);
    });
    // Legend: line keys, text in text tokens. The dotted stretch is labelled on the line itself.
    var lg = this.legend;
    if (lg) {
      lg.textContent = "";
      KEYS.forEach(function (k) {
        var li = document.createElement("li");
        var key = document.createElement("span");
        key.className = "chart-key chart-key--" + k;
        key.setAttribute("aria-hidden", "true");
        li.appendChild(key);
        li.appendChild(document.createTextNode(L[k]));
        lg.appendChild(li);
      });
    }
    this.label = fill(L.label, vals);
  };

  Chart.prototype.render = function () {
    var W = this.w || this.plot.clientWidth;
    if (!W) return;
    var L = t();
    var narrow = W < 560;
    var compact = W < 900; // end labels are values only; the legend names the lines
    // Phones: taller than wide. Tablets: 16:9. Desktop: 16:7.
    var H = Math.round(narrow ? Math.max(320, W * 1.1) : W < 900 ? W * 9 / 16 : W * 7 / 16);
    // Right gutter holds the end labels: leader tick plus text.
    var longest = 0;
    KEYS.forEach(function (k) {
      var n = (compact ? "" : L[k] + " ").length + fmt(S[k][N - 1]).length;
      if (n > longest) longest = n;
    });
    var m = { t: 12, r: 18 + Math.ceil(longest * (compact ? 7 : 7.4)), b: 28, l: 34 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b;
    var xs = function (i) { return m.l + (i / (N - 1)) * pw; };
    var yv = function (v) { return m.t + ph - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * ph; };
    var yBase = yv(Y_MIN);
    var ys = {};
    KEYS.forEach(function (k) { ys[k] = function (i) { return yv(S[k][i]); }; });

    var prev = this.svg;
    var svg = el("svg", {
      "class": "chart-svg", width: W, height: H, viewBox: "0 0 " + W + " " + H,
      role: "img", tabindex: "0", "aria-label": this.label, focusable: "true"
    });

    // Worst-fall span: a quiet wash behind everything.
    if (FALL.from >= 0 && FALL.to > FALL.from) {
      var g0 = el("g", { "class": "chart-fall", "aria-hidden": "true" }, svg);
      el("rect", { x: xs(FALL.from), y: m.t, width: xs(FALL.to) - xs(FALL.from), height: ph }, g0);
      var fallText = fill(L.fall, { p: L.dec === "," ? FALL.pct.replace(".", ",") : FALL.pct });
      var ft = el("text", { x: xs(FALL.from) + 6, y: m.t + 14, "class": "chart-note" }, g0);
      // Phones: the figure only, inside the band. The table carries the words.
      ft.textContent = narrow ? fallText.slice(fallText.lastIndexOf(" ") + 1) : fallText;
    }

    // Grid and y ticks.
    var g1 = el("g", { "class": "chart-grid", "aria-hidden": "true" }, svg);
    el("line", { x1: m.l, x2: m.l + pw, y1: yBase, y2: yBase, "class": "chart-base" }, g1);
    // 100 is the starting line. Phones get evenly spaced labels: 100, 300, 500.
    (narrow ? Y_TICKS_NARROW : Y_TICKS).forEach(function (v) {
      var y = Math.round(yv(v)) + 0.5;
      el("line", { x1: m.l, x2: m.l + pw, y1: y, y2: y, "class": v === 100 ? "chart-ref" : "" }, g1);
      var tx = el("text", { x: m.l - 8, y: y + 4, "text-anchor": "end", "class": "chart-tick" }, g1);
      tx.textContent = String(v);
    });

    // X axis: a tick at each January, the year centred in its span.
    var gx = el("g", { "class": "chart-x", "aria-hidden": "true" }, svg);
    var firstY = START.y, lastY = monthOf(N - 1).y;
    var everyOther = pw * 12 / (N - 1) < 44; // too tight for every year: label even years only
    for (var yr = firstY; yr <= lastY; yr++) {
      var a = Math.max(0, (yr - START.y) * 12 - START.m);
      var b = Math.min(N - 1, a + (yr === START.y ? 11 - START.m : 12));
      if (yr > firstY) el("line", { x1: Math.round(xs(a)) + 0.5, x2: Math.round(xs(a)) + 0.5, y1: yBase, y2: yBase + 5 }, gx);
      if (everyOther && yr % 2) continue;
      var lx = el("text", { x: (xs(a) + xs(b)) / 2, y: H - 8, "text-anchor": "middle", "class": "chart-tick" }, gx);
      lx.textContent = String(yr);
    }

    // Lines: benchmarks behind, the fund on top.
    var gl = el("g", { "class": "chart-lines", "aria-hidden": "true" }, svg);
    KEYS.slice(1).reverse().forEach(function (k) {
      el("path", { d: path(xs, ys[k], 0, N - 1), "class": "chart-line chart-line--" + k }, gl);
    });
    var fy = ys.fund;
    if (GAP) {
      el("path", { d: path(xs, fy, 0, GAP.from), "class": "chart-line chart-line--fund" }, gl);
      el("path", { d: path(xs, fy, GAP.from, GAP.to), "class": "chart-line chart-line--gap" }, gl);
      el("path", { d: path(xs, fy, GAP.to, N - 1), "class": "chart-line chart-line--fund" }, gl);
      // The dotted stretch is always labelled under the line; shorter words when the gap is narrow.
      var gw = xs(GAP.to) - xs(GAP.from);
      var gt = gw >= 100
        ? el("text", { x: (xs(GAP.from) + xs(GAP.to)) / 2, y: fy(GAP.from) + 18, "text-anchor": "middle", "class": "chart-note" }, gl)
        : el("text", { x: xs(GAP.to) - 8, y: fy(GAP.from) + 16, "text-anchor": "end", "class": "chart-note chart-note--s" }, gl);
      gt.textContent = gw >= 100 ? L.gap : L.gapShort;
    } else {
      el("path", { d: path(xs, fy, 0, N - 1), "class": "chart-line chart-line--fund" }, gl);
    }

    // End points and direct labels in the right gutter, nudged apart, with a leader tick
    // in the series colour back to each end point.
    var ex = xs(N - 1);
    var ge = el("g", { "class": "chart-ends", "aria-hidden": "true" }, svg);
    var labels = spread(KEYS.map(function (k) { return { k: k, y0: ys[k](N - 1), y: ys[k](N - 1) }; }),
      compact ? 15 : 17, m.t + 6, yBase - 6);
    KEYS.slice().reverse().forEach(function (k) {
      el("circle", { cx: ex, cy: ys[k](N - 1), r: 4, "class": "chart-dot chart-dot--" + k }, ge);
    });
    labels.forEach(function (it) {
      el("path", { d: "M" + (ex + 6) + " " + it.y0.toFixed(1) + "L" + (ex + 9) + " " + it.y0.toFixed(1) +
        "L" + (ex + 13) + " " + it.y.toFixed(1), "class": "chart-lead chart-lead--" + it.k }, ge);
      var tx = el("text", { x: ex + 16, y: it.y + 4, "class": "chart-end" }, ge);
      if (!compact) tx.textContent = L[it.k] + " ";
      el("tspan", { "class": "chart-end-v" }, tx).textContent = fmt(S[it.k][N - 1]);
    });

    // Hover layer.
    var gh = el("g", { "class": "chart-hover", "aria-hidden": "true" }, svg);
    var cross = el("line", { y1: m.t, y2: yBase, "class": "chart-cross" }, gh);
    var dots = {};
    KEYS.slice().reverse().forEach(function (k) { dots[k] = el("circle", { r: 4, "class": "chart-dot chart-dot--" + k }, gh); });
    // Half a month of slack on the left; the label gutter on the right.
    var half = pw / (N - 1) / 2;
    var hit = el("rect", { x: m.l - half, y: 0, width: pw + half + m.r, height: H, "class": "chart-hit" }, svg);

    var wasFocused = !!prev && document.activeElement === prev;
    if (prev) this.plot.replaceChild(svg, prev); else this.plot.insertBefore(svg, this.plot.firstChild);
    this.svg = svg;
    var tip = this.tip || (this.tip = this.plot.querySelector(".chart-tip"));
    var self = this;

    function show(i, announce) {
      self.active = i;
      var x = xs(i);
      gh.style.display = "";
      svg.classList.add("is-active"); // end labels step aside; the tooltip has every value
      cross.setAttribute("x1", x); cross.setAttribute("x2", x);
      KEYS.forEach(function (k) {
        dots[k].setAttribute("cx", x); dots[k].setAttribute("cy", ys[k](i));
        dots[k].style.display = shown(k, i) ? "" : "none";
      });
      var mo = monthOf(i), LL = t();
      var when = LL.months[mo.m] + " " + mo.y;
      tip.textContent = "";
      var h = document.createElement("p"); h.className = "chart-tip-m"; h.textContent = when; tip.appendChild(h);
      var said = [];
      KEYS.forEach(function (k) {
        var ok = shown(k, i);
        var p = document.createElement("p"); p.className = "chart-tip-r";
        var key = document.createElement("span"); key.className = "chart-key chart-key--" + (ok ? k : "gap"); p.appendChild(key);
        var v = document.createElement("strong"); v.textContent = ok ? fmt(S[k][i]) : ""; p.appendChild(v);
        var s = document.createElement("span"); s.className = "chart-tip-s"; s.textContent = LL[k]; p.appendChild(s);
        if (!ok) { var nr = document.createElement("span"); nr.className = "chart-tip-n"; nr.textContent = LL.noRec; p.appendChild(nr); }
        tip.appendChild(p);
        said.push(LL[k] + " " + (ok ? fmt(S[k][i]) : LL.noRec));
      });
      tip.hidden = false;
      var tw = tip.offsetWidth, th = tip.offsetHeight, left, top;
      if (narrow) {
        // Phones: pinned to the top corner away from the crosshair, so it never covers the point.
        left = x > m.l + pw / 2 ? m.l + 4 : m.l + pw - tw - 4;
        top = m.t + 22;
      } else {
        left = x + 14;
        if (left + tw > W) left = x - 14 - tw;
        var yy = KEYS.map(function (k) { return ys[k](i); });
        top = (Math.min.apply(null, yy) + Math.max.apply(null, yy)) / 2 - th / 2;
        top = Math.max(0, Math.min(H - m.b - th, top));
      }
      left = Math.max(0, Math.min(W - tw, left));
      tip.style.transform = "translate(" + Math.round(left) + "px," + Math.round(top) + "px)";
      if (announce && self.live) self.live.textContent = when + ". " + said.join(". ") + ".";
    }
    function hide() { self.active = null; gh.style.display = "none"; tip.hidden = true; svg.classList.remove("is-active"); }
    function nearest(evt) {
      var r = svg.getBoundingClientRect();
      var i = Math.round(((evt.clientX - r.left - m.l) / pw) * (N - 1));
      return Math.max(0, Math.min(N - 1, i));
    }

    hit.addEventListener("pointermove", function (e) { show(nearest(e), false); });
    hit.addEventListener("pointerdown", function (e) { self.fromPointer = true; show(nearest(e), false); });
    // Keyboard focus keeps the tooltip; a mouse leaving the chart does not.
    // Touch and pen fire pointerleave when the finger lifts, so the tapped
    // month stays until blur or a tap elsewhere on the page.
    hit.addEventListener("pointerleave", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var kb = false;
      try { kb = svg.matches(":focus-visible"); } catch (err) { kb = false; }
      if (!kb) hide();
    });
    svg.addEventListener("focus", function () {
      var i = self.active === null ? N - 1 : self.active;
      if (self.fromPointer && self.active !== null) i = self.active;
      self.fromPointer = false;
      show(i, true);
    });
    // The document-level "tap elsewhere" listener (set once in Chart) calls this.
    self.hideOutside = function (t) { if (self.active !== null && !svg.contains(t)) hide(); };
    svg.addEventListener("blur", function () { self.fromPointer = false; hide(); });
    svg.addEventListener("keydown", function (e) {
      var i = self.active === null ? N - 1 : self.active, j = i;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") j = i - 1;
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") j = i + 1;
      else if (e.key === "PageDown") j = i - 12;
      else if (e.key === "PageUp") j = i + 12;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = N - 1;
      else if (e.key === "Escape") { hide(); return; }
      else return;
      e.preventDefault();
      show(Math.max(0, Math.min(N - 1, j)), true);
    });

    var keep = this.active;
    hide();
    if (wasFocused) { svg.focus({ preventScroll: true }); if (keep !== null) show(keep, false); }
  };

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-chart='growth']"), function (f) { new Chart(f); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
