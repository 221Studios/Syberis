(() => {
  if (location.hostname !== "syberis.pl" && location.hostname !== "www.syberis.pl") return;

  // OVH may already include the CMS runtime in the HTML response.
  if (document.querySelector('script[src="/cms-photo-runtime.js"]')) return;

  const allowed = /^\/cms-site-media\/[a-f0-9]{32}\.webp$/;
  let photos = {};
  const nativeSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  const originals = new WeakMap();
  const tracked = new Set();
  const originalBackground = new WeakMap();

  function replacement(url) {
    if (!url) return url;
    try {
      const parsed = new URL(url, location.href);
      const next = parsed.origin === location.origin && photos[parsed.pathname];
      return allowed.test(next || "") ? next : url;
    } catch {
      return url;
    }
  }

  function refresh(image) {
    const src = originals.get(image) || image.getAttribute("src");
    const next = replacement(src);
    if (next && next !== image.getAttribute("src")) {
      if (next !== src) {
        originals.set(image, src);
        image.removeAttribute("srcset");
        image.closest("picture")?.querySelectorAll("source").forEach(source => source.removeAttribute("srcset"));
      }
      nativeSrc.set.call(image, next);
    }
  }

  function refreshDocument() {
    document.querySelectorAll("img").forEach(refresh);
    for (const ref of tracked) {
      const image = ref.deref();
      if (image) refresh(image);
      else tracked.delete(ref);
    }
    document.querySelectorAll("[style*='url(']").forEach(node => {
      const before = node.style.backgroundImage;
      const original = originalBackground.get(node) || before;
      const after = original.replace(/url\(["']?([^"'()]+)["']?\)/g, (match, url) => {
        const next = replacement(url);
        return next === url ? match : 'url("' + next + '")';
      });
      if (before !== after) {
        originalBackground.set(node, original);
        node.style.backgroundImage = after;
      }
    });
  }

  Object.defineProperty(HTMLImageElement.prototype, "src", {
    ...nativeSrc,
    set(value) {
      if (!originals.has(this)) tracked.add(new WeakRef(this));
      originals.set(this, String(value));
      nativeSrc.set.call(this, replacement(String(value)));
    },
  });

  function setPagePhotos(fields) {
    photos = Object.fromEntries(fields.map(field => [field.original, field.value]));
    refreshDocument();
  }
  let scheduled = false;
  function refreshSoon() {
    if (scheduled || !Object.keys(photos).length) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      refreshDocument();
    });
  }
  new MutationObserver(refreshSoon).observe(document.documentElement, {
    subtree: true, childList: true, attributes: true, attributeFilter: ["src", "srcset", "style"],
  });
  document.addEventListener("DOMContentLoaded", refreshSoon, { once: true });

  let route = null;
  let fields = [];
  let decorated = new Map();
  let request = null;
  let queued = false;
  let observer;

  function apply(field, node) {
    const value = field.value;
    if (field.type === "background-image") {
      if (!/^\/cms-site-media\/[a-f0-9]{32}\.webp$/.test(value)) return;
      node.style.backgroundImage = `url("${value}")`;
      node.classList.remove("deck-slide-img--icon");
    } else if (field.type === "image") {
      if (!/^\/cms-site-media\/[a-f0-9]{32}\.webp$/.test(value)) return;
      if (node.getAttribute("src") === value && !node.hasAttribute("srcset")) return;
      node.removeAttribute("srcset");
      node.removeAttribute("sizes");
      node.setAttribute("src", value);
      const picture = node.closest("picture");
      picture?.querySelectorAll("source").forEach(source => source.setAttribute("srcset", value));
    } else if (field.type === "meta") {
      if (node.getAttribute("content") !== value) node.setAttribute("content", value);
    } else if (field.type === "lines") {
      const current = [...node.childNodes].map(child => child.nodeName === "BR" ? "\n" : child.textContent).join("");
      if (current === value) return;
      node.replaceChildren();
      value.split("\n").forEach((line, index) => {
        if (index > 0) node.append(document.createElement("br"));
        node.append(document.createTextNode(line));
      });
    } else if (node.textContent !== value) {
      // Retain wrapper elements and React-owned text nodes.
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      const text = [];
      while (walker.nextNode()) text.push(walker.currentNode);
      if (!text.length) node.append(document.createTextNode(value));
      else {
        text[0].data = value;
        text.slice(1).forEach(part => { part.data = ""; });
      }
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  }

  function update() {
    const path = location.pathname.replace(/\/?$/, "/");
    if (path !== route) {
      route = path;
      fields = [];
      setPagePhotos([]);
      decorated = new Map();
      request?.abort();
      request = new AbortController();
      fetch("/cms-site-content.json?path=" + encodeURIComponent(path), {
        signal: request.signal, credentials: "same-origin", cache: "no-store"
      }).then(response => response.ok ? response.json() : []).then(data => {
        if (route !== path) return;
        fields = Array.isArray(data) ? data : [];
        setPagePhotos(fields.filter(field => field.type === "page-asset"));
        schedule();
      }).catch(() => {});
    }
    for (const field of fields) {
      if (field.type === "asset-image" || field.type === "page-asset") continue;
      const matches = document.querySelectorAll(field.selector);
      const nodes = field.index === -1 ? [...matches] : [matches[field.index]];
      const seen = decorated.get(field) || new WeakSet();
      for (const node of nodes) {
        if (!node || seen.has(node)) continue;
        observer.disconnect();
        try { apply(field, node); }
        finally { observer.observe(document.documentElement, { childList: true, subtree: true }); }
        seen.add(node);
      }
      decorated.set(field, seen);
    }
  }

  function start() {
    observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    addEventListener("popstate", schedule);
    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function (...args) {
        const result = original.apply(this, args);
        schedule();
        return result;
      };
    }
    schedule();
  }
  if (document.readyState === "complete") start();
  else addEventListener("load", start, { once: true });
})();
