/* Albireo band conditions card. Enhances every <div data-band-card> on the page.
   Example source: copy it, change it, no build step. It reads the public NowSnapshot
   (GET <API_ORIGIN>/v1/now, no key) and renders it. It shows state, not age: a stale field reads
   "No Data", and the card never shows how old anything is. */
(function () {
  "use strict";

  // ---------------------------------------------------------------------------------------------
  // CONFIGURE HERE.
  // API_ORIGIN: the Albireo API's origin. Set it to "" to read the local fixture instead
  // (card.html does the same per card with data-src="fixtures/now.json").
  var API_ORIGIN = "https://albireo.cygnusstrategy.com";
  // PROJECT_SITE: where the attribution link goes.
  var PROJECT_SITE = "https://albireo.cygnusstrategy.com/";
  // ---------------------------------------------------------------------------------------------

  var DEFAULT_SRC = API_ORIGIN ? API_ORIGIN.replace(/\/$/, "") + "/v1/now" : "fixtures/now.json";
  var REFRESH_MS = 5 * 60 * 1000; // at most every 5 minutes; data-refresh can only make it slower
  var NO_DATA = "No Data";
  var DEFAULT_ATTRIBUTION =
    "Data: NOAA Space Weather Prediction Center. Propagation model: ITU-R P.533 and P.1239.";

  var BAND_LABELS = { "80m-40m": "80m-40m", "30m-20m": "30m-20m", "17m-15m": "17m-15m", "12m-10m": "12m-10m" };
  var RATING_CLASS = { Good: "bc-good", Fair: "bc-fair", Poor: "bc-poor" };
  var GEOMAG_CLASS = {
    "Inactive": "bc-good", "Very Quiet": "bc-good", "Quiet": "bc-good",
    "Unsettled": "bc-fair", "Active": "bc-fair",
    "Minor Storm": "bc-storm", "Major Storm": "bc-storm", "Severe Storm": "bc-storm", "Extreme Storm": "bc-storm"
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // A field's value, or null when it has no data. `now` is set only when the snapshot is a held
  // copy from an earlier fetch: then a field past its stale_after also counts as no data.
  function val(field, now) {
    if (!field || field.status !== "ok" || field.value === null || field.value === undefined) return null;
    if (now && field.stale_after && Date.parse(field.stale_after) <= now) return null;
    return field.value;
  }

  function num(v) {
    if (typeof v !== "number" || !isFinite(v)) return null;
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10);
  }

  function noData() {
    return '<span class="bc-nodata">' + NO_DATA + "</span>";
  }

  function figure(label, text) {
    return "<div><dt class=\"bc-label\">" + label + "</dt><dd>" +
      (text === null ? noData() : '<span class="bc-figure">' + esc(text) + "</span>") + "</dd></div>";
  }

  function status(word, cls) {
    return '<span class="' + cls + '"><span class="bc-sym" aria-hidden="true"></span>' + esc(word) + "</span>";
  }

  function row(label, html) {
    return "<div><dt class=\"bc-label\">" + label + "</dt><dd>" + (html === null ? noData() : html) + "</dd></div>";
  }

  // Pure: snapshot in, HTML out. Usable on a server too (see the export at the bottom).
  function renderCard(snap, opts) {
    opts = opts || {};
    var now = opts.heldSince ? Date.now() : 0;
    var s = snap || {};
    var site = opts.projectSite || PROJECT_SITE;

    var geomag = val(s.geomag_field, now);
    var bands = val(s.hf_bands, now);
    var vhf = val(s.vhf_aurora, now);
    var noise = val(s.noise_s_units, now);

    var html = '<h2 class="bc-title">Band conditions</h2>';

    html += '<dl class="bc-figures">' +
      figure("Solar flux", num(val(s.solar_flux, now))) +
      figure("Sunspots", num(val(s.sunspot_number, now))) +
      figure("X-ray", val(s.xray_class, now)) +
      figure("K index", num(val(s.kp, now))) +
      figure("A index", num(val(s.a_index, now))) +
      figure("Noise", noise) +
      "</dl>";

    html += '<dl class="bc-rows">' +
      row("Geomag field", geomag === null ? null : status(geomag, GEOMAG_CLASS[geomag] || "bc-poor")) +
      row("VHF aurora", vhf === null ? null : esc(vhf)) +
      "</dl>";

    html += "<table><caption>HF bands</caption><thead><tr>" +
      '<th scope="col">Band</th><th scope="col">Day</th><th scope="col">Night</th></tr></thead><tbody>';
    var order = ["80m-40m", "30m-20m", "17m-15m", "12m-10m"];
    var byBand = {};
    if (Array.isArray(bands)) bands.forEach(function (b) { if (b && b.band) byBand[b.band] = b; });
    order.forEach(function (key) {
      var b = byBand[key];
      html += '<tr><th scope="row">' + BAND_LABELS[key] + "</th>";
      ["day", "night"].forEach(function (part) {
        var r = b && RATING_CLASS[b[part]] ? b[part] : null;
        html += "<td>" + (r ? status(r, RATING_CLASS[r]) : noData()) + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table>";

    var attribution = typeof s.attribution === "string" && s.attribution ? s.attribution : DEFAULT_ATTRIBUTION;
    html += '<p class="bc-attr"><a href="' + esc(site) + '">' + esc(attribution) + " Via Albireo.</a></p>";
    return html;
  }

  function enhance(el) {
    if (el.__bandCard) return;
    var src = el.getAttribute("data-src") || DEFAULT_SRC;
    var every = Math.max(REFRESH_MS, (parseInt(el.getAttribute("data-refresh"), 10) || 0) * 1000);
    var held = null;
    var timer = null;
    var lastLoad = 0;
    el.__bandCard = true;
    if (!el.hasAttribute("role")) el.setAttribute("role", "region");
    if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", "Band conditions");

    function paint(snap, heldSince) {
      el.innerHTML = renderCard(snap, { heldSince: heldSince });
    }

    function load() {
      lastLoad = Date.now();
      el.setAttribute("aria-busy", "true");
      fetch(src, { headers: { Accept: "application/json" }, cache: "no-cache" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.json();
        })
        .then(function (snap) {
          if (!snap || snap.schema !== "now.v1") throw new Error("unexpected schema");
          held = snap;
          paint(snap, false);
        })
        .catch(function () {
          // Keep what we have, but let each field fall to No Data once its stale_after passes.
          paint(held, true);
        })
        .then(function () {
          el.removeAttribute("aria-busy");
        });
    }

    function schedule() {
      clearInterval(timer);
      timer = setInterval(function () {
        if (document.visibilityState !== "hidden") load();
      }, every);
    }

    load();
    schedule();
    // Back from a hidden tab: refresh if a tick was skipped, still no more than every 5 minutes.
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && Date.now() - lastLoad >= every) {
        load();
        schedule();
      }
    });
  }

  function init() {
    var els = document.querySelectorAll("[data-band-card]");
    for (var i = 0; i < els.length; i++) enhance(els[i]);
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  }

  // Server rendering: require("./card.js").renderCard(snapshot) returns the inner HTML.
  if (typeof module !== "undefined" && module.exports) module.exports = { renderCard: renderCard };
})();
