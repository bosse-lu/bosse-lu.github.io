/* Instructions in English, with French help depending on the learner's level:
   ★ (class code, no group, or no code): the French line is shown under the English one;
   ★★: a small "FR" button reveals it; ★★★: English only.
   Markup: any element with data-fr="…" (its own text is the English instruction).
   In scripts: Consigne.t("English", "Français") returns that markup as a string.
   A page that lets the teacher preview a level sets window.pageStars = () => 1 | 2 | 3,
   and dispatches "level:change" on document when it changes. */
(function () {
  if (window.Consigne) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const st = document.createElement("style");
  st.textContent = `
  .cg-fr{display:block;font-size:.86em;font-style:italic;font-weight:400;color:var(--muted,#5b6380);margin-top:2px}
  .cg-fr::before{content:"🇫🇷 ";font-style:normal}
  .cg-fr-btn{font:700 .7rem/1 "Atkinson Hyperlegible",Verdana,sans-serif;letter-spacing:.04em;margin-left:6px;padding:3px 6px;border-radius:6px;border:1px solid var(--line,#d9ddea);background:var(--card,#fff);color:var(--muted,#5b6380);cursor:pointer;vertical-align:middle}
  .cg-fr-btn[aria-expanded="true"]{background:var(--ink,#1b2340);color:var(--paper,#fff);border-color:var(--ink,#1b2340)}
  .cg-fr-btn:focus-visible{outline:3px solid var(--accent,#2f4fd8);outline-offset:2px}
  html[data-cg="3"] .fr-help{display:none!important}`;
  document.head.appendChild(st);

  function level() {
    try { if (typeof window.pageStars === "function") { const v = window.pageStars(); if (v) return v; } } catch (e) {}
    const C = window.Classes;
    const v = C && C.stars ? C.stars() : 1;
    return v === null || !v ? 1 : v;
  }
  function render(el, lv) {
    if (el.dataset.cgLv === String(lv)) return;
    el.querySelectorAll(":scope > .cg-fr, :scope > .cg-fr-btn").forEach(x => x.remove());
    el.dataset.cgLv = String(lv);
    const fr = el.getAttribute("data-fr"); if (!fr || lv >= 3) return;
    const span = document.createElement("span"); span.className = "cg-fr"; span.lang = "fr"; span.textContent = fr;
    if (lv === 2) {
      const b = document.createElement("button"); b.type = "button"; b.className = "cg-fr-btn"; b.textContent = "FR";
      b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Voir la consigne en français");
      span.hidden = true;
      b.addEventListener("click", e => { e.preventDefault(); e.stopPropagation(); span.hidden = !span.hidden; b.setAttribute("aria-expanded", String(!span.hidden)); });
      el.append(b, span);
    } else el.appendChild(span);
  }
  function apply(root) {
    const lv = level();
    document.documentElement.setAttribute("data-cg", String(lv));
    (root && root.querySelectorAll ? [root, ...root.querySelectorAll("[data-fr]")] : [...document.querySelectorAll("[data-fr]")])
      .forEach(el => { if (el.hasAttribute && el.hasAttribute("data-fr")) render(el, lv); });
  }
  function refresh() { document.querySelectorAll("[data-fr]").forEach(el => { delete el.dataset.cgLv; }); apply(document); }
  const t = (en, fr, tag) => `<${tag || "span"} data-fr="${esc(fr)}" lang="en">${en}</${tag || "span"}>`;
  // New content (rendered by the page scripts) gets its French help too
  const mo = new MutationObserver(list => {
    const lv = level();
    document.documentElement.setAttribute("data-cg", String(lv));
    list.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType !== 1) return;
      if (n.hasAttribute("data-fr")) render(n, lv);
      n.querySelectorAll && n.querySelectorAll("[data-fr]").forEach(el => render(el, lv));
    }));
  });
  const start = () => { apply(document); mo.observe(document.body, {childList: true, subtree: true}); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", start) : start();
  ["classes:ready", "classes:change", "level:change"].forEach(ev => document.addEventListener(ev, refresh));
  window.Consigne = {t, apply, refresh, level};
})();
