/* Page illustrations, drawn in SVG (no external images). Usage: <div class="hero-art" data-art="news"></div> */
(function () {
  const C = {navy:"#1b2340", blue:"#2f4fd8", sky:"#8ea2ff", yellow:"#ffd23f", red:"#d4202c", green:"#16804a", grass:"#1f9d57", grey:"#cfd5e6", white:"#ffffff", purple:"#8a3fc7", orange:"#c27a00"};
  const bg = `<circle cx="80" cy="84" r="70" style="fill:var(--accent-soft,#e3e8ff)"/>`;
  const poly = (cx, cy, r, n, rot) => Array.from({length:n}, (_, i) => {
    const a = (rot || -90) * Math.PI / 180 + i * 2 * Math.PI / n;
    return (cx + r * Math.cos(a)).toFixed(1) + "," + (cy + r * Math.sin(a)).toFixed(1);
  }).join(" ");
  let uid = 0;

  const ART = {
    // A newspaper for English News
    news: () => `${bg}
      <rect x="40" y="36" width="86" height="100" rx="6" fill="${C.grey}" transform="rotate(-9 80 84)"/>
      <g transform="rotate(4 80 84)">
        <rect x="30" y="30" width="98" height="106" rx="6" fill="${C.white}" stroke="${C.navy}" stroke-width="3"/>
        <rect x="40" y="40" width="78" height="17" rx="3" fill="${C.navy}"/>
        <text x="79" y="53" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="13" letter-spacing="2" fill="${C.white}">NEWS</text>
        <rect x="40" y="63" width="36" height="29" rx="3" fill="${C.sky}"/>
        <circle cx="67" cy="71" r="5" fill="${C.yellow}"/>
        <path d="M40 92l12-13 8 8 6-5 10 10z" fill="${C.blue}"/>
        <rect x="82" y="64" width="36" height="4" rx="2" fill="${C.navy}"/>
        <rect x="82" y="72" width="36" height="4" rx="2" fill="${C.grey}"/>
        <rect x="82" y="80" width="30" height="4" rx="2" fill="${C.grey}"/>
        <rect x="82" y="88" width="34" height="4" rx="2" fill="${C.grey}"/>
        <rect x="40" y="100" width="78" height="4" rx="2" fill="${C.grey}"/>
        <rect x="40" y="108" width="78" height="4" rx="2" fill="${C.grey}"/>
        <rect x="40" y="116" width="58" height="4" rx="2" fill="${C.grey}"/>
        <rect x="40" y="124" width="68" height="4" rx="2" fill="${C.grey}"/>
      </g>`,

    // A football in front of a goal for Spécial footeux
    foot: () => {
      const id = "ball" + (++uid);
      let net = "";
      for (let x = 40; x < 132; x += 12) net += `<line x1="${x}" y1="54" x2="${x}" y2="110" stroke="${C.white}" stroke-width="1.2" opacity=".7"/>`;
      for (let y = 64; y < 112; y += 11) net += `<line x1="30" y1="${y}" x2="130" y2="${y}" stroke="${C.white}" stroke-width="1.2" opacity=".7"/>`;
      let patches = "";
      for (let i = 0; i < 5; i++) {
        const a = (-90 + 36 + i * 72) * Math.PI / 180;
        const px = 80 + 23 * Math.cos(a), py = 104 + 23 * Math.sin(a);
        patches += `<polygon points="${poly(px, py, 9, 5, -90 + 36 + i * 72 + 180)}" fill="${C.navy}"/>`;
        const vx = 80 + 9 * Math.cos(a), vy = 104 + 9 * Math.sin(a);
        patches += `<line x1="${vx.toFixed(1)}" y1="${vy.toFixed(1)}" x2="${(80 + 17 * Math.cos(a)).toFixed(1)}" y2="${(104 + 17 * Math.sin(a)).toFixed(1)}" stroke="${C.navy}" stroke-width="2"/>`;
      }
      return `${bg}
        <path d="M14 116Q80 104 146 116L146 136Q80 148 14 136z" fill="${C.grass}"/>
        <rect x="30" y="52" width="100" height="60" fill="${C.green}" opacity=".25"/>
        ${net}
        <path d="M30 114V52H130V114" fill="none" stroke="${C.white}" stroke-width="5" stroke-linejoin="round"/>
        <path d="M30 114V52H130V114" fill="none" stroke="${C.navy}" stroke-width="1" opacity=".25"/>
        <clipPath id="${id}"><circle cx="80" cy="104" r="26"/></clipPath>
        <circle cx="80" cy="104" r="26" fill="${C.white}"/>
        <g clip-path="url(#${id})">${patches}<polygon points="${poly(80, 104, 9, 5, -90)}" fill="${C.navy}"/></g>
        <circle cx="80" cy="104" r="26" fill="none" stroke="${C.navy}" stroke-width="3"/>
        <path d="M112 128h22M118 136h14" stroke="${C.white}" stroke-width="3" stroke-linecap="round"/>`;
    },

    // An alarm clock (late!) with a "Sorry!" bubble for Excuse Lab
    excuse: () => {
      let ticks = "";
      for (let i = 0; i < 12; i++) {
        const a = i * 30 * Math.PI / 180, r1 = i % 3 ? 25 : 22;
        ticks += `<line x1="${(78 + r1 * Math.sin(a)).toFixed(1)}" y1="${(92 - r1 * Math.cos(a)).toFixed(1)}" x2="${(78 + 28 * Math.sin(a)).toFixed(1)}" y2="${(92 - 28 * Math.cos(a)).toFixed(1)}" stroke="${C.navy}" stroke-width="${i % 3 ? 1.5 : 3}" stroke-linecap="round"/>`;
      }
      return `${bg}
        <path d="M50 128l-8 10M106 128l8 10" stroke="${C.navy}" stroke-width="5" stroke-linecap="round"/>
        <path d="M44 58a14 14 0 0 1 20-12z" fill="${C.yellow}" stroke="${C.navy}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M112 58a14 14 0 0 0-20-12z" fill="${C.yellow}" stroke="${C.navy}" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="78" cy="92" r="40" fill="${C.red}" stroke="${C.navy}" stroke-width="3"/>
        <circle cx="78" cy="92" r="31" fill="${C.white}"/>
        ${ticks}
        <line x1="78" y1="92" x2="62" y2="101" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>
        <line x1="78" y1="92" x2="88" y2="70" stroke="${C.navy}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="78" cy="92" r="3.5" fill="${C.red}"/>
        <path d="M24 82q-6 10 0 20M16 76q-9 16 0 32" fill="none" stroke="${C.navy}" stroke-width="3" stroke-linecap="round"/>
        <rect x="100" y="16" width="52" height="26" rx="9" fill="${C.white}" stroke="${C.navy}" stroke-width="2.5"/>
        <path d="M112 41l-6 10 14-9" fill="${C.white}" stroke="${C.navy}" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="108" y="39" width="12" height="4" fill="${C.white}"/>
        <text x="126" y="34" text-anchor="middle" font-family="'Bricolage Grotesque','Trebuchet MS',sans-serif" font-weight="800" font-size="13" fill="${C.navy}">Sorry!</text>`;
    },

    // A lab flask with -ed bubbles for Les sons de -ed
    ed: () => `${bg}
      <circle cx="58" cy="38" r="12" fill="${C.blue}"/><text x="58" y="42" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="${C.white}">/t/</text>
      <circle cx="102" cy="26" r="12" fill="${C.purple}"/><text x="102" y="30" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="${C.white}">/d/</text>
      <circle cx="120" cy="56" r="13" fill="${C.orange}"/><text x="120" y="60" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="${C.white}">/ɪd/</text>
      <circle cx="84" cy="46" r="4" fill="${C.sky}"/><circle cx="76" cy="56" r="3" fill="${C.sky}"/>
      <path d="M66 58h28M70 58v22L40 128a8 8 0 0 0 7 12h66a8 8 0 0 0 7-12L90 80V58" fill="${C.white}" stroke="${C.navy}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M55 104h50l15 24a5 5 0 0 1-4 8H44a5 5 0 0 1-4-8z" fill="${C.yellow}"/>
      <path d="M70 58v22L40 128a8 8 0 0 0 7 12h66a8 8 0 0 0 7-12L90 80V58" fill="none" stroke="${C.navy}" stroke-width="3.5" stroke-linejoin="round"/>
      <circle cx="68" cy="118" r="4" fill="${C.white}" opacity=".8"/><circle cx="92" cy="126" r="3" fill="${C.white}" opacity=".8"/>
      <text x="80" y="128" text-anchor="middle" font-family="'Bricolage Grotesque','Trebuchet MS',sans-serif" font-weight="800" font-size="17" fill="${C.navy}">-ed</text>
      <path d="M78 96h10" stroke="${C.navy}" stroke-width="2" stroke-linecap="round"/><path d="M80 88h8" stroke="${C.navy}" stroke-width="2" stroke-linecap="round"/>`,

    // A microphone and syllable bars (one stressed) for Stress Lab
    stress: () => `${bg}
      <rect x="34" y="28" width="34" height="56" rx="17" fill="${C.navy}"/>
      <path d="M40 46h22M40 56h22M40 66h22" stroke="${C.sky}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M26 72a25 25 0 0 0 50 0" fill="none" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>
      <path d="M51 98v22M38 122h26" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>
      <rect x="90" y="92" width="14" height="30" rx="4" fill="${C.sky}"/>
      <rect x="108" y="52" width="16" height="70" rx="4" fill="${C.yellow}" stroke="${C.navy}" stroke-width="2.5"/>
      <rect x="128" y="98" width="14" height="24" rx="4" fill="${C.sky}"/>
      <path d="M116 30v12" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>
      <text x="116" y="140" text-anchor="middle" font-family="'Bricolage Grotesque','Trebuchet MS',sans-serif" font-weight="800" font-size="11" fill="${C.navy}">da-DA-da</text>`,

    // A red London double-decker for Blame the bus!
    bus: () => `${bg}
      <g transform="translate(20 42)">
        <rect x="6" y="6" width="108" height="64" rx="10" fill="${C.red}" stroke="${C.navy}" stroke-width="2.5"/>
        <rect x="6" y="38" width="108" height="5" fill="#a5131d"/>
        <g fill="#cfe3f5"><rect x="14" y="13" width="20" height="17" rx="3"/><rect x="38" y="13" width="20" height="17" rx="3"/><rect x="62" y="13" width="20" height="17" rx="3"/><rect x="86" y="13" width="20" height="17" rx="3"/>
        <rect x="14" y="47" width="20" height="15" rx="3"/><rect x="38" y="47" width="20" height="15" rx="3"/><rect x="62" y="47" width="20" height="15" rx="3"/></g>
        <rect x="88" y="46" width="18" height="24" rx="2" fill="#2b2f3a"/>
        <circle cx="30" cy="72" r="9" fill="#2b2f3a"/><circle cx="30" cy="72" r="3.5" fill="#9aa1bd"/>
        <circle cx="92" cy="72" r="9" fill="#2b2f3a"/><circle cx="92" cy="72" r="3.5" fill="#9aa1bd"/>
      </g>
      <circle cx="132" cy="34" r="16" fill="${C.white}" stroke="${C.navy}" stroke-width="2.5"/>
      <path d="M132 34v-9M132 34l6 4" stroke="${C.navy}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M8 128h22M4 120h14" stroke="${C.navy}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`,

    // Speech bubbles for the home page
    home: () => `${bg}
      <path d="M22 40a14 14 0 0 1 14-14h70a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14H58l-18 16 4-16h-8a14 14 0 0 1-14-14z" fill="${C.blue}"/>
      <text x="71" y="66" text-anchor="middle" font-family="'Bricolage Grotesque','Trebuchet MS',sans-serif" font-weight="800" font-size="24" fill="${C.white}">Hello!</text>
      <path d="M80 98a12 12 0 0 1 12-12h44a12 12 0 0 1 12 12v20a12 12 0 0 1-12 12h-4l3 13-15-13H92a12 12 0 0 1-12-12z" fill="${C.yellow}" stroke="${C.navy}" stroke-width="2.5"/>
      <text x="114" y="115" text-anchor="middle" font-family="'Bricolage Grotesque','Trebuchet MS',sans-serif" font-weight="800" font-size="18" fill="${C.navy}">Hi!</text>
      <path d="M30 110l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="${C.yellow}"/>
      <path d="M140 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="${C.red}"/>`
  };

  function draw(el) {
    const f = ART[el.dataset.art]; if (!f) return;
    el.innerHTML = `<svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">${f()}</svg>`;
  }
  window.SiteArt = {draw, names: Object.keys(ART)};
  document.querySelectorAll("[data-art]").forEach(draw);
})();
