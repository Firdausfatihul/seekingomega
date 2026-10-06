/* Seekingomega growth chart. Hand-written SVG, no library.
   Data: NAV per unit and IHSG, both indexed to 100 at 30 April 2020, month-end to 30 September 2026.
   To add a month: append one value to FUND and IHSG, set AS_OF to the NAV day, then update
   the date and the two numbers in the no-JS line in index.html. Months are derived from START. */
(function () {
  "use strict";

  var START = { y: 2020, m: 3 }; // April 2020 (m is 0-based)
  var FUND = [100,100,100,98.75,106.59,106.79,106.43,132.94,133.42,125.42,137.28,126.21,125.64,133.7,135.03,155.28,150.59,212.78,204.98,210.81,204.38,227.26,263.37,291.81,294,368.99,362.42,402.29,443.12,453,470.07,472.25,456.53,418.1,390.51,413.6,425.28,397.86,426.4,593.89,539.14,597.61,640.18,522.1,432.94,420.89,434.55,404.83,393.58,384.75,378.32,378.32,378.32,378.32,378.32,378.32,378.32,378.32,378.32,378.32,378.32,352.08,342.53,381.77,392.37,420.71,420.71,420.71,420.71,489.38,489.38,489.38,489.38,489.38,408.28,408.28,408.28,408.28];
  var IHSG = [100,100.79,104.01,109.19,111.07,103.26,108.73,119,126.77,124.3,132.34,126.91,127.12,126.1,126.91,128.7,130.4,133.3,139.75,138.54,139.54,140.6,146.05,149.93,153.27,151.58,146.54,147.38,152.2,149.28,150.51,150.14,145.25,145.01,145.09,144.29,146.63,140.64,141.25,146.96,147.43,147.14,143.16,150.13,154.2,152.83,155.12,154.54,153.38,147.8,149.77,153.84,162.64,159.61,160.59,150.84,150.11,150.73,132.95,138.04,143.47,152.15,146.88,158.69,166.03,170.92,173.1,180.41,183.34,176.61,174.61,149.44,147.5,129.92,119.65,132.22,138.36,128.72];
  var GAP = { from: 51, to: 61 };   // Jul 2024 (last recorded) to May 2025 (next recorded); Aug 2024 to Apr 2025 not recorded
  var FALL = { from: 42, to: 62, pct: "46.5" }; // Oct 2023 peak to Jun 2025 trough
  var AS_OF = 30;   // day of the last month-end NAV (30 September 2026); month and year come from the data
  var Y_MIN = 50, Y_MAX = 700, Y_TICKS = [100, 200, 300, 400, 500, 600], Y_TICKS_NARROW = [100, 300, 500];

  var T = {
    en: {
      title: "100 invested on 30 April 2020",
      fund: "Seekingomega",
      ihsg: "IHSG",
      gap: "not recorded",
      gapShort: "no data",
      fall: "Worst fall −{p}%",
      noRec: "not recorded",
      months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      label: "100 invested on 30 April 2020 became {f} with Seekingomega and {i} in the IHSG by {d}. Arrow keys move by month.",
      summary: "By {d}: Seekingomega {f}, IHSG {i}.",
      dec: "."
    },
    id: {
      title: "100 yang ditanam 30 April 2020",
      fund: "Seekingomega",
      ihsg: "IHSG",
      gap: "tidak tercatat",
      gapShort: "tanpa data",
      fall: "Penurunan terdalam −{p}%",
      noRec: "tidak tercatat",
      months: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"],
      label: "100 yang ditanam 30 April 2020 menjadi {f} di Seekingomega dan {i} di IHSG per {d}. Tombol panah berpindah per bulan.",
      summary: "Per {d}: Seekingomega {f}, IHSG {i}.",
      dec: ","
    }
  };

  var NS = "http://www.w3.org/2000/svg";
  var N = FUND.length;

  function lang() { return (document.documentElement.getAttribute("lang") || "en").slice(0, 2) === "id" ? "id" : "en"; }
  function t() { return T[lang()]; }
  function fmt(v) { return String(Math.round(v)); }
  function fill(s, o) { return s.replace(/\{(\w)\}/g, function (_, k) { return o[k]; }); }
  function monthOf(i) { var a = START.m + i; return { y: START.y + Math.floor(a / 12), m: a % 12 }; }
  function recorded(i) { return !(i > GAP.from && i < GAP.to); }

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
  }

  Chart.prototype.text = function () {
    var L = t(), last = monthOf(N - 1);
    var vals = { f: fmt(FUND[N - 1]), i: fmt(IHSG[N - 1]), d: AS_OF + " " + L.months[last.m] + " " + last.y };
    Array.prototype.forEach.call(this.fig.querySelectorAll("[data-chart-t]"), function (n) {
      var k = n.getAttribute("data-chart-t");
      if (L[k]) n.textContent = fill(L[k], vals);
    });
    // Legend: line keys, text in text tokens. The dotted stretch is labelled on the line itself.
    var lg = this.legend;
    if (lg) {
      lg.textContent = "";
      [["fund", L.fund], ["ihsg", L.ihsg]].forEach(function (it) {
        var li = document.createElement("li");
        var key = document.createElement("span");
        key.className = "chart-key chart-key--" + it[0];
        key.setAttribute("aria-hidden", "true");
        li.appendChild(key);
        li.appendChild(document.createTextNode(it[1]));
        lg.appendChild(li);
      });
    }
    this.label = fill(L.label, vals);
  };

  Chart.prototype.render = function () {
    var W = this.w || this.plot.clientWidth;
    if (!W) return;
    var narrow = W < 560;
    var compact = W < 900; // short end labels: values only, the legend names the lines
    // Phones: taller than wide. Tablets: 16:9. Desktop: 16:7.
    var H = Math.round(narrow ? Math.max(300, W * 1.05) : W < 900 ? W * 9 / 16 : W * 7 / 16);
    var m = { t: 12, r: compact ? 36 : 12, b: 28, l: 34 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b;
    var L = t();
    var xs = function (i) { return m.l + (i / (N - 1)) * pw; };
    var yv = function (v) { return m.t + ph - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * ph; };
    var yBase = yv(Y_MIN);
    var fy = function (i) { return yv(FUND[i]); };
    var iy = function (i) { return yv(IHSG[i]); };

    var prev = this.svg;
    var svg = el("svg", {
      "class": "chart-svg", width: W, height: H, viewBox: "0 0 " + W + " " + H,
      role: "img", tabindex: "0", "aria-label": this.label, focusable: "true"
    });

    // Worst-fall span: a quiet wash behind everything.
    var g0 = el("g", { "class": "chart-fall" }, svg);
    el("rect", { x: xs(FALL.from), y: m.t, width: xs(FALL.to) - xs(FALL.from), height: ph }, g0);
    var fallText = fill(L.fall, { p: L.dec === "," ? FALL.pct.replace(".", ",") : FALL.pct });
    var ft = el("text", { x: xs(FALL.from) + 6, y: m.t + 14, "class": "chart-note" }, g0);
    // Phones: the figure only, inside the band. The table carries the words.
    ft.textContent = narrow ? fallText.slice(fallText.lastIndexOf(" ") + 1) : fallText;

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

    // Lines: IHSG first (behind), then the fund.
    var gl = el("g", { "class": "chart-lines", "aria-hidden": "true" }, svg);
    el("path", { d: path(xs, iy, 0, N - 1), "class": "chart-line chart-line--ihsg" }, gl);
    el("path", { d: path(xs, fy, 0, GAP.from), "class": "chart-line chart-line--fund" }, gl);
    el("path", { d: path(xs, fy, GAP.from, GAP.to), "class": "chart-line chart-line--gap" }, gl);
    el("path", { d: path(xs, fy, GAP.to, N - 1), "class": "chart-line chart-line--fund" }, gl);
    // The dotted stretch is always labelled under the line; shorter words when the gap is narrow.
    var gw = xs(GAP.to) - xs(GAP.from);
    // Narrow: end the words before the line drops out of the gap.
    var gt = gw >= 100
      ? el("text", { x: (xs(GAP.from) + xs(GAP.to)) / 2, y: fy(GAP.from) + 18, "text-anchor": "middle", "class": "chart-note" }, gl)
      : el("text", { x: xs(GAP.to) - 8, y: fy(GAP.from) + 16, "text-anchor": "end", "class": "chart-note chart-note--s" }, gl);
    gt.textContent = gw >= 100 ? L.gap : L.gapShort;

    // End points and direct labels.
    var ex = xs(N - 1);
    el("circle", { cx: ex, cy: iy(N - 1), r: 4, "class": "chart-dot chart-dot--ihsg" }, gl);
    el("circle", { cx: ex, cy: fy(N - 1), r: 4, "class": "chart-dot chart-dot--fund" }, gl);
    if (compact) {
      // Phones and tablets: values only, right of the end dots; the legend names the lines.
      [[fy(N - 1), FUND[N - 1]], [iy(N - 1), IHSG[N - 1]]].forEach(function (p) {
        var tv = el("text", { x: ex + 8, y: p[0] + 4, "class": "chart-end chart-end-v" }, gl);
        tv.textContent = fmt(p[1]);
      });
    } else {
      var lf = el("text", { x: ex - 2, y: fy(N - 1) + 22, "text-anchor": "end", "class": "chart-end" }, gl);
      lf.textContent = L.fund + " ";
      el("tspan", { "class": "chart-end-v" }, lf).textContent = fmt(FUND[N - 1]);
      // IHSG label above its dot, clear of the 100 line underneath.
      var li = el("text", { x: ex - 2, y: iy(N - 1) - 12, "text-anchor": "end", "class": "chart-end" }, gl);
      li.textContent = L.ihsg + " ";
      el("tspan", { "class": "chart-end-v" }, li).textContent = fmt(IHSG[N - 1]);
    }

    // Hover layer.
    var gh = el("g", { "class": "chart-hover", "aria-hidden": "true" }, svg);
    var cross = el("line", { y1: m.t, y2: yBase, "class": "chart-cross" }, gh);
    var dI = el("circle", { r: 4, "class": "chart-dot chart-dot--ihsg" }, gh);
    var dF = el("circle", { r: 4, "class": "chart-dot chart-dot--fund" }, gh);
    // Half a month of slack each side, plus the end-value margin on compact layouts.
    var half = pw / (N - 1) / 2;
    var hit = el("rect", { x: m.l - half, y: 0, width: pw + half + (compact ? m.r : half), height: H, "class": "chart-hit" }, svg);

    var wasFocused = !!prev && document.activeElement === prev;
    if (prev) this.plot.replaceChild(svg, prev); else this.plot.insertBefore(svg, this.plot.firstChild);
    this.svg = svg;
    var tip = this.tip || (this.tip = this.plot.querySelector(".chart-tip"));
    var self = this;

    function show(i, announce) {
      self.active = i;
      var x = xs(i);
      gh.style.display = "";
      svg.classList.add("is-active"); // end labels step aside; the tooltip has both values
      cross.setAttribute("x1", x); cross.setAttribute("x2", x);
      dI.setAttribute("cx", x); dI.setAttribute("cy", iy(i));
      dF.setAttribute("cx", x); dF.setAttribute("cy", fy(i));
      dF.style.display = recorded(i) ? "" : "none";
      var mo = monthOf(i), LL = t();
      var when = LL.months[mo.m] + " " + mo.y;
      tip.textContent = "";
      var h = document.createElement("p"); h.className = "chart-tip-m"; h.textContent = when; tip.appendChild(h);
      var rec = recorded(i);
      var rows = [[rec ? "fund" : "gap", rec ? fmt(FUND[i]) : "", LL.fund], ["ihsg", fmt(IHSG[i]), LL.ihsg]];
      rows.forEach(function (r, n) {
        var p = document.createElement("p"); p.className = "chart-tip-r";
        var k = document.createElement("span"); k.className = "chart-key chart-key--" + r[0]; p.appendChild(k);
        var v = document.createElement("strong"); v.textContent = r[1]; p.appendChild(v);
        var s = document.createElement("span"); s.className = "chart-tip-s"; s.textContent = r[2]; p.appendChild(s);
        if (n === 0 && !rec) {
          var nr = document.createElement("span"); nr.className = "chart-tip-n"; nr.textContent = LL.noRec; p.appendChild(nr);
        }
        tip.appendChild(p);
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
        top = Math.min(fy(i), iy(i)) - th / 2;
        top = Math.max(0, Math.min(H - m.b - th, top));
      }
      left = Math.max(0, Math.min(W - tw, left));
      tip.style.transform = "translate(" + Math.round(left) + "px," + Math.round(top) + "px)";
      if (announce && self.live) {
        self.live.textContent = when + ". " + LL.fund + " " + (recorded(i) ? fmt(FUND[i]) : LL.noRec) + ". " + LL.ihsg + " " + fmt(IHSG[i]) + ".";
      }
    }
    function hide() { self.active = null; gh.style.display = "none"; tip.hidden = true; svg.classList.remove("is-active"); }
    function nearest(evt) {
      var r = svg.getBoundingClientRect();
      var i = Math.round(((evt.clientX - r.left - m.l) / pw) * (N - 1));
      return Math.max(0, Math.min(N - 1, i));
    }

    hit.addEventListener("pointermove", function (e) { show(nearest(e), false); });
    hit.addEventListener("pointerdown", function (e) { show(nearest(e), false); });
    // Keyboard focus keeps the tooltip; a mouse click that focused the chart does not.
    hit.addEventListener("pointerleave", function () {
      var kb = false;
      try { kb = svg.matches(":focus-visible"); } catch (e) { kb = false; }
      if (!kb) hide();
    });
    svg.addEventListener("focus", function () { show(self.active === null ? N - 1 : self.active, true); });
    svg.addEventListener("blur", hide);
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
