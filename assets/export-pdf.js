/* export-pdf.js · bosse-lu.github.io
   Lets a learner download their work (or a text to annotate) as a real PDF file, to hand in on Pronote.
   No library and no server: a tiny PDF writer with the standard Helvetica fonts (text stays selectable).
   API: ExportPDF.open({title, file, intro, build(doc, who)})  — opens the name / class dialog, then downloads.
        doc.h(text, size) · doc.p(runs | text, opts) · doc.lines(n) · doc.space(pt) · doc.rule()
        runs = [[text, "R"|"B"|"I"|"BI"], …]; opts = {size, lead, indent, gray, numbered, gap}          */
(function () {
  const MAP = {"32":[32,278,278],"33":[33,278,333],"34":[34,355,474],"35":[35,556,556],"36":[36,556,556],"37":[37,889,889],"38":[38,667,722],"39":[39,191,238],"40":[40,333,333],"41":[41,333,333],"42":[42,389,389],"43":[43,584,584],"44":[44,278,278],"45":[45,333,333],"46":[46,278,278],"47":[47,278,278],"48":[48,556,556],"49":[49,556,556],"50":[50,556,556],"51":[51,556,556],"52":[52,556,556],"53":[53,556,556],"54":[54,556,556],"55":[55,556,556],"56":[56,556,556],"57":[57,556,556],"58":[58,278,333],"59":[59,278,333],"60":[60,584,584],"61":[61,584,584],"62":[62,584,584],"63":[63,556,611],"64":[64,1015,975],"65":[65,667,722],"66":[66,667,722],"67":[67,722,722],"68":[68,722,722],"69":[69,667,667],"70":[70,611,611],"71":[71,778,778],"72":[72,722,722],"73":[73,278,278],"74":[74,500,556],"75":[75,667,722],"76":[76,556,611],"77":[77,833,833],"78":[78,722,722],"79":[79,778,778],"80":[80,667,667],"81":[81,778,778],"82":[82,722,722],"83":[83,667,667],"84":[84,611,611],"85":[85,722,722],"86":[86,667,667],"87":[87,944,944],"88":[88,667,667],"89":[89,667,667],"90":[90,611,611],"91":[91,278,333],"92":[92,278,278],"93":[93,278,333],"94":[94,469,584],"95":[95,556,556],"96":[96,333,333],"97":[97,556,556],"98":[98,556,611],"99":[99,500,556],"100":[100,556,611],"101":[101,556,556],"102":[102,278,333],"103":[103,556,611],"104":[104,556,611],"105":[105,222,278],"106":[106,222,278],"107":[107,500,556],"108":[108,222,278],"109":[109,833,889],"110":[110,556,611],"111":[111,556,611],"112":[112,556,611],"113":[113,556,611],"114":[114,333,389],"115":[115,500,556],"116":[116,278,333],"117":[117,556,611],"118":[118,500,556],"119":[119,722,778],"120":[120,500,556],"121":[121,500,556],"122":[122,500,500],"123":[123,334,389],"124":[124,260,280],"125":[125,334,389],"126":[126,584,584],"127":[127,350,350],"8364":[128,556,556],"8218":[130,222,278],"402":[131,556,556],"8222":[132,333,500],"8230":[133,1000,1000],"8224":[134,556,556],"8225":[135,556,556],"710":[136,333,333],"8240":[137,1000,1000],"352":[138,667,667],"8249":[139,333,333],"338":[140,1000,1000],"381":[142,611,611],"8216":[145,222,278],"8217":[146,222,278],"8220":[147,333,500],"8221":[148,333,500],"8226":[149,350,350],"8211":[150,556,556],"8212":[151,1000,1000],"732":[152,333,333],"8482":[153,1000,1000],"353":[154,500,556],"8250":[155,333,333],"339":[156,944,944],"382":[158,500,500],"376":[159,667,667],"160":[160,278,278],"161":[161,333,333],"162":[162,556,556],"163":[163,556,556],"164":[164,556,556],"165":[165,556,556],"166":[166,260,280],"167":[167,556,556],"168":[168,333,333],"169":[169,737,737],"170":[170,370,370],"171":[171,556,556],"172":[172,584,584],"173":[173,333,333],"174":[174,737,737],"175":[175,333,333],"176":[176,400,400],"177":[177,584,584],"178":[178,333,333],"179":[179,333,333],"180":[180,333,333],"181":[181,556,611],"182":[182,537,556],"183":[183,278,278],"184":[184,333,333],"185":[185,333,333],"186":[186,365,365],"187":[187,556,556],"188":[188,834,834],"189":[189,834,834],"190":[190,834,834],"191":[191,611,611],"192":[192,667,722],"193":[193,667,722],"194":[194,667,722],"195":[195,667,722],"196":[196,667,722],"197":[197,667,722],"198":[198,1000,1000],"199":[199,722,722],"200":[200,667,667],"201":[201,667,667],"202":[202,667,667],"203":[203,667,667],"204":[204,278,278],"205":[205,278,278],"206":[206,278,278],"207":[207,278,278],"208":[208,722,722],"209":[209,722,722],"210":[210,778,778],"211":[211,778,778],"212":[212,778,778],"213":[213,778,778],"214":[214,778,778],"215":[215,584,584],"216":[216,778,778],"217":[217,722,722],"218":[218,722,722],"219":[219,722,722],"220":[220,722,722],"221":[221,667,667],"222":[222,667,667],"223":[223,611,611],"224":[224,556,556],"225":[225,556,556],"226":[226,556,556],"227":[227,556,556],"228":[228,556,556],"229":[229,556,556],"230":[230,889,889],"231":[231,500,556],"232":[232,556,556],"233":[233,556,556],"234":[234,556,556],"235":[235,556,556],"236":[236,278,278],"237":[237,278,278],"238":[238,278,278],"239":[239,278,278],"240":[240,556,611],"241":[241,556,611],"242":[242,556,611],"243":[243,556,611],"244":[244,556,611],"245":[245,556,611],"246":[246,556,611],"247":[247,584,584],"248":[248,611,611],"249":[249,556,611],"250":[250,556,611],"251":[251,556,611],"252":[252,556,611],"253":[253,500,556],"254":[254,556,611],"255":[255,500,556]}; // unicode -> [WinAnsi byte, width Helvetica, width Helvetica-Bold]
  const SUB = {"★": "*", "☆": "*", "ɪ": "I", "ə": "e", "ʃ": "sh", "ʒ": "zh", "θ": "th", "ð": "th", "ŋ": "ng", "æ": "a", "ɒ": "o", "ʌ": "u", "ɔ": "o", "ɜ": "e", "ʊ": "u", "ː": ":", "ˈ": "'", "ˌ": "",
    "→": "->", "←": "<-", "↗": "(up)", "↘": "(down)", "✓": "v", "✔": "v", "✗": "x", "✘": "x", " ": " ", " ": " ", " ": " ", " ": " ", " ": " ", "‐": "-", "‑": "-", "−": "-", "≠": "=/=", "×": "x"};
  function clean(s) {
    let out = "";
    for (const ch of String(s).normalize("NFC")) {
      if (MAP[ch.codePointAt(0)]) { out += ch; continue; }
      if (SUB[ch] != null) { out += SUB[ch]; continue; }
      const base = ch.normalize("NFD").replace(/[̀-ͯ]/g, "");
      if (base && base !== ch && [...base].every(c => MAP[c.codePointAt(0)])) out += base;
      // anything else (emoji, symbols) is dropped
    }
    return out;
  }
  const width = (s, bold, size) => { let w = 0; for (const ch of s) { const m = MAP[ch.codePointAt(0)]; w += m ? m[bold ? 2 : 1] : 500; } return w * size / 1000; };
  const enc = s => { let o = ""; for (const ch of s) { const b = MAP[ch.codePointAt(0)][0]; o += b === 40 || b === 41 || b === 92 ? "\\" + String.fromCharCode(b) : b < 128 ? String.fromCharCode(b) : "\\" + b.toString(8).padStart(3, "0"); } return o; };
  const FONT = {R: "F1", B: "F2", I: "F3", BI: "F4"};

  function Doc(o) {
    o = o || {};
    this.W = 595.28; this.H = 841.89;
    this.ml = o.annotate ? 62 : 56; this.mr = o.annotate ? 170 : 56; this.mt = 64; this.mb = 58;
    this.annotate = !!o.annotate; this.head = clean(o.head || ""); this.pages = []; this.n = 0; this.newPage();
  }
  Doc.prototype.newPage = function () {
    this.ops = []; this.pages.push(this.ops); this.y = this.H - this.mt;
    if (this.annotate) { // a margin for notes on every page
      const x = this.W - this.mr + 14;
      this.ops.push(`0.85 G 0.6 w ${x.toFixed(2)} ${this.mb} m ${x.toFixed(2)} ${(this.H - this.mt + 8).toFixed(2)} l S 0 G`);
      this.txt(this.W - this.mr + 22, this.H - this.mt + 2, "Notes", "I", 8, 0.55);
    }
  };
  Doc.prototype.txt = function (x, y, s, st, size, gray) {
    s = clean(s); if (!s) return;
    this.ops.push(`BT ${gray != null ? gray + " g " : ""}/${FONT[st || "R"]} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${enc(s)}) Tj ${gray != null ? "0 g " : ""}ET`);
  };
  Doc.prototype.need = function (h) { if (this.y - h < this.mb) this.newPage(); };
  Doc.prototype.space = function (h) { this.y -= h; if (this.y < this.mb) this.newPage(); };
  Doc.prototype.p = function (runs, o) {
    o = o || {}; const size = o.size || 11, lead = size * (o.lead || 1.42), x0 = this.ml + (o.indent || 0), maxW = this.W - this.mr - x0;
    if (typeof runs === "string") runs = [[runs, "R"]];
    // words carrying their style; wrap on spaces, keep runs together inside a word
    const words = []; let cur = [];
    runs.forEach(([t, st]) => { const parts = clean(t).split(/( +)/); parts.forEach(pt => { if (/^ +$/.test(pt)) { if (cur.length) words.push(cur); cur = []; } else if (pt) cur.push([pt, st || "R"]); }); });
    if (cur.length) words.push(cur);
    const ww = w => w.reduce((a, [t, st]) => a + width(t, st[0] === "B", size), 0), sp = width(" ", false, size);
    const lines = []; let line = [], lw = 0;
    words.forEach(w => { const wl = ww(w); if (line.length && lw + sp + wl > maxW) { lines.push(line); line = []; lw = 0; } lw += (line.length ? sp : 0) + wl; line.push(w); });
    if (line.length) lines.push(line);
    if (!lines.length) lines.push([]);
    lines.forEach(l => {
      this.need(lead); this.y -= lead;
      let x = x0;
      l.forEach((w, i) => { if (i) x += sp; w.forEach(([t, st]) => { this.txt(x, this.y, t, st, size, o.gray ? 0.35 : null); x += width(t, st[0] === "B", size); }); });
      if (o.numbered) { this.n++; if (this.n % 5 === 0 || this.n === 1) this.txt(this.ml - 30, this.y, String(this.n), "R", 8, 0.55); }
    });
    this.y -= (o.gap != null ? o.gap : 5);
  };
  Doc.prototype.h = function (t, size) { size = size || 14; this.need(size * 2.6); this.space(size * 0.5); this.p([[t, "B"]], {size, lead: 1.25, gap: 4}); };
  Doc.prototype.lines = function (k, gap) {
    gap = gap || 24;
    for (let i = 0; i < k; i++) { this.need(gap); this.y -= gap; this.ops.push(`0.75 G 0.5 w ${this.ml.toFixed(2)} ${this.y.toFixed(2)} m ${(this.W - this.mr).toFixed(2)} ${this.y.toFixed(2)} l S 0 G`); }
    this.y -= 6;
  };
  Doc.prototype.rule = function () { this.need(14); this.y -= 7; this.ops.push(`0.8 G 0.6 w ${this.ml} ${this.y.toFixed(2)} m ${(this.W - this.mr).toFixed(2)} ${this.y.toFixed(2)} l S 0 G`); this.y -= 7; };
  Doc.prototype.bytes = function () {
    const N = this.pages.length;
    this.pages.forEach((ops, i) => {
      if (this.head) ops.push(`BT 0.35 g /F3 9 Tf ${this.ml} ${(this.H - 36).toFixed(2)} Td (${enc(this.head)}) Tj 0 g ET`);
      const f = clean(`bosse-lu.github.io · ${i + 1} / ${N}`);
      ops.push(`BT 0.5 g /F1 8 Tf ${(this.W / 2 - width(f, false, 8) / 2).toFixed(2)} 30 Td (${enc(f)}) Tj 0 g ET`);
    });
    const objs = []; const add = s => { objs.push(s); return objs.length; };
    const cat = add(null), pagesId = add(null);
    const fonts = ["Helvetica", "Helvetica-Bold", "Helvetica-Oblique", "Helvetica-BoldOblique"].map(b => add(`<< /Type /Font /Subtype /Type1 /BaseFont /${b} /Encoding /WinAnsiEncoding >>`));
    const res = `<< /Font << /F1 ${fonts[0]} 0 R /F2 ${fonts[1]} 0 R /F3 ${fonts[2]} 0 R /F4 ${fonts[3]} 0 R >> >>`;
    const kids = this.pages.map(ops => { const s = ops.join("\n"); const c = add(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`); return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources ${res} /Contents ${c} 0 R >>`); });
    objs[cat - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
    objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids.map(k => k + " 0 R").join(" ")}] /Count ${kids.length} >>`;
    let out = "%PDF-1.4\n", offs = [];
    objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = out.length;
    out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map(o => String(o).padStart(10, "0") + " 00000 n \n").join("");
    out += `trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R >>\nstartxref\n${x}\n%%EOF`;
    const u = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) u[i] = out.charCodeAt(i) & 255; return u;
  };

  /* ---------- the dialog: name and class, then download ---------- */
  const LS = "export-pdf-who";
  const safe = s => clean(s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  function css() {
    if (document.getElementById("xp-css")) return;
    const st = document.createElement("style"); st.id = "xp-css";
    st.textContent = `.xp-btn{display:inline-flex;align-items:center;gap:8px;font:inherit;font-weight:700;border:2px solid var(--accent,#2f4fd8);color:var(--accent,#2f4fd8);background:var(--card,#fff);border-radius:12px;padding:9px 15px;cursor:pointer;text-decoration:none}
.xp-btn:hover{background:var(--accent-soft,#e3e8ff)}
.xp-back{position:fixed;inset:0;background:rgba(10,14,30,.55);display:grid;place-items:center;z-index:9999;padding:16px}
.xp-dlg{background:var(--card,#fff);color:var(--ink,#1b2340);border-radius:18px;max-width:420px;width:100%;padding:20px;display:flex;flex-direction:column;gap:10px;box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:inherit}
.xp-dlg h2{margin:0;font-size:1.25rem}
.xp-dlg p{margin:0;font-size:.93rem;color:var(--muted,#5b6380)}
.xp-dlg label{display:flex;flex-direction:column;gap:3px;font-weight:700;font-size:.92rem}
.xp-dlg input{font:inherit;font-weight:400;padding:9px 11px;border:1px solid var(--line,#d9ddea);border-radius:10px;background:var(--paper,#f3f5fb);color:inherit}
.xp-row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:4px}
.xp-row button{font:inherit;font-weight:700;border-radius:11px;padding:9px 15px;cursor:pointer;border:1px solid var(--line,#d9ddea);background:var(--card,#fff);color:inherit}
.xp-row .go{background:var(--accent,#2f4fd8);border-color:var(--accent,#2f4fd8);color:var(--card,#fff)}
.xp-ok{font-weight:700;color:var(--good,#1f8a55) !important}`;
    document.head.appendChild(st);
  }
  function open(o) {
    css();
    let who = {name: "", cls: ""}; try { who = Object.assign(who, JSON.parse(localStorage.getItem(LS) || "{}")); } catch (e) {}
    if (!who.cls && window.Classes && Classes.isReady && Classes.isReady()) { const k = Classes.klass(); if (k && !k.admin && !k.visit && k.label) who.cls = k.label; }
    const back = document.createElement("div"); back.className = "xp-back";
    back.innerHTML = `<div class="xp-dlg" role="dialog" aria-modal="true" aria-labelledby="xp-t"><h2 id="xp-t">📄 ${o.title}</h2><p>${o.intro || "Le fichier PDF se télécharge sur ton appareil. Tu peux ensuite le déposer sur Pronote."}</p>
      <label>Nom et prénom<input id="xp-name" autocomplete="name" value=""></label><label>Classe<input id="xp-cls" value=""></label>
      <p class="xp-msg" aria-live="polite"></p><div class="xp-row"><button type="button" data-x="no">Annuler</button><button type="button" class="go" data-x="go">Télécharger le PDF</button></div></div>`;
    document.body.appendChild(back);
    const $n = back.querySelector("#xp-name"), $c = back.querySelector("#xp-cls"), msg = back.querySelector(".xp-msg");
    $n.value = who.name; $c.value = who.cls; ($n.value ? $c : $n).focus();
    const close = () => back.remove();
    back.addEventListener("keydown", e => { if (e.key === "Escape") close(); if (e.key === "Enter") back.querySelector(".go").click(); });
    back.addEventListener("click", e => {
      if (e.target === back) return close();
      const b = e.target.closest("[data-x]"); if (!b) return;
      if (b.dataset.x === "no") return close();
      const w = {name: $n.value.trim(), cls: $c.value.trim()};
      if (!w.name) { msg.textContent = "Écris ton nom et ton prénom."; $n.focus(); return; }
      try { localStorage.setItem(LS, JSON.stringify(w)); } catch (e) {}
      const d = new Date(), date = d.toLocaleDateString("fr-FR");
      const doc = new Doc({annotate: o.annotate, head: `${w.name}${w.cls ? " · " + w.cls : ""} · ${date} · ${o.title}`});
      o.build(doc, w);
      const blob = new Blob([doc.bytes()], {type: "application/pdf"}), url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `${o.file}_${safe(w.name) || "eleve"}.pdf`; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      msg.className = "xp-msg xp-ok"; msg.textContent = "✓ Le PDF est téléchargé. Dépose-le sur Pronote."; b.textContent = "Télécharger à nouveau";
    });
  }
  // A ready-made button: ExportPDF.button(label, options) -> <button>
  function button(label, o) { css(); const b = document.createElement("button"); b.type = "button"; b.className = "xp-btn"; b.textContent = label; b.addEventListener("click", () => open(typeof o === "function" ? o() : o)); return b; }
  window.ExportPDF = {open, button, Doc, clean};
})();
