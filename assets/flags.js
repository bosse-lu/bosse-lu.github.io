/* Flags of English-speaking countries, drawn in SVG (no external files) */
(function () {
  let uid = 0;
  const star = (cx, cy, r, n, inner, fill, stroke) => {
    let pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / n, rr = i % 2 ? r * inner : r;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return `<polygon points="${pts.join(" ")}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${(r * 0.18).toFixed(1)}"` : ""}/>`;
  };
  // Union Jack in a w x h box (60x30 base)
  const uj = (w, h) => {
    const id = "uj" + (++uid);
    return `<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 0 60 30" preserveAspectRatio="none">
      <clipPath id="${id}s"><path d="M0,0v30h60V0z"/></clipPath>
      <clipPath id="${id}t"><path d="M30,15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
      <g clip-path="url(#${id}s)">
        <path d="M0,0v30h60V0z" fill="#012169"/>
        <path d="M0,0L60,30M60,0L0,30" stroke="#fff" stroke-width="6"/>
        <path d="M0,0L60,30M60,0L0,30" clip-path="url(#${id}t)" stroke="#C8102E" stroke-width="4"/>
        <path d="M30,0v30M0,15h60" stroke="#fff" stroke-width="10"/>
        <path d="M30,0v30M0,15h60" stroke="#C8102E" stroke-width="6"/>
      </g></svg>`;
  };
  const F = {
    uk: { name: "United Kingdom", vb: "0 0 60 30", svg: () => uj(60, 30) },
    england: { name: "England", vb: "0 0 50 30", svg: () => `<rect width="50" height="30" fill="#fff"/><rect x="21" width="8" height="30" fill="#CE1124"/><rect y="11" width="50" height="8" fill="#CE1124"/>` },
    scotland: { name: "Scotland", vb: "0 0 50 30", svg: () => `<rect width="50" height="30" fill="#0065BD"/><path d="M0,0L50,30M50,0L0,30" stroke="#fff" stroke-width="6"/>` },
    ireland: { name: "Ireland", vb: "0 0 60 30", svg: () => `<rect width="20" height="30" fill="#169B62"/><rect x="20" width="20" height="30" fill="#fff"/><rect x="40" width="20" height="30" fill="#FF883E"/>` },
    usa: { name: "USA", vb: "0 0 7410 3900", svg: () => {
      let s = `<rect width="7410" height="3900" fill="#B22234"/>`;
      for (let i = 1; i < 13; i += 2) s += `<rect y="${i * 300}" width="7410" height="300" fill="#fff"/>`;
      s += `<rect width="2964" height="2100" fill="#3C3B6E"/>`;
      for (let r = 0; r < 9; r++) { const n = r % 2 ? 5 : 6; for (let c = 0; c < n; c++) {
        const x = 247 + c * 494 + (r % 2 ? 247 : 0), y = 210 + r * 210; s += star(x, y, 120, 5, 0.38, "#fff"); } }
      return s; } },
    australia: { name: "Australia", vb: "0 0 1000 500", svg: () => `<rect width="1000" height="500" fill="#012169"/>${uj(500, 250)}`
      + star(250, 375, 75, 7, 0.45, "#fff") + star(750, 425, 37, 7, 0.45, "#fff") + star(625, 210, 37, 7, 0.45, "#fff")
      + star(750, 80, 37, 7, 0.45, "#fff") + star(865, 180, 37, 7, 0.45, "#fff") + star(805, 290, 20, 5, 0.45, "#fff") },
    newzealand: { name: "New Zealand", vb: "0 0 1000 500", svg: () => `<rect width="1000" height="500" fill="#012169"/>${uj(500, 250)}`
      + star(750, 405, 40, 5, 0.4, "#C8102E", "#fff") + star(650, 210, 34, 5, 0.4, "#C8102E", "#fff")
      + star(750, 90, 34, 5, 0.4, "#C8102E", "#fff") + star(850, 190, 30, 5, 0.4, "#C8102E", "#fff") },
    jamaica: { name: "Jamaica", vb: "0 0 60 30", svg: () => `<rect width="60" height="30" fill="#009B3A"/><path d="M0,0L30,15L0,30zM60,0L30,15L60,30z" fill="#000"/><path d="M0,0L60,30M60,0L0,30" stroke="#FED100" stroke-width="4"/>` },
    canada: { name: "Canada", vb: "0 0 1000 500", svg: () => `<rect width="1000" height="500" fill="#fff"/><rect width="250" height="500" fill="#D52B1E"/><rect x="750" width="250" height="500" fill="#D52B1E"/><path d="M500 80l-32 62c-4 7-11 6-18 3l-24-12 18 92c4 17-8 17-14 10l-40-45-7 24c-1 4-5 6-9 5l-50-11 13 48c3 9 6 13-1 16l-18 8 86 70c7 5 10 15 8 22l-8 25c30-4 57-8 86-11 3 0 7 4 7 7l-4 90h16l-3-90c0-3 4-7 7-7 29 3 56 7 86 11l-8-25c-2-7 1-17 8-22l86-70-18-8c-7-3-4-7-1-16l13-48-50 11c-4 1-8-1-9-5l-7-24-40 45c-6 7-18 7-14-10l18-92-24 12c-7 3-14 4-18-3z" fill="#D52B1E"/>` },
    guyana: { name: "Guyana", vb: "0 0 500 300", svg: () => `<rect width="500" height="300" fill="#009E49"/><path d="M0,0L500,150L0,300z" fill="#fff"/><path d="M0,12L470,150L0,288z" fill="#FCD116"/><path d="M0,0L250,150L0,300z" fill="#000"/><path d="M0,14L227,150L0,286z" fill="#CE1126"/>` },
  };
  function flag(code, cls) {
    const f = F[code];
    return `<svg class="${cls || "flag"}" viewBox="${f.vb}" role="img" aria-label="${f.name}" preserveAspectRatio="none"><title>${f.name}</title>${f.svg()}</svg>`;
  }
  const ORDER = ["uk", "usa", "ireland", "australia", "guyana", "england", "jamaica", "newzealand", "scotland"];
  window.EnglishFlags = { flag, ORDER, names: Object.fromEntries(Object.entries(F).map(([k, v]) => [k, v.name])) };
  // Bunting: <div data-bunting></div>
  document.querySelectorAll("[data-bunting]").forEach((el) => {
    el.classList.add("bunting");
    el.innerHTML = ORDER.concat(ORDER.slice(0, +el.dataset.bunting || 0)).map((c, i) =>
      `<span class="pennant" style="--r:${(i % 2 ? 4 : -4)}deg">${flag(c)}</span>`).join("");
  });
  // Flag grid: <div data-flaggrid></div>
  document.querySelectorAll("[data-flaggrid]").forEach((el) => {
    el.innerHTML = ORDER.map((c) => `<figure class="fl">${flag(c)}<figcaption>${F[c].name}${c === "guyana" ? " <em>· notre voisin</em>" : ""}</figcaption></figure>`).join("");
  });
})();
