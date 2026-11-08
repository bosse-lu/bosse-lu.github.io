/* DÒKÒ engine, shared by every version of the game (doko/, doko/gs/, doko/cm1/).
   A page can set window.DOKO_CONFIG before this script:
     lang "en" | "fr" (texts of the game), key (prefix of what is saved on the device), themes (the packs),
     recreate false (no "Recreate the situation"), private true (teacher code needed),
     speak "fr-FR" (each question is read aloud), cellValues true (the board shows the answers, not A–E),
     wrong (points lost for a wrong answer, 1 by default), per {1: n, 2: n, 3: n} (questions per level).
   A pack is {id, title, kind, level, emoji, q: [questions]} or {…, gen: lv => question} (questions made at random).
   A question: q, o (choices), a (index of the right one), why, and optionally img, pic, html (a picture made in HTML),
   speak (what is read aloud), whyHtml, whySpeak, lv (1, 2, 3). */
(function () {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const CFG = window.DOKO_CONFIG || {}, FR = CFG.lang === "fr";
  const ROOT = document.currentScript && document.currentScript.src ? new URL("../assets/doko/", document.currentScript.src).href : "../assets/doko/";
  const IMG = ROOT, PIC = ROOT + "pics/", L = "ABCDE", PAIRS = ["BC", "DE", "AB", "CD", "AE"];
  const TOK = [{id: "fire", n: "Fire", fr: "le feu", f: "Feu", c: "#ff5a1f", e: "🔥"}, {id: "water", n: "Water", fr: "l'eau", f: "Eau", c: "#3d7bff", e: "💧"}, {id: "earth", n: "Earth", fr: "la terre", f: "Terre", c: "#e8a21a", e: "🌾"}, {id: "wood", n: "Wood", fr: "le bois", f: "Bois", c: "#43c13a", e: "🌳"}];
  const THEMES = CFG.themes || window.DOKO_THEMES || [], RECREATE = CFG.recreate === false ? null : window.DOKO_RECREATE;
  const LV = {1: ["easy", "facile"], 2: ["medium", "moyen"], 3: ["difficult", "difficile"]};
  const PER_LEVEL = 4, FAST = 8, WRONG = CFG.wrong === undefined ? 1 : CFG.wrong, KEY = CFG.key || "doko";
  const S = FR ? {
    recQ: "Que s'est-il passé ? Choisis la bonne phrase.", best: n => `Mon meilleur score : ${n}`, play: "Jouer", pts: n => `${n} point${Math.abs(n) > 1 ? "s" : ""}`,
    timeUp: "⏰ Temps écoulé ! 0 point", well: n => `✔ Bravo ! +${n}`, fast: "⚡ Rapide ! +1", power: "Pouvoir de l'élément ! +2", wrong: n => n ? `✘ Pas cette fois : −${n}` : "✘ Pas cette fois…",
    next: "Question suivante →", see: "Voir mon score 🏆", right: (r, n) => `${r} / ${n} bonnes réponses`, record: "🎉 Nouveau record !", first: "Ton premier score ! Rejoue pour le battre.", yourBest: n => `Ton meilleur score : ${n} points`,
    music: on => on ? "🔊 Musique" : "🔇 Musique", hear: "Écouter", lvl: lv => LV[lv][1]
  } : {
    recQ: "What happened? Choose the right sentence.", best: n => `My best score: ${n}`, play: "Play", pts: n => `${n} point${Math.abs(n) === 1 ? "" : "s"}`,
    timeUp: "⏰ Time is up! 0 point", well: n => `✔ Well done! +${n}`, fast: "⚡ Fast! +1", power: "Element power! +2", wrong: n => n ? `✘ Not this time: −${n}` : "✘ Not this time",
    next: "Next question →", see: "See my score 🏆", right: (r, n) => `${r} / ${n} right answers`, record: "🎉 New record!", first: "Your first score! Play again to beat it.", yourBest: n => `Your best score: ${n} points`,
    music: on => on ? "🔊 Music" : "🔇 Music", hear: "Listen", lvl: lv => LV[lv][0]
  };
  const store = {get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }};
  let token = store.get(KEY + "-token"), game = RECREATE ? null : "theme", theme = THEMES.length === 1 ? THEMES[0] : null, G = null;
  if (!RECREATE && $("#games")) $("#games").hidden = true;
  if (!TOK.some(t => t.id === token)) token = null;
  // ?game=recreate (link from the lesson) or ?game=theme opens that game directly
  try { const g = new URLSearchParams(location.search).get("game"); if (g === "recreate" && RECREATE) game = "recreate"; else if (g === "theme") game = "theme"; } catch (e) {}
  const pack = () => game === "recreate" ? (recreateOpen() ? RECREATE : null) : theme;
  // Recreate the situation: an evaluation, locked for the learners until the teacher opens it
  // (classes.json → evals: "doko-recreate"); the teacher code opens it on the device.
  const C = () => window.Classes;
  const recreateOpen = () => !!RECREATE && !!(C() && C().isReady() && (C().isAdmin() || C().evalOpen("late-and-absent", "doko-recreate") || C().evalOpen("late-and-absent-4e", "doko-recreate")));
  const isAdmin = () => !!(C() && C().isReady() && C().isAdmin());
  // One try per device. The attempt is saved in the browser storage AND in a cookie, so that
  // "I am another student" (which clears the storage) does not open a second try; the teacher can reset it.
  // st: "run" (in progress), "done" (finished), "left" (the learner left the page: 0 / 20).
  const EVK = "doko-eval-recreate", CK = "doko_eval_recreate";
  const evRead = () => {
    let a = store.get(EVK), b = null;
    try { const m = document.cookie.match(new RegExp("(?:^|; )" + CK + "=([^;]*)")); if (m) b = JSON.parse(decodeURIComponent(m[1])); } catch (e) {}
    const rank = r => !r ? 0 : r.st === "run" ? 1 : 2;
    return rank(b) > rank(a) ? b : a;
  };
  const evWrite = r => {
    store.set(EVK, r);
    try { document.cookie = r ? `${CK}=${encodeURIComponent(JSON.stringify(r))}; max-age=31536000; path=/; SameSite=Lax` : `${CK}=; max-age=0; path=/`; } catch (e) {}
  };
  // An attempt still "in progress" when the page opens = the page was closed or reloaded during the test: 0 / 20
  (function () { const r = evRead(); if (r && r.st === "run") evWrite(Object.assign(r, {st: "left", score: 0, end: new Date().toISOString()})); })();
  const fmtDate = iso => { try { return new Date(iso).toLocaleString("fr-FR", {day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"}); } catch (e) { return ""; } };

  /* ---------- menu ---------- */
  // A private version (CFG.private) opens only with the teacher code on this device
  const allowed = () => !CFG.private || isAdmin();
  function drawMenu() {
    if (CFG.private) {
      const ok = allowed(); if ($("#gate")) $("#gate").hidden = ok;
      if (!ok) { $("#menu").style.display = "none"; return; }
      if ((!G || G.phase === "end" || G.phase === "") && $("#end").style.display !== "flex") $("#menu").style.display = "flex";
    }
    $("#tokens").innerHTML = TOK.map(t => `<button type="button" class="tk" data-tok="${t.id}" style="--c:${t.c}" aria-pressed="${token === t.id}"><img src="${IMG}${t.id}.png" alt="">${FR ? t.f : t.n}${FR ? "" : `<small lang="fr">${t.fr}</small>`}</button>`).join("");
    if (token) document.body.dataset.el = token; if (window.DokoFX) DokoFX.set(token);
    $$(".gm").forEach(b => b.setAttribute("aria-pressed", b.dataset.g === game));
    const lk = !recreateOpen(); if ($("#lock-recreate")) { $("#lock-recreate").hidden = !lk; $('[data-g="recreate"]').classList.toggle("locked", lk); }
    $("#themebox").hidden = game !== "theme";
    $("#best-recreate").textContent = "";
    const ev = evRead(), evDone = ev && ev.st !== "run";
    $("#evres").hidden = !evDone || lk; $("#evres").className = "evres" + (ev && ev.st === "left" ? " left" : "");
    if (evDone) $("#evres").textContent = ev.st === "left" ? `⛔ You left the evaluation: 0 / 20 · ${fmtDate(ev.end)}` : `✅ Done: ${ev.score} / 20 · ${fmtDate(ev.end)}`;
    $("#evadmin").hidden = !isAdmin() || !RECREATE;
    $("#evadmin-st").textContent = evDone ? `Sur cet appareil : ${ev.st === "left" ? "sortie, 0 / 20" : ev.score + " / 20"} (${fmtDate(ev.end)}).` : "Aucune tentative sur cet appareil.";
    $("#themes").innerHTML = THEMES.map(t => {
      const best = store.get(KEY + "-best-" + t.id), per = t.per || CFG.per, nq = per ? per[1] + per[2] + per[3] : 3 * PER_LEVEL;
      return `<button type="button" class="th" data-t="${t.id}" aria-pressed="${!!theme && theme.id === t.id}"><b>${t.emoji || "🎲"} ${esc(t.title)}</b><small>${esc(t.kind)} · ${esc(t.level)} · ${nq} questions</small>${typeof best === "number" ? `<span class="best">${S.best(best)}</span>` : ""}</button>`;
    }).join("");
    $("#go").disabled = !(token && pack()) || (game === "recreate" && evDone && !isAdmin());
    $("#go").innerHTML = token ? `<img src="${IMG}${token}.png" alt="">${S.play}` : "▶ " + S.play;
  }
  $("#tokens").addEventListener("click", e => { const b = e.target.closest("[data-tok]"); if (!b) return; token = b.dataset.tok; store.set(KEY + "-token", token); drawMenu(); });
  $("#games").addEventListener("click", e => { const b = e.target.closest("[data-g]"); if (!b) return; game = b.dataset.g; drawMenu(); });
  document.addEventListener("classes:ready", () => drawMenu());
  document.addEventListener("classes:change", () => drawMenu());
  if (window.Classes) Classes.mountPicker($("#cl-picker"), {noReset: true, title: "Teacher code", titleFr: "Code professeur", hint: CFG.pickerHint || "Le code professeur ouvre l'évaluation sur cet appareil."});
  $("#themes").addEventListener("click", e => { const b = e.target.closest("[data-t]"); if (!b) return; theme = THEMES.find(t => t.id === b.dataset.t); drawMenu(); });

  /* ---------- sound ---------- */
  let ac = null, musicOn = false;
  function beep(f, d) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = .08; o.connect(g); g.connect(ac.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + d); o.stop(ac.currentTime + d); } catch (e) {} }
  // Ambient music: on by default, it starts at the first touch (browsers block sound before that)
  const music = $("#music"); music.volume = .35; musicOn = store.get("doko-music") !== false;
  const playMusic = () => { const pr = music.play(); if (pr && pr.catch) pr.catch(() => {}); };
  const soundBtns = () => $$(".sound").forEach(b => { b.textContent = S.music(musicOn); b.setAttribute("aria-pressed", musicOn); });
  $$(".sound").forEach(b => b.addEventListener("click", () => { musicOn = !musicOn; store.set("doko-music", musicOn); if (musicOn) playMusic(); else music.pause(); soundBtns(); }));
  const firstTouch = e => { if (e.target.closest && e.target.closest(".sound")) return; document.removeEventListener("pointerdown", firstTouch); document.removeEventListener("keydown", firstTouch); if (musicOn && music.paused) playMusic(); };
  document.addEventListener("pointerdown", firstTouch); document.addEventListener("keydown", firstTouch);
  music.addEventListener("play", soundBtns); soundBtns();
  if (musicOn) playMusic();
  function speak(t, lang) {
    lang = lang || "en-GB";
    try { speechSynthesis.cancel(); const vs = speechSynthesis.getVoices(), v = vs.find(x => x.lang.replace("_", "-") === lang) || vs.find(x => x.lang.startsWith(lang.slice(0, 2))); const u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = .9; if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) {}
  }
  try { speechSynthesis.getVoices(); } catch (e) {}

  /* ---------- game ---------- */
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // 4 questions per level, easy first; the choices are mixed (the right one is followed)
  function pick(P) {
    const per = P.per || CFG.per;
    const take = lv => {
      const n = per ? per[lv] : PER_LEVEL;
      if (!P.gen) return shuffle((P.q || []).filter(q => (q.lv || 1) === lv)).slice(0, n);
      // Questions made at random: no two identical questions in a game
      const out = [], seen = new Set();
      for (let k = 0; out.length < n && k < n * 20; k++) { const q = P.gen(lv); const id = q.id || q.q + "|" + (q.html || "") + "|" + q.o.join(); if (!seen.has(id)) { seen.add(id); out.push(Object.assign({lv}, q)); } }
      return out;
    };
    return [1, 2, 3].flatMap(take).map(q => {
      const order = shuffle(q.o.map((_, i) => i));
      return Object.assign({}, q, {o: order.map(i => q.o[i]), a: order.indexOf(q.a), say: q.say || (q.scene && !q.say ? q.o[q.a] : null)});
    });
  }
  function start(confirmed) {
    const P = pack();
    if (!P || !allowed()) return;
    if (P.eval) {
      const ev = evRead();
      if (ev && ev.st !== "run" && !isAdmin()) { drawMenu(); return; }
      if (confirmed !== true) { $("#menu").style.display = "none"; $("#end").style.display = "none"; $("#warn").hidden = false; window.scrollTo(0, 0); return; }
      $("#warn").hidden = true;
      evWrite({st: "run", start: new Date().toISOString(), cls: C() && C().klass() ? C().klass().label : ""});
      document.body.classList.add("exam");
    }
    G = {qs: pick(P), i: -1, score: 0, right: 0, streak: 0, joker: !P.eval, ev: !!P.eval, log: [], cell: null, phase: "", time: P.time || 20};
    $("#joker").hidden = G.ev;
    $("#mytoken img").src = IMG + token + ".png";
    $("#menu").style.display = "none"; $("#end").style.display = "none"; $("#game").style.display = "flex"; document.body.classList.add("playing");
    window.scrollTo(0, 0); next();
  }
  $("#go").addEventListener("click", () => start());
  $("#again").addEventListener("click", () => start());
  $("#warn-go").addEventListener("click", () => start(true));
  $("#warn-no").addEventListener("click", () => { $("#warn").hidden = true; $("#menu").style.display = "flex"; drawMenu(); });
  $("#evreset").addEventListener("click", () => { if (!isAdmin()) return; evWrite(null); drawMenu(); });

  /* Leaving the evaluation (other tab, other app, reload, closing): 0 / 20, no second try */
  function leave() {
    if (!G || !G.ev || G.phase === "end") return;
    clearInterval(tmr); G.phase = "end"; G.left = true;
    evWrite(Object.assign(evRead() || {}, {st: "left", score: 0, end: new Date().toISOString()}));
    finish();
  }
  document.addEventListener("visibilitychange", () => { if (document.hidden) leave(); });
  addEventListener("pagehide", leave);
  addEventListener("beforeunload", e => { if (G && G.ev && G.phase !== "end") { e.preventDefault(); e.returnValue = ""; } });
  $("#back").addEventListener("click", () => { $("#end").style.display = "none"; $("#menu").style.display = "flex"; drawMenu(); window.scrollTo(0, 0); });

  const Q = () => G.qs[G.i];
  const okLetter = l => L.indexOf(l) < Q().o.length && !(G.gone || []).includes(l);
  const cellOk = c => c.length === 1 ? okLetter(c) : [...c].some(okLetter) && [...c].every(l => L.indexOf(l) < Q().o.length);
  const value = c => c.length === 2 ? 2 : 4;
  const isRight = c => c.includes(L[Q().a]);
  function pop(t) { const d = document.createElement("div"); d.className = "pop"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1500); }
  const noteHTML = (type, f) => {
    const rows = type === "late" ? ["Name", "Late", "Reason", "Signed"] : ["Name", "Date", "Reason", "Signed"]; f = f || {};
    return `<div class="note" lang="en"><b>${type === "late" ? "LATE SLIP" : "ABSENCE NOTE"}</b>${rows.map(r => `<div class="r"><span>${r} :</span>${f[r] ? `<em>${esc(f[r])}</em>` : ""}</div>`).join("")}</div>`;
  };
  function sceneHTML(parts) {
    return parts.map((p, i) => {
      let h;
      if (p.q) h = `<span class="qm" aria-label="question">?</span>`;
      else if (p.box) h = `<span class="box" aria-label="mystery box">❓</span>`;
      else if (p.note) h = `<div class="pic">${noteHTML(p.note, p.f)}${p.cap ? `<span class="cap">${esc(p.cap)}</span>` : ""}</div>`;
      else h = `<div class="pic">${p.lab ? `<span class="lab">${esc(p.lab)}</span>` : ""}${p.no ? `<span class="over no">${esc(p.no)}</span>` : p.verb ? `<span class="over">${esc(p.verb)}</span>` : ""}<span class="frame${p.wide ? " wide" : ""}"><img src="${PIC}${p.img}.png" alt=""></span>${p.cap ? `<span class="cap">${esc(p.cap)}</span>` : ""}</div>`;
      const plus = i && !p.q && !p.box && !parts[i - 1].box ? '<span class="plus" aria-hidden="true">+</span>' : "";
      return plus + h;
    }).join("");
  }
  function next() {
    G.i++;
    if (G.i >= G.qs.length) return finish();
    G.cell = null; G.phase = "ask"; G.gone = []; G.t0 = Date.now();
    const q = Q(), P = pack();
    $("#qn").innerHTML = `${esc((P.emoji || "") + " " + P.title)} · ${G.i + 1} / ${G.qs.length}${G.ev ? ' <span class="evalbadge">/20</span>' : ""}`;
    const lv = q.lv || 1; $("#lvl").className = "lvl l" + lv; $("#lvl").innerHTML = `<i></i>${S.lvl(lv)}`;
    drawStreak();
    $("#question").innerHTML = `${esc(q.q || S.recQ)}${CFG.speak ? `<button type="button" class="hear" aria-label="${S.hear}">🔊</button>` : ""}<span class="num">${G.i + 1}</span>`;
    $("#scene").hidden = !q.scene && !q.html; if (q.scene) $("#scene").innerHTML = sceneHTML(q.scene); else if (q.html) $("#scene").innerHTML = q.html;
    $("#scene").classList.toggle("vis", !!q.html);
    if (CFG.speak) { $("#question .hear").addEventListener("click", () => speak(q.speak || q.q, CFG.speak)); setTimeout(() => { if (G.phase === "ask" && Q() === q) speak(q.speak || q.q, CFG.speak); }, 350); }
    $("#qimg").hidden = !q.img; if (q.img) $("#qimg img").src = PIC + q.img + ".png";
    $("#opts").className = "opts" + (q.o.some(o => o.length > 40) ? " long" : "");
    $("#opts").className += CFG.cellValues ? " vals" : "";
    $("#opts").innerHTML = q.o.map((o, k) => `<li data-l="${L[k]}" lang="${CFG.lang || "en"}"><b>${L[k]}.</b>${esc(o)}</li>`).join("");
    $("#explain").hidden = true; $("#msg").textContent = ""; $("#msg").className = "msg"; $("#bar").innerHTML = "";
    $("#hand").hidden = false; $("#mytoken").classList.remove("used"); $("#joker").disabled = !G.joker;
    drawBoard(); drawScore();
    runTimer(G.time, () => reveal());
  }
  const drawStreak = () => { const t = TOK.find(x => x.id === token); $("#streak").textContent = G.streak > 0 ? `${t.e}×${G.streak}` : ""; };
  let tmr = null;
  function runTimer(sec, done) {
    clearInterval(tmr); const end = Date.now() + sec * 1000, C = 213.6; let last = null;
    const tick = () => {
      const left = Math.max(0, (end - Date.now()) / 1000), s = Math.ceil(left);
      $("#tsec").textContent = s; $("#ring").style.strokeDashoffset = C * (1 - left / sec);
      $("#timer").classList.toggle("low", s <= 5);
      if (s <= 5 && s > 0 && s !== last) { beep(880, .12); last = s; }
      if (left <= 0) { clearInterval(tmr); done(); }
    };
    tick(); tmr = setInterval(tick, 200);
  }
  function drawBoard() {
    const cell = c => {
      const off = !cellOk(c), mine = G.cell === c;
      return `<button type="button" class="cell${off ? " off" : ""}${mine ? " has" : ""}" data-c="${c}" ${off ? "disabled" : ""} aria-label="${c}, ${G.ev ? value(c) / 2 : value(c)} points">${mine ? `<img src="${IMG}${token}.png" alt="Your token" class="${G.anim || "idle"}">` : CFG.cellValues ? `<span class="lt v${c.length > 1 ? " pair" : ""}">${[...c].map(l => esc(Q().o[L.indexOf(l)] || "")).join("<i>·</i>")}</span>` : `<span class="lt">${c}</span>`}<small>${c}</small></button>`;
    };
    $("#board").innerHTML = `<div class="row">${[...L].map(cell).join("")}<span class="pts">${G.ev ? 2 : 4}</span></div><div class="sep"></div><div class="row">${PAIRS.map(cell).join("")}<span class="pts">${G.ev ? 1 : 2}</span></div><div class="brand">DÒKÒ</div>`;
  }
  // During the evaluation the score stays hidden (no correction before the end)
  const drawScore = () => { $("#score").innerHTML = `<img src="${IMG}${token}.png" alt="">` + (G.ev ? "Evaluation" : S.pts(G.score)); };

  // Joker: two wrong answers disappear, once per game
  $("#joker").addEventListener("click", () => {
    if (!G || G.phase !== "ask" || !G.joker) return;
    const q = Q(), wrong = shuffle([...L.slice(0, q.o.length)].filter(l => l !== L[q.a])).slice(0, 2);
    G.joker = false; G.gone = wrong; $("#joker").disabled = true; beep(660, .15);
    $$("#opts li").forEach(li => li.classList.toggle("gone", wrong.includes(li.dataset.l)));
    drawBoard(); pop("⚛️ Joker!");
  });

  // The token falls into its box (as in the Keynote), then the correction appears
  function place(c, dragged) {
    if (G.phase !== "ask" || !c) return;
    G.phase = "placing"; G.took = (Date.now() - G.t0) / 1000; clearInterval(tmr);
    G.cell = c; $("#mytoken").classList.add("used");
    const still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    G.anim = dragged ? "settle" : "drop"; drawBoard(); G.anim = null;
    setTimeout(() => beep(520, .08), dragged ? 0 : 380);
    setTimeout(reveal, still ? 50 : (dragged ? 380 : 750));
  }
  $("#board").addEventListener("click", e => { const b = e.target.closest(".cell:not(:disabled)"); if (b) place(b.dataset.c); });

  /* drag the token onto a box */
  let ghost = null, over = null;
  const cellAt = (x, y) => { const el = document.elementFromPoint(x, y); const c = el && el.closest(".cell:not(:disabled)"); return c && $("#board").contains(c) ? c : null; };
  $("#mytoken").addEventListener("pointerdown", e => {
    if (!G || G.phase !== "ask") return; e.preventDefault();
    ghost = document.createElement("img"); ghost.className = "ghost"; ghost.src = IMG + token + ".png"; ghost.alt = ""; document.body.appendChild(ghost);
    $("#mytoken").classList.add("used"); move(e);
    try { $("#mytoken").setPointerCapture(e.pointerId); } catch (err) {}
  });
  function move(e) {
    if (!ghost) return; ghost.style.left = e.clientX + "px"; ghost.style.top = e.clientY + "px";
    const c = cellAt(e.clientX, e.clientY); if (c !== over) { if (over) over.classList.remove("hover"); over = c; if (c) c.classList.add("hover"); }
  }
  $("#mytoken").addEventListener("pointermove", move);
  function drop(e) {
    if (!ghost) return; ghost.remove(); ghost = null;
    const c = cellAt(e.clientX, e.clientY); if (over) over.classList.remove("hover"); over = null;
    if (c) place(c.dataset.c, true); else $("#mytoken").classList.remove("used");
  }
  $("#mytoken").addEventListener("pointerup", drop);
  $("#mytoken").addEventListener("pointercancel", drop);

  function reveal() {
    if (G.phase !== "ask" && G.phase !== "placing") return; G.phase = "show"; clearInterval(tmr);
    const q = Q(), a = L[q.a];
    if (G.ev) {
      // Evaluation: one letter right = 2, two letters with the right one = 1, wrong or no answer = 0; no correction now
      const ok = !!G.cell && isRight(G.cell), pts = ok ? (G.cell.length === 1 ? 2 : 1) : 0;
      G.score += pts; if (ok && G.cell.length === 1) G.right++;
      G.log.push({q, cell: G.cell, pts});
      $("#hand").hidden = true; drawBoard();
      $("#msg").className = "msg"; $("#msg").textContent = G.cell ? "✓ Answer saved" : "⏰ Time is up!";
      $("#tsec").textContent = "✓"; beep(G.cell ? 600 : 220, .12);
      setTimeout(() => { if (G.phase === "show") next(); }, 900);
      return;
    }
    $$("#opts li").forEach(li => li.classList.toggle("right", li.dataset.l === a));
    $("#hand").hidden = true;
    drawBoard();
    $$("#board .cell").forEach(b => { if (b.dataset.c === a && b.dataset.c !== G.cell) b.classList.add("answer"); });
    const msg = [];
    if (!G.cell) { msg.push(S.timeUp); $("#msg").className = "msg bad"; beep(220, .3); G.streak = 0; }
    else {
      const ok = isRight(G.cell), el = $(`#board [data-c="${G.cell}"]`);
      el.classList.add(ok ? "win" : "lose");
      if (ok) {
        let pts = value(G.cell); G.right++; G.streak++;
        msg.push(S.well(pts));
        if (G.cell.length === 1 && G.took <= FAST) { pts += 1; msg.push(S.fast); setTimeout(() => pop(S.fast), 150); }
        if (G.streak % 3 === 0) { pts += 2; msg.push("✨ " + S.power); el.classList.add("power"); setTimeout(() => pop(`${TOK.find(x => x.id === token).e} ${S.power}`), 700); }
        G.score += pts; $("#msg").className = "msg good"; beep(1040, .25);
      } else { G.score -= WRONG; G.streak = 0; msg.push(S.wrong(WRONG)); $("#msg").className = "msg bad"; beep(220, .25); }
    }
    $("#msg").textContent = msg.join(" · ");
    $("#tsec").textContent = "✓";
    const pic = q.pic ? `<img src="${PIC}${q.pic}.png" alt="">` : "";
    $("#explain").hidden = false;
    $("#explain").innerHTML = `${pic}<div><p class="ans">${a}. ${esc(q.o[q.a])}</p>${q.say && q.say !== q.o[q.a] ? `<p lang="en"><b>${esc(q.say)}</b></p>` : ""}<p>${esc(q.why || "")}</p>${q.whyHtml || ""}</div>`;
    if (CFG.speak && (q.whySpeak || q.why)) setTimeout(() => speak(q.whySpeak || q.why, CFG.speak), 500);
    drawScore(); drawStreak();
    $("#bar").innerHTML = (q.say ? sayHTML() : "") + `<button type="button" class="btn main" id="nx">${G.i + 1 < G.qs.length ? S.next : S.see}</button>`;
    if (q.say) bindSay(q.say);
    $("#nx").addEventListener("click", () => { try { speechSynthesis.cancel(); } catch (e) {} next(); }); $("#nx").focus({preventScroll: true});
  }

  /* ---------- 🎤 Say it! (bonus +2, Chrome / Edge) ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const CONTR = [[/\bi'm\b/g, "i am"], [/\bdidn't\b/g, "did not"], [/\bdad's\b/g, "dads"]];
  const norm = t => { t = String(t || "").toLowerCase().replace(/[’‘`]/g, "'"); CONTR.forEach(([r, v]) => { t = t.replace(r, v); }); return t.replace(/[^a-z0-9' ]+/g, " ").replace(/'/g, "").replace(/\s+/g, " ").trim(); };
  function match(txt, model) {
    const a = norm(txt).split(" ").filter(Boolean), b = norm(model).split(" ");
    const d = Array.from({length: a.length + 1}, () => new Array(b.length + 1).fill(0));
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = a[i - 1] === b[j - 1] ? d[i - 1][j - 1] + 1 : Math.max(d[i - 1][j], d[i][j - 1]);
    const ok = new Array(a.length).fill(false), found = new Array(b.length).fill(false); let i = a.length, j = b.length;
    while (i && j) { if (a[i - 1] === b[j - 1]) { ok[i - 1] = found[j - 1] = true; i--; j--; } else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--; }
    const link = b.every((w, k) => !["because", "so"].includes(w) || found[k]);
    return {ratio: d[a.length][b.length] / b.length, heard: a, ok, link};
  }
  const sayHTML = () => `<div class="sayit" id="sayit"><p><b>🎤 Say it! +2</b> <span class="fr">Dis la bonne phrase à voix haute.</span></p><div class="bar"><button type="button" class="btn" id="listen">🔊 Listen</button>${SR ? `<button type="button" class="btn main" id="rec">🎙️ Speak</button>` : ""}</div><div class="heard" id="heard" aria-live="polite">${SR ? "" : "<small>The microphone check works in Chrome or Edge. Listen and repeat!</small>"}</div></div>`;
  function bindSay(model) {
    $("#listen").addEventListener("click", () => speak(model));
    if (!SR) return;
    let tries = 0, busy = false, done = false;
    $("#rec").addEventListener("click", e => {
      if (busy || done) return; busy = true; const btn = e.currentTarget; btn.disabled = true; btn.textContent = "👂 Speak now…";
      try { speechSynthesis.cancel(); } catch (err) {}
      const r = new SR(); r.lang = "en-GB"; r.interimResults = false; r.maxAlternatives = 3;
      r.onresult = ev => {
        const best = [...ev.results[0]].map(x => match(x.transcript, model)).sort((x, y) => y.ratio - x.ratio)[0];
        $("#heard").innerHTML = `I heard: ${best.heard.map((w, i) => `<span class="w ${best.ok[i] ? "ok" : "ko"}">${esc(w)}</span>`).join(" ") || "…"}`;
        if (best.ratio >= .75 && best.link) { done = true; G.score += 2; drawScore(); pop("🎤 +2"); beep(1240, .25); $("#heard").insertAdjacentHTML("beforeend", `<p class="msg good">✔ Perfect! +2</p>`); return; }
        tries++;
        if (tries >= 2) { done = true; $("#heard").insertAdjacentHTML("beforeend", `<p class="msg bad">Not this time. Listen to the model 🔊</p>`); speak(model); return; }
        $("#heard").insertAdjacentHTML("beforeend", `<p>Almost! Try again. <span class="fr">Presque ! Réessaie.</span></p>`);
      };
      r.onerror = ev => { $("#heard").textContent = ev.error === "no-speech" ? "I heard nothing. Try again." : ev.error === "not-allowed" ? "The microphone is blocked." : "The check failed. Try again."; };
      r.onend = () => { busy = false; btn.disabled = done; btn.textContent = done ? "🎙️ Done" : "🎙️ Speak"; };
      try { r.start(); } catch (err) { busy = false; btn.disabled = false; }
    });
  }

  function finish() {
    clearInterval(tmr); G.phase = "end";
    $("#game").style.display = "none"; $("#end").style.display = "flex"; document.body.classList.remove("playing", "exam");
    if (G.ev) {
      if (G.left) G.score = 0; else evWrite(Object.assign(evRead() || {}, {st: "done", score: G.score, end: new Date().toISOString()}));
      $("#again").hidden = !isAdmin();
    } else $("#again").hidden = false;
    const P = pack(), k = KEY + "-best-" + P.id, best = store.get(k);
    $("#endtok").src = IMG + token + ".png";
    $("#final").textContent = G.ev ? `${G.score} / 20` : S.pts(G.score);
    $("#right").innerHTML = G.left ? `<p class="leftmsg">⛔ You left the evaluation: 0 / 20. You cannot start again.</p><p class="fr">Tu as quitté l'évaluation : 0 / 20. Tu ne peux pas recommencer.</p>` : S.right(G.right, G.qs.length);
    $("#review").hidden = !G.ev || G.left;
    if (G.ev && !G.left) $("#review").innerHTML = `<h3>Correction</h3>` + G.log.map((r, i) => {
      const mine = r.cell ? [...r.cell].map(l => r.q.o[L.indexOf(l)]).join(" / ") : "no answer";
      return `<div class="it ${r.pts === 2 ? "ok" : r.pts === 1 ? "half" : ""}"><p><b>${i + 1}. ${esc(r.q.say && r.q.o[r.q.a].split(" ").length < 3 ? r.q.say : r.q.o[r.q.a])}</b> · ${r.pts} / 2</p>${r.pts === 2 ? "" : `<p class="mine" lang="en">Your answer: ${esc(mine)}</p>`}<p class="mine">${esc(r.q.why || "")}</p></div>`;
    }).join("");
    if (G.ev) { $("#best").textContent = isAdmin() ? "Mode professeur : vous pouvez recommencer." : ""; window.scrollTo(0, 0); return; }
    if (typeof best !== "number" || G.score > best) { store.set(k, G.score); $("#best").textContent = typeof best === "number" ? S.record : S.first; }
    else $("#best").textContent = S.yourBest(best);
    window.scrollTo(0, 0);
  }

  drawMenu();
  setTimeout(() => $("#tokens").classList.remove("intro"), 1600);
})();
