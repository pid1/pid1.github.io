// Appearance: Automatic (follows the OS), Light or Dark.
//
// localStorage "theme" holds "light" or "dark"; Automatic removes the key.
// Each page's <head> carries a one-line copy of apply() so data-theme is set
// before first paint. Without JavaScript the CSS follows the OS.
(() => {
  const root = document.documentElement;
  const KEY = "theme";

  function read() {
    try {
      const v = localStorage.getItem(KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch {
      return null;
    }
  }

  function apply(v) {
    if (v) root.setAttribute("data-theme", v);
    else root.removeAttribute("data-theme");
  }

  function sync() {
    const v = read();
    apply(v);
    const want = v || "auto";
    document
      .querySelectorAll('#appearance input[name="appearance"]')
      .forEach((i) => {
        i.checked = i.value === want;
      });
  }

  function setup() {
    const box = document.getElementById("appearance");
    if (!box) return;
    box.addEventListener("change", (e) => {
      const i = e.target;
      if (!(i instanceof HTMLInputElement) || !i.checked) return;
      const v = i.value === "light" || i.value === "dark" ? i.value : null;
      try {
        if (v) localStorage.setItem(KEY, v);
        else localStorage.removeItem(KEY);
      } catch {
        // Storage blocked: the choice still applies to this page.
      }
      apply(v);
    });
    sync();
    box.hidden = false;
  }

  apply(read());
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }

  // Keep pages in step when the choice changes in another tab, when a
  // speculatively prerendered page is shown, or when one returns from bfcache.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY || e.key === null) sync();
  });
  document.addEventListener("prerenderingchange", sync);
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) sync();
  });
})();
