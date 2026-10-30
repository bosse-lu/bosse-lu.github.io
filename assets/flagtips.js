/* Country name on hover, focus or tap for every flag on the page (bunting and flag grid).
   English name in big, French name underneath. */
(function () {
  const FR = {"United Kingdom":"Royaume-Uni", "USA":"États-Unis", "Ireland":"Irlande", "Australia":"Australie", "Guyana":"Guyana",
    "England":"Angleterre", "Jamaica":"Jamaïque", "New Zealand":"Nouvelle-Zélande", "Scotland":"Écosse", "Canada":"Canada"};
  const st = document.createElement("style");
  st.textContent = `
  .ft-tip{position:fixed;z-index:70;pointer-events:none;transform:translate(-50%,0);background:#1b2340;color:#fff;border-radius:10px;padding:7px 12px 6px;
    text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.3);font:400 .8rem/1.3 "Atkinson Hyperlegible",Verdana,sans-serif;white-space:nowrap;opacity:0;transition:opacity .12s}
  .ft-tip b{display:block;font:800 1.05rem/1.2 "Bricolage Grotesque","Trebuchet MS",sans-serif}
  .ft-tip::before{content:"";position:absolute;left:50%;top:-6px;margin-left:-6px;border:6px solid transparent;border-top:0;border-bottom-color:#1b2340}
  .ft-tip.show{opacity:1}
  .ft-flag{cursor:help}
  .ft-flag:focus-visible{outline:3px solid #2f4fd8;outline-offset:2px;border-radius:4px}
  .pennant.ft-flag:hover,.pennant.ft-flag:focus{animation-play-state:paused}
  .pennant.ft-flag:hover .flag{transform:scale(1.15);transition:transform .12s}
  @media (prefers-reduced-motion:reduce){.ft-tip{transition:none}.pennant.ft-flag:hover .flag{transform:none}}`;
  document.head.appendChild(st);
  const tip = document.createElement("div"); tip.className = "ft-tip"; tip.setAttribute("role", "tooltip"); tip.id = "ft-tip";
  document.body.appendChild(tip);
  let current = null;

  function show(el) {
    const name = el.dataset.country; if (!name) return;
    current = el;
    tip.innerHTML = `<b lang="en">${name}</b>${FR[name] && FR[name] !== name ? FR[name] : ""}`;
    const r = el.getBoundingClientRect();
    tip.style.left = Math.min(window.innerWidth - 70, Math.max(70, r.left + r.width / 2)) + "px";
    tip.style.top = (r.bottom + 10) + "px";
    tip.classList.add("show");
    el.setAttribute("aria-describedby", "ft-tip");
  }
  function hide() { tip.classList.remove("show"); if (current) current.removeAttribute("aria-describedby"); current = null; }

  function setup() {
    document.querySelectorAll(".pennant, .flaggrid .fl").forEach(el => {
      if (el.classList.contains("ft-flag")) return;
      const svg = el.querySelector("svg[aria-label]"); if (!svg) return;
      el.dataset.country = svg.getAttribute("aria-label");
      el.classList.add("ft-flag"); el.tabIndex = 0;
      const t = svg.querySelector("title"); if (t) t.remove(); // avoid the browser's own slow tooltip on top of ours
      // Mouse: show on hover. Touch: show on tap (the hover events a tap fakes are ignored).
      el.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") show(el); });
      el.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") hide(); });
      el.addEventListener("focus", () => show(el));
      el.addEventListener("blur", hide);
      el.addEventListener("click", e => { e.stopPropagation(); show(el); });
    });
  }
  setup();
  document.addEventListener("click", hide);
  window.addEventListener("scroll", hide, {passive: true});
  window.addEventListener("resize", hide);
})();
