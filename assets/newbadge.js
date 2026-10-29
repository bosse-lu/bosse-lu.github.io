/* Site-wide "NEW" alert: when English News or Spécial footeux has an article this learner hasn't opened yet,
   show a big red NEW in the page corner, a notification banner (once per visit) and red ribbons on the home cards.
   Reads the same "seen" list as the newsroom pages (localStorage newsroom-news / newsroom-foot). */
(function () {
  const me = document.currentScript;
  const base = new URL("..", me ? me.src : location.href);
  const NEW_DAYS = 14;
  const FEEDS = [
    {kind: "news", name: "English News", href: new URL("news/", base).href},
    {kind: "foot", name: "Spécial footeux", href: new URL("foot/", base).href}
  ];
  const css = `
  :root{--hot:#e0242f}
  .nb-corner{position:fixed;top:max(12px,env(safe-area-inset-top,0px));right:max(12px,env(safe-area-inset-right,0px));z-index:60;display:flex;align-items:center;gap:6px;
    background:var(--hot);color:#fff;border:3px solid #fff;border-radius:16px;padding:8px 12px 8px 14px;font:800 1.35rem/1 "Bricolage Grotesque","Trebuchet MS",sans-serif;
    letter-spacing:.04em;text-decoration:none;box-shadow:0 6px 18px rgba(224,36,47,.45);transform:rotate(4deg)}
  .nb-corner b{display:grid;place-items:center;min-width:1.5em;height:1.5em;border-radius:999px;background:#fff;color:var(--hot);font-size:.8em}
  .nb-corner:focus-visible{outline:3px solid #1b2340;outline-offset:3px}
  @media (prefers-reduced-motion:no-preference){.nb-corner{animation:nb-pop 1.6s ease-in-out infinite}}
  @keyframes nb-pop{0%,100%{transform:rotate(4deg) scale(1)}50%{transform:rotate(-3deg) scale(1.08)}}
  .nb-toast{position:fixed;left:50%;bottom:max(16px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:60;width:min(560px,calc(100vw - 32px));
    display:flex;align-items:flex-start;gap:12px;background:#fff;color:#1b2340;border:2px solid var(--hot);border-radius:14px;padding:12px 14px;
    font:400 1rem/1.45 "Atkinson Hyperlegible",Verdana,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25)}
  .nb-toast .bell{font-size:1.5rem;line-height:1}
  .nb-toast a{color:var(--hot);font-weight:700}
  .nb-toast .x{margin-left:auto;border:none;background:none;font-size:1.6rem;line-height:1;color:#5b6380;cursor:pointer;padding:0 4px}
  .nb-ribbon{position:absolute;top:-10px;right:-8px;z-index:2;background:var(--hot);color:#fff;border:3px solid #fff;border-radius:12px;padding:6px 10px;
    font:800 1.15rem/1 "Bricolage Grotesque","Trebuchet MS",sans-serif;letter-spacing:.05em;transform:rotate(6deg);box-shadow:0 4px 12px rgba(224,36,47,.4)}
  a.tool{position:relative}`;

  const seenOf = kind => { try { return (JSON.parse(localStorage.getItem("newsroom-" + kind) || "{}").seen) || {}; } catch (e) { return {}; } };
  const recent = d => { const t = Date.parse(d); return t && (Date.now() - t) < NEW_DAYS * 864e5; };
  async function count(f) {
    try {
      const r = await fetch(new URL(f.kind + "/articles.json", base).href + "?v=" + Date.now(), {cache: "no-store"});
      if (!r.ok) return 0;
      const list = await r.json(), seen = seenOf(f.kind);
      return (Array.isArray(list) ? list : []).filter(a => recent(a.date) && !seen[a.id]).length;
    } catch (e) { return 0; }
  }

  Promise.all(FEEDS.map(count)).then(ns => {
    const hits = FEEDS.map((f, i) => Object.assign({n: ns[i]}, f)).filter(f => f.n > 0);
    if (!hits.length) return;
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    const total = hits.reduce((s, f) => s + f.n, 0);

    // Big red NEW in the corner: goes to the page with the most unread articles
    const top = hits.slice().sort((a, b) => b.n - a.n)[0];
    const c = document.createElement("a");
    c.className = "nb-corner"; c.href = top.href;
    c.innerHTML = `NEW <b>${total}</b>`;
    c.setAttribute("aria-label", `${total} ${total > 1 ? "nouveaux articles" : "nouvel article"} à lire`);
    document.body.appendChild(c);

    // Ribbons on the home page cards
    hits.forEach(f => {
      document.querySelectorAll(`a.tool[href="${f.kind}/"]`).forEach(card => {
        const r = document.createElement("span"); r.className = "nb-ribbon"; r.textContent = f.n > 1 ? `NEW ×${f.n}` : "NEW";
        r.setAttribute("aria-label", `${f.n} nouveau${f.n > 1 ? "x" : ""}`); card.appendChild(r);
      });
    });

    // Notification banner, once per visit
    let shown = false;
    try { shown = sessionStorage.getItem("nb-toast") === String(total); } catch (e) {}
    if (!shown) {
      const t = document.createElement("div"); t.className = "nb-toast"; t.setAttribute("role", "status");
      t.innerHTML = `<span class="bell" aria-hidden="true">🔔</span><span><b>Nouveau !</b> ${hits.map(f => `<a href="${f.href}">${f.n} article${f.n > 1 ? "s" : ""} dans ${f.name}</a>`).join(" et ")}.</span><button class="x" type="button" aria-label="Fermer">×</button>`;
      t.querySelector(".x").addEventListener("click", () => t.remove());
      document.body.appendChild(t);
      try { sessionStorage.setItem("nb-toast", String(total)); } catch (e) {}
      setTimeout(() => t.remove(), 12000);
    }
  });
})();
