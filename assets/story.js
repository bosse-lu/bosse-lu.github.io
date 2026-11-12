/* Short story reader: renders the story from <script type="application/json" id="story-data">,
   reads it aloud sentence by sentence (browser voice) with highlighting. */
(function () {
  const data = JSON.parse(document.getElementById("story-data").textContent);
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  // Split a paragraph into sentences, keeping closing quotes with their sentence.
  const sentences = p => p.match(/[^.!?…]+(?:[.!?…]+["”]?|$)\s*/g).map(s => s.trim()).filter(Boolean);

  let n = 0;
  $("#story").innerHTML = data.parts.map((part, pi) =>
    `<section class="part">${data.parts.length > 1 ? `<h2 class="part-k">Part ${pi + 1}</h2>` : ""}${part.map(par =>
      `<p>${sentences(par).map(s => `<span class="s" tabindex="0" data-i="${n++}">${esc(s)}</span>`).join(" ")}</p>`).join("")}</section>`).join("")
    + (data.moral ? `<p class="moral" lang="en">${esc(data.moral)}</p>` : "");
  if (data.vocab && $("#vocab")) $("#vocab").innerHTML = data.vocab.map(([en, fr]) => `<li><b lang="en">${esc(en)}</b> = ${esc(fr)}</li>`).join("");

  /* ---------- the story as a PDF to annotate (numbered lines, a margin for notes) ---------- */
  function addPdf() {
    if (!window.ExportPDF || $("#story-pdf")) return;
    const title = ($("h1") || {}).textContent || "My short story", sub = ($("header .sub") || {}).textContent || "";
    const wrap = document.createElement("p"); wrap.id = "story-pdf"; wrap.style.cssText = "margin:4px 0 0";
    wrap.appendChild(ExportPDF.button("📄 L'histoire en PDF, pour l'annoter", {
      title, file: title.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, ""), annotate: true,
      intro: "L'histoire se télécharge en PDF, avec les lignes numérotées et une marge pour tes notes. Tu peux l'annoter, puis la déposer sur Pronote si ton professeur le demande.",
      build(d) {
        d.h(title, 18); if (sub) d.p([[sub, "I"]], {size: 10.5, gray: true, gap: 10});
        data.parts.forEach((part, pi) => {
          if (data.parts.length > 1) d.h("Part " + (pi + 1), 12.5);
          part.forEach(par => d.p(par, {size: 12.5, lead: 2.05, numbered: true, gap: 9}));
        });
        if (data.moral) d.p([[data.moral, "BI"]], {size: 12, lead: 1.8, gap: 10});
        if (data.vocab && data.vocab.length) { d.h("Vocabulary", 13); data.vocab.forEach(([en, fr]) => d.p([[en, "B"], [" = " + fr, "R"]], {size: 10.5, gap: 1})); }
      }}));
    $("#story").after(wrap);
  }
  if (window.ExportPDF) addPdf(); else {
    const sc = document.createElement("script"); sc.src = (document.currentScript ? document.currentScript.src : "../../assets/story.js").replace(/story\.js(\?.*)?$/, "export-pdf.js"); sc.onload = addPdf; document.head.appendChild(sc);
  }

  /* ---------- reading aloud ---------- */
  const ico = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'
  };
  let voices = [], tok = 0, keep = null, reading = false;
  function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch (e) {} }
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function utter(text) {
    const lang = $("#accent").value, u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = +$("#rate").value;
    const v = voices.find(v => v.lang.replace("_", "-") === lang) || voices.find(v => v.lang.startsWith("en"));
    if (v) u.voice = v; return u;
  }
  function setBtn(on) { reading = on; $("#readAll").innerHTML = on ? ico.stop + "Stop" : ico.play + "Listen to the story"; }
  function stop() { tok++; try { speechSynthesis.cancel(); } catch (e) {} $$(".s.now").forEach(e => e.classList.remove("now")); setBtn(false); }
  function readFrom(start, onlyOne) {
    if (!("speechSynthesis" in window)) { $("#hint").textContent = "Reading aloud is not available in this browser."; return; }
    stop(); const t = ++tok; const all = $$(".s"); let i = start; setBtn(!onlyOne);
    const next = () => {
      if (t !== tok) return;
      $$(".s.now").forEach(e => e.classList.remove("now"));
      if (i >= all.length || (onlyOne && i > start)) { setBtn(false); return; }
      const el = all[i++]; el.classList.add("now"); el.scrollIntoView({block: "nearest"});
      const u = utter(el.textContent); keep = u;
      u.onend = () => setTimeout(next, 200);
      u.onerror = () => { if (t === tok) setTimeout(next, 200); };
      speechSynthesis.speak(u);
    };
    next();
  }
  setBtn(false);
  $("#readAll").addEventListener("click", () => reading ? stop() : readFrom(0, false));
  document.addEventListener("click", e => { const s = e.target.closest(".s"); if (s) readFrom(+s.dataset.i, true); });
  document.addEventListener("keydown", e => { const s = e.target.closest && e.target.closest(".s"); if (s && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); readFrom(+s.dataset.i, true); } });
  ["#rate", "#accent"].forEach(sel => $(sel).addEventListener("change", () => { stop(); try { localStorage.setItem("story-" + sel.slice(1), $(sel).value); } catch (e) {} }));
  try { ["rate", "accent"].forEach(k => { const v = localStorage.getItem("story-" + k); if (v) $("#" + k).value = v; }); } catch (e) {}
})();
