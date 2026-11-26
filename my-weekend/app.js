/* What did you do? · 30 words — writing workshop after the -ed speaking test.
   Step 1 word order, 2 -ed spelling, 3 irregular verbs, 4 negative, 5 questions, 6 linking words, 7 write 30 words.
   Version 5e or 4e from the class code (the teacher can preview both); level ★ / ★★ / ★★★ as on the other pages.
   Progress is saved on the device (localStorage "weekend": res = items done, n / t = done / total for the current version). */
(function () {
  const KEY = "weekend";
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const T = (en, fr) => window.Consigne ? Consigne.t(en, fr) : en;
  let S = {}; try { S = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) {}
  S.res = S.res || {}; S.txt = S.txt || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  /* ---------- class, version, level ---------- */
  const C = () => window.Classes;
  const K = () => (C() && C().klass ? C().klass() : null);
  const admin = () => { const k = K(); return !!(k && k.admin); };
  const L = () => { const v = C() && C().level ? C().level() : null; return v === "4e" || v === "5e" ? v : admin() ? (S.ver || "5e") : "5e"; };
  const is4 = () => L() === "4e";
  const stars = () => { const v = C() && C().stars ? C().stars() : 1; if (v === null) return S.pv || 1; const k = K(); return (k && v > 1) ? v : (S.free || 1); };
  const imposed = () => { const k = K(); return !!(k && !k.admin && C().stars() > 1); };
  window.pageStars = stars;
  // ids ending in _4 are for the 4e only, _5 for the 5e only
  const keep = a => a.filter(x => !(x.id.endsWith("_4") && !is4()) && !(x.id.endsWith("_5") && is4()));
  // 5e: exactly the exercises of the paper worksheet, in its order, so the page corrects the sheet
  const SHEET5 = {build: ["b1", "b2", "b4"], ed: ["e3", "e5", "e6", "e9", "e10", "e2"], irr: ["i1", "i2", "i3", "i4", "i6", "i7", "i9", "i10"], neg: ["g1", "g3", "g5"], qo: ["o1", "o2", "o3"]};
  const pick = (list, key) => is4() ? keep(list) : SHEET5[key].map(id => list.find(x => x.id === id));
  const rule5 = (title, html) => `<div class="rule"><p><b>Rule · ${title}</b></p>${html}</div>`;

  /* ---------- voice ---------- */
  function say(lines) {
    try {
      speechSynthesis.cancel();
      const vs = speechSynthesis.getVoices(), v = vs.find(x => x.lang.replace("_", "-") === "en-GB") || vs.find(x => x.lang.startsWith("en"));
      [].concat(lines).forEach(t => { const u = new SpeechSynthesisUtterance(t); u.lang = "en-GB"; u.rate = .9; if (v) u.voice = v; speechSynthesis.speak(u); });
    } catch (e) {}
  }

  /* ---------- matching (contractions and full forms are both fine; punctuation and capitals do not count) ---------- */
  const CONTR = [[/\bdidn't\b/g, "did not"], [/\bwasn't\b/g, "was not"], [/\bweren't\b/g, "were not"], [/\bdon't\b/g, "do not"], [/\bthat's\b/g, "that is"], [/\bi'm\b/g, "i am"], [/\bit's\b/g, "it is"]];
  function norm(t) {
    t = String(t || "").toLowerCase().replace(/[’‘`]/g, "'");
    CONTR.forEach(([r, v]) => { t = t.replace(r, v); });
    return t.replace(/[^a-z0-9' ]+/g, " ").replace(/'/g, "").replace(/\s+/g, " ").trim();
  }

  /* ---------- progress ---------- */
  let IDS = [];
  function progress() {
    const n = IDS.filter(i => S.res[i]).length;
    S.n = n; S.t = IDS.length; S.lvl = L(); save();
    $("#pc").textContent = `${n} / ${IDS.length}`; $("#pcbar").style.width = (IDS.length ? 100 * n / IDS.length : 0) + "%";
  }
  const done = id => { if (!S.res[id]) { S.res[id] = 1; } progress(); };
  const refreshRules = () => $$("[data-need]").forEach(el => { el.hidden = !el.dataset.need.split(" ").every(i => S.res[i]); });
  const fbk = (row, m) => { const f = $(".fb", row); if (!f) return; m = m || ["Try again.", "Essaie encore."]; f.className = "fb bad"; f.innerHTML = T(m[0], m[1]); };

  /* ---------- component 1: a question with options (or a typed answer at ★★★) ---------- */
  const CH = {};
  function choice(id, o) {
    IDS.push(id); CH[id] = o; const ok = !!S.res[id];
    const body = o.typed
      ? `<div class="tyrow"><input class="typed${ok ? " right" : ""}"${ok ? ` value="${esc(o.a)}" disabled` : ""} placeholder="${esc(o.placeholder || "Write here")}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(o.placeholder || "Your answer")}"><button type="button" class="btn" data-chk${ok ? " disabled" : ""}>Check</button></div>`
      : `<div class="opts">${(o.fixed ? o.opts : shuffle(o.opts)).map(x => `<button type="button" class="opt${ok && x === o.a ? " right" : ""}"${ok ? " disabled" : ""} data-o="${esc(x)}">${esc(x)}</button>`).join("")}</div>`;
    return `<div class="${o.cls || "qrow"}${ok ? " ok" : ""}" data-ch="${id}">${o.head || ""}${o.prompt ? `<p class="gapq">${o.prompt}</p>` : ""}${body}<p class="fb"></p>${o.after ? `<div class="after"${ok ? "" : " hidden"}>${o.after}</div>` : ""}</div>`;
  }
  function solve(row, id) {
    const o = CH[id]; row.classList.add("ok");
    $$(".opt", row).forEach(b => { b.disabled = true; b.classList.remove("wrong"); if (b.dataset.o === o.a) b.classList.add("right"); });
    const inp = $("input", row); if (inp) { inp.className = "typed right"; inp.disabled = true; const c = $("[data-chk]", row); if (c) c.disabled = true; }
    const af = $(".after", row); if (af) af.hidden = false;
    const f = $(".fb", row); if (f) { f.className = "fb good"; f.textContent = o.ok || ""; }
    done(id); if (o.onOk) o.onOk(row); refreshRules();
  }

  /* ---------- component 2: put the words in order (tiles; ★★ with traps; ★★★ typed) ---------- */
  const OR = {};
  function order(id, o) { IDS.push(id); OR[id] = o; return `<div class="card" data-or="${id}">${orderInner(id)}</div>`; }
  function orderInner(id) {
    const o = OR[id], st = stars(), model = o.acc[0], pr = o.prompt ? `<p class="gapq">${o.prompt}</p>` : "";
    if (S.res[id]) return `${pr}<div class="card-h"><h3 lang="en">${esc(model)}</h3><button type="button" class="listen" data-say="${esc(model)}" aria-label="Listen">▶</button><span class="done-tag">✓</span></div>`;
    if (st >= 3) return `${pr}${o.noHint ? "" : `<p class="hint-w">${shuffle(o.words).map(esc).join("  ·  ")}</p>`}<input class="typed" placeholder="${esc(o.placeholder || "Write the sentence")}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Your sentence"><div class="actions"><button type="button" class="btn" data-och>Check</button></div><p class="fb"></p>`;
    const tiles = shuffle(o.words.concat(st >= 2 ? (o.trap || []) : []));
    return `${pr}<div class="answer"></div><div class="tiles">${tiles.map((t, i) => `<button type="button" class="tile" data-t="${i}">${esc(t)}</button>`).join("")}</div><div class="actions"><button type="button" class="btn" data-och>Check</button><button type="button" class="btn lite" data-oclr>Clear</button></div><p class="fb"></p>`;
  }

  /* ---------- clicks ---------- */
  document.addEventListener("click", e => {
    const sp = e.target.closest("[data-say]"); if (sp) { say(sp.dataset.say.split(" | ")); return; }
    const b = e.target.closest("[data-ch] .opt");
    if (b && !b.disabled) {
      const row = b.closest("[data-ch]"), id = row.dataset.ch, o = CH[id];
      if (b.dataset.o === o.a) solve(row, id); else { b.classList.add("wrong"); fbk(row, o.why ? o.why(b.dataset.o) : null); }
      return;
    }
    const c = e.target.closest("[data-ch] [data-chk]");
    if (c) {
      const row = c.closest("[data-ch]"), id = row.dataset.ch, o = CH[id], inp = $("input", row), got = norm(inp.value);
      if (!got) return;
      if ((o.acc || [o.a]).some(w => norm(w) === got)) solve(row, id); else { inp.className = "typed wrong"; fbk(row, o.why ? o.why(inp.value) : null); }
      return;
    }
    const card = e.target.closest("[data-or]"); if (!card) return;
    const id = card.dataset.or, o = OR[id];
    const tile = e.target.closest(".tiles .tile");
    if (tile) { const a = $(".answer", card), cl = tile.cloneNode(true); cl.dataset.from = tile.dataset.t; a.appendChild(cl); tile.classList.add("used"); a.className = "answer"; return; }
    const back = e.target.closest(".answer .tile");
    if (back) { $(`.tiles [data-t="${back.dataset.from}"]`, card).classList.remove("used"); back.remove(); return; }
    if (e.target.closest("[data-oclr]")) { $$(".answer .tile", card).forEach(t => t.remove()); $$(".tiles .tile", card).forEach(t => t.classList.remove("used")); return; }
    if (e.target.closest("[data-och]")) {
      const inp = $("input", card), got = inp ? inp.value : $$(".answer .tile", card).map(t => t.textContent).join(" ");
      if (!norm(got)) return;
      if (o.acc.some(w => norm(w) === norm(got))) { done(id); say(o.acc[0]); card.innerHTML = orderInner(id); refreshRules(); return; }
      const trapped = (o.trap || []).find(t => norm(got).split(" ").includes(norm(t)));
      fbk(card, trapped && o.trapMsg ? o.trapMsg : (o.why || ["Not yet: check the order and the verb.", "Pas encore : vérifie l'ordre des mots et le verbe."]));
      if (inp) inp.className = "typed wrong"; else $(".answer", card).className = "answer wrong";
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" || !e.target.matches("input.typed")) return;
    e.preventDefault(); const r = e.target.closest("[data-ch],[data-or]"); const b = r && $("[data-chk],[data-och]", r); if (b) b.click();
  });

  /* ======================= Step 1 · word order ======================= */
  const ROLE = {who: ["Who?", "Qui ? (le sujet)"], verb: ["Did what?", "A fait quoi ? (le verbe)"], what: ["What? With who?", "Quoi ? Avec qui ?"], where: ["Where?", "Où ?"], when: ["When?", "Quand ?"]};
  const SYN = [
    [["Last Saturday,", "when"], ["I", "who"], ["played", "verb"], ["basketball", "what"], ["with my friends.", "what"]],
    [["We", "who"], ["walked", "verb"], ["to the park", "where"], ["after the match.", "when"]],
    [["She", "who"], ["invited", "verb"], ["us", "what"], ["to her house", "where"], ["on Sunday.", "when"]]
  ];
  const ck = (t, r) => `<span class="ck ${r}">${esc(t)}</span>`;
  function renderSyn() {
    if (!is4()) {
      $("#syn").innerHTML = rule5("word order", `<p lang="en">${ck("Who", "who")} + ${ck("did what", "verb")} + ${ck("what", "what")} + ${ck("where", "where")} + ${ck("when", "when")}.</p>
        <p lang="en">We walked to the park after the match. <i>When</i> can also go first: Last Saturday, I played basketball. <button type="button" class="listen" data-say="We walked to the park after the match. | Last Saturday, I played basketball." aria-label="Listen">▶</button></p>`);
      return;
    }
    $("#syn").innerHTML = `<div class="roles">${Object.entries(ROLE).map(([r, [en, fr]]) => `<span class="ck ${r}" title="${esc(fr)}">${en}</span>`).join("")}</div>
      ${SYN.map(s => `<p class="model" lang="en">${s.map(([t, r]) => ck(t, r)).join(" ")} <button type="button" class="listen" data-say="${esc(s.map(x => x[0]).join(" "))}" aria-label="Listen">▶</button></p>`).join("")}
      ${choice("syn1", {prompt: T("Where is the verb (<i>did what?</i>)", "Où est le verbe ?"), opts: ["Just after the subject: I played, we walked", "At the end of the sentence"], a: "Just after the subject: I played, we walked"})}
      ${choice("syn2", {prompt: T("Where can <i>when?</i> go?", "Où peut-on placer le moment ?"), opts: ["At the beginning (with a comma) or at the end", "Between the subject and the verb"], a: "At the beginning (with a comma) or at the end"})}
      ${choice("syn3", {prompt: T("<i>Where?</i> and <i>when?</i>: which one comes first?", "Le lieu et le moment : lequel vient en premier ?"), opts: ["Where, then when: to the park after the match", "When, then where: after the match to the park"], a: "Where, then when: to the park after the match"})}
      <div class="rule" data-need="syn1 syn2 syn3" hidden>
        <p><b>My rule · the order of the words</b></p>
        <p lang="en">${ck("Who", "who")} + ${ck("did what", "verb")} + ${ck("what / with who", "what")} + ${ck("where", "where")} + ${ck("when", "when")}</p>
        <p>${T("<i>When</i> can also go at the beginning, with a comma: <i>Last Saturday, I played…</i> Never put it between the verb and what follows: ✗ <i>I played on Saturday basketball.</i>", "Le moment peut aussi se placer au début, suivi d'une virgule. Jamais entre le verbe et son complément.")}</p>
      </div>`;
  }
  const BUILD = [
    {id: "b1", e: "⚽👦👧", words: ["I", "played", "football", "with my cousins", "on Saturday."], acc: ["I played football with my cousins on Saturday.", "On Saturday, I played football with my cousins."], trap: ["play"]},
    {id: "b2", e: "🎬🛋️", words: ["Last Sunday,", "we", "watched", "a film", "at home."], acc: ["Last Sunday, we watched a film at home.", "We watched a film at home last Sunday."], trap: ["watch"]},
    {id: "b3", e: "👧👵🏠", words: ["My sister", "visited", "my grandmother", "in Kourou."], acc: ["My sister visited my grandmother in Kourou."], trap: ["visit"]},
    {id: "b4", e: "🚶🏖️", words: ["We", "walked", "to the beach", "after lunch."], acc: ["We walked to the beach after lunch.", "After lunch, we walked to the beach."], trap: ["walk"]},
    {id: "b5", e: "🛏️🧹", words: ["On Saturday morning,", "I", "tidied", "my bedroom."], acc: ["On Saturday morning, I tidied my bedroom.", "I tidied my bedroom on Saturday morning."], trap: ["tidyed"]},
    {id: "b6", e: "🎧🚗", words: ["They", "listened to", "music", "in the car."], acc: ["They listened to music in the car."], trap: ["listen to"]},
    {id: "b7_4", e: "🚲🍍", words: ["Last weekend,", "my friends and I", "cycled", "to the market", "in the morning."], acc: ["Last weekend, my friends and I cycled to the market in the morning.", "My friends and I cycled to the market in the morning last weekend."], trap: ["cycle"]},
    {id: "b8_4", e: "👨‍🍳🍲", words: ["My parents", "cooked", "a big lunch", "for the family", "on Sunday."], acc: ["My parents cooked a big lunch for the family on Sunday.", "On Sunday, my parents cooked a big lunch for the family."], trap: ["cook"]}
  ];
  function renderBuild() {
    const st = stars();
    $("#bd-cons").outerHTML = st >= 3
      ? `<p class="consigne" id="bd-cons" data-fr="Écris la phrase avec les mots donnés, dans le bon ordre.">Write the sentence with these words, in the right order.</p>`
      : `<p class="consigne" id="bd-cons" data-fr="Touche les étiquettes dans le bon ordre.${st >= 2 ? " Attention : une étiquette est en trop !" : ""}">Tap the words in the right order.${st >= 2 ? " Be careful: one word is a trap!" : ""}</p>`;
    $("#build").innerHTML = pick(BUILD, "build").map(x => order(x.id, Object.assign({prompt: `<span aria-hidden="true">${x.e}</span>`, trapMsg: ["Last weekend: the verb is in the past!", "C'est le week-end dernier : le verbe est au prétérit !"]}, x))).join("");
  }

  /* ======================= Step 2 · -ed spelling ======================= */
  const RULE = {
    ed: ["Just add -ed.", "Ajoute simplement -ed."],
    d: ["The verb ends in -e: add -d only.", "Le verbe se termine par -e : ajoute seulement -d."],
    ied: ["Consonant + y: y becomes -ied.", "Consonne + y : le y devient -ied."],
    yed: ["Vowel + y: keep the y and add -ed.", "Voyelle + y : garde le y et ajoute -ed."],
    dbl: ["Short verb (consonant + vowel + consonant): double the last letter.", "Verbe court (consonne + voyelle + consonne) : double la dernière lettre."]
  };
  const ED = [
    {id: "e1", v: "play", p: "played", w: ["plaied", "playd"], r: "yed", s: "d", fr: "jouer"},
    {id: "e2", v: "watch", p: "watched", w: ["watchd", "wached"], r: "ed", s: "t", fr: "regarder"},
    {id: "e3", v: "visit", p: "visited", w: ["visitted", "visitd"], r: "ed", s: "id", fr: "rendre visite"},
    {id: "e4", v: "dance", p: "danced", w: ["danceed", "dancd"], r: "d", s: "t", fr: "danser"},
    {id: "e5", v: "invite", p: "invited", w: ["inviteed", "invitted"], r: "d", s: "id", fr: "inviter"},
    {id: "e6", v: "tidy", p: "tidied", w: ["tidyed", "tidyied"], r: "ied", s: "d", fr: "ranger"},
    {id: "e7", v: "study", p: "studied", w: ["studyed", "studed"], r: "ied", s: "d", fr: "étudier, réviser"},
    {id: "e8", v: "chat", p: "chatted", w: ["chated", "chatied"], r: "dbl", s: "id", fr: "discuter"},
    {id: "e9", v: "shop", p: "shopped", w: ["shoped", "shoppd"], r: "dbl", s: "t", fr: "faire les magasins"},
    {id: "e10", v: "stay", p: "stayed", w: ["staied", "stayd"], r: "yed", s: "d", fr: "rester"},
    {id: "e11_4", v: "plan", p: "planned", w: ["planed", "planied"], r: "dbl", s: "d", fr: "prévoir"},
    {id: "e12_4", v: "try", p: "tried", w: ["tryed", "trid"], r: "ied", s: "d", fr: "essayer"},
    {id: "e13_4", v: "enjoy", p: "enjoyed", w: ["enjoied", "enjoyd"], r: "yed", s: "d", fr: "aimer, apprécier"},
    {id: "e14_4", v: "phone", p: "phoned", w: ["phoneed", "phonned"], r: "d", s: "d", fr: "téléphoner"}
  ];
  const IPA = {t: "/t/", d: "/d/", id: "/ɪd/"};
  function renderEd() {
    if (!is4()) $("#edt").innerHTML = rule5("writing -ed", `<p lang="en">play → play<b>ed</b> · danc<b>e</b> → dance<b>d</b> · stud<b>y</b> → stud<b>ied</b> · cha<b>t</b> → cha<b>tted</b></p>`);
    else $("#edt").innerHTML = `<div class="four" lang="en">
        <div class="ex"><span class="tag2">a</span><b>play → played<br>watch → watched</b></div>
        <div class="ex"><span class="tag2">b</span><b>dance → danced<br>arrive → arrived</b></div>
        <div class="ex"><span class="tag2">c</span><b>study → studied<br>cry → cried</b></div>
        <div class="ex"><span class="tag2">d</span><b>chat → chatted<br>stop → stopped</b></div>
      </div>
      ${choice("ed1", {prompt: T("Group b: <i>dance, arrive</i> end with -e. I add…", "Groupe b : dance, arrive se terminent par -e. J'ajoute…"), opts: ["-d: danced", "-ed: danceed"], a: "-d: danced"})}
      ${choice("ed2", {prompt: T("Group c: <i>study, cry</i> end with a consonant + y. I write…", "Groupe c : consonne + y. J'écris…"), opts: ["-ied: studied", "-yed: studyed"], a: "-ied: studied"})}
      ${choice("ed3", {prompt: T("Group a: <i>play</i> ends with a vowel + y. I write…", "Groupe a : play se termine par voyelle + y. J'écris…"), opts: ["-yed: played", "-ied: plaied"], a: "-yed: played"})}
      ${choice("ed4", {prompt: T("Group d: <i>chat, stop</i> are short (consonant + vowel + consonant). I…", "Groupe d : verbes courts (consonne + voyelle + consonne). Je…"), opts: ["double the last letter: chatted", "just add -ed: chated"], a: "double the last letter: chatted"})}
      <div class="rule" data-need="ed1 ed2 ed3 ed4" hidden>
        <p><b>My rule · writing -ed</b></p>
        <p lang="en">play → play<b>ed</b> · danc<b>e</b> → dance<b>d</b> · stud<b>y</b> → stud<b>ied</b> · cha<b>t</b> → cha<b>tted</b></p>
        <p>${T("And when you read: <span class=\"snd t\">/t/</span> watched, <span class=\"snd d\">/d/</span> played, <span class=\"snd id\">/ɪd/</span> visited (after t or d only).", "Et à l'oral : /t/, /d/ ou /ɪd/ (seulement après t ou d).")}</p>
      </div>`;
    const st = stars();
    $("#edf").innerHTML = pick(ED, "ed").map(x => choice(x.id, {
      cls: "vrow", head: `<b lang="en">to ${esc(x.v)}</b>${st < 3 ? `<small>${esc(x.fr)}</small>` : ""}`,
      opts: st >= 2 ? [x.p, x.w[0], x.w[1]] : [x.p, x.w[0]], a: x.p, typed: st >= 3, placeholder: "past simple",
      after: `<span class="snd ${x.s}">${esc(x.p)} ${IPA[x.s]}</span>`,
      why: () => RULE[x.r], onOk: () => say(x.p)
    })).join("");
  }

  /* ======================= Step 3 · irregular verbs ======================= */
  const SORT = [
    {id: "so1", s: ["I ", "missed", " the bus."], a: "regular", base: "miss"},
    {id: "so2", s: ["I ", "had", " the flu."], a: "irregular", base: "have"},
    {id: "so3", s: ["I ", "went", " to the dentist."], a: "irregular", base: "go"},
    {id: "so4", s: ["I ", "arrived", " late."], a: "regular", base: "arrive"},
    {id: "so5", s: ["I ", "overslept", "."], a: "irregular", base: "oversleep"},
    {id: "so6", s: ["I ", "forgot", " my late slip."], a: "irregular", base: "forget"},
    {id: "so7", s: ["I ", "stayed", " at home."], a: "regular", base: "stay"},
    {id: "so8", s: ["I ", "woke up", " late."], a: "irregular", base: "wake up"}
  ];
  const IRR = [
    {id: "i1", v: "be", p: "was / were", acc: ["was / were", "was were", "was or were", "was", "were"], w: ["beed", "been", "be"], fr: "être", ex: "I was ill. We were tired."},
    {id: "i2", v: "have", p: "had", w: ["haved", "had had", "has"], fr: "avoir", ex: "I had the flu."},
    {id: "i3", v: "go", p: "went", w: ["goed", "gone", "go"], fr: "aller", ex: "I went to the dentist."},
    {id: "i4", v: "get up", p: "got up", w: ["getted up", "gotten up", "get up"], fr: "se lever", ex: "I got up late."},
    {id: "i5", v: "wake up", p: "woke up", w: ["waked up", "woken up", "wake up"], fr: "se réveiller", ex: "I woke up at ten."},
    {id: "i6", v: "forget", p: "forgot", w: ["forgetted", "forgotten", "forget"], fr: "oublier", ex: "I forgot my late slip."},
    {id: "i7", v: "take", p: "took", w: ["taked", "taken", "take"], fr: "prendre", ex: "I took the bus."},
    {id: "i8", v: "come", p: "came", w: ["comed", "come", "come"], fr: "venir", ex: "The bus came late."},
    {id: "i9", v: "see", p: "saw", w: ["seed", "seen", "see"], fr: "voir", ex: "We saw a film."},
    {id: "i10", v: "eat", p: "ate", w: ["eated", "eaten", "eat"], fr: "manger", ex: "We ate pizza."},
    {id: "i11_4", v: "leave", p: "left", w: ["leaved", "lefted", "leave"], fr: "partir, laisser", ex: "I left my bag at home."},
    {id: "i12_4", v: "lose", p: "lost", w: ["losed", "losted", "lose"], fr: "perdre", ex: "We lost the match."},
    {id: "i13_4", v: "break", p: "broke", w: ["breaked", "broken", "break"], fr: "casser", ex: "I broke my arm."},
    {id: "i14_4", v: "oversleep", p: "overslept", w: ["oversleeped", "oversleept", "oversleep"], fr: "ne pas se réveiller à temps", ex: "I overslept on Monday."},
    {id: "i15_4", v: "meet", p: "met", w: ["meeted", "meet", "meet"], fr: "retrouver, rencontrer", ex: "I met my friends at the market."},
    {id: "i16_4", v: "buy", p: "bought", w: ["buyed", "brought", "buy"], fr: "acheter", ex: "I bought a new T-shirt."}
  ];
  function renderIrr() {
    const st = stars();
    if (!is4()) $("#sort").innerHTML = `<p class="gapq" lang="en"><b>Box:</b> ate · forgot · got up · had · saw · took · was / were · went</p>`;
    else $("#sort").innerHTML = `<p class="gapq">${T("Regular (-ed) or irregular?", "Régulier (-ed) ou irrégulier ?")}</p>` + SORT.map(x => choice(x.id, {
      cls: "qrow sortrow", prompt: `<span lang="en">${esc(x.s[0])}<b>${esc(x.s[1])}</b>${esc(x.s[2])}</span>`, opts: ["regular", "irregular"], a: x.a, fixed: true,
      after: `<i lang="en">${esc(x.base)} → ${esc(x.s[1])}</i>`,
      why: () => x.a === "regular" ? ["Look: it ends in -ed.", "Regarde : il se termine par -ed."] : ["No -ed here: the verb changes.", "Pas de -ed ici : le verbe change."],
      onOk: () => say(x.s.join(""))
    })).join("") + `<div class="rule" data-need="${SORT.map(x => x.id).join(" ")}" hidden><p><b>${T("Irregular verbs don't take -ed: they change. Learn them by heart!", "Les verbes irréguliers ne prennent pas -ed : ils changent. Apprends-les par cœur !")}</b></p></div>`;
    $("#irr").innerHTML = pick(IRR, "irr").map(x => {
      const traps = st >= 2 ? [x.w[0], is4() ? x.w[1] : x.w[2]] : [x.w[0]];
      return choice(x.id, {
        cls: "vrow", head: `<b lang="en">to ${esc(x.v)}</b>${st < 3 ? `<small>${esc(x.fr)}</small>` : ""}`,
        opts: [...new Set([x.p].concat(traps))].filter((o, i) => i === 0 || o !== x.p), a: x.p, acc: x.acc, typed: st >= 3, placeholder: "past simple",
        after: `<i lang="en">${esc(x.ex)}</i>`,
        why: g => norm(g) === norm(x.w[1]) && is4() ? [`${g}: that's the past participle (I've ${g}). The past simple?`, `${g}, c'est le participe passé. Et le prétérit ?`] : norm(g).endsWith("ed") ? ["Irregular verb: no -ed!", "Verbe irrégulier : pas de -ed !"] : null,
        onOk: () => say(x.ex)
      });
    }).join("");
  }

  /* ======================= Step 4 · negative ======================= */
  const NEG = [
    {id: "g1", pos: "I played tennis.", ans: "I didn't play tennis.", w: ["I didn't played tennis.", "I not played tennis."], past: "played"},
    {id: "g2", pos: "We watched TV.", ans: "We didn't watch TV.", w: ["We didn't watched TV.", "We don't watched TV."], past: "watched"},
    {id: "g3", pos: "She went to the cinema.", ans: "She didn't go to the cinema.", w: ["She didn't went to the cinema.", "She not went to the cinema."], past: "went"},
    {id: "g4", pos: "I had breakfast.", ans: "I didn't have breakfast.", w: ["I didn't had breakfast.", "I hadn't breakfast."], past: "had"},
    {id: "g5", pos: "They stayed at home.", ans: "They didn't stay at home.", w: ["They didn't stayed at home.", "They not stayed at home."], past: "stayed"},
    {id: "g6", pos: "He got up early.", ans: "He didn't get up early.", w: ["He didn't got up early.", "He not got up early."], past: "got"},
    {id: "g7_4", pos: "I was at home.", ans: "I wasn't at home.", w: ["I didn't be at home.", "I didn't was at home."], past: "didn't"},
    {id: "g8_4", pos: "We were tired.", ans: "We weren't tired.", w: ["We didn't were tired.", "We wasn't tired."], past: "didn't"},
    {id: "g9_4", pos: "I forgot my homework.", ans: "I didn't forget my homework.", w: ["I didn't forgot my homework.", "I not forgot my homework."], past: "forgot"}
  ];
  const tok = s => s.replace(/[.?]$/, "").split(" ").map((w, i, a) => i === a.length - 1 ? w + s.slice(-1) : w);
  function renderNeg() {
    if (!is4()) $("#negt").innerHTML = rule5("the negative", `<p lang="en"><b>didn't + base verb:</b> We didn't watch TV. ✗ <s>didn't watched</s></p>`);
    else $("#negt").innerHTML = `<p class="quote" lang="en">We <b>didn't watch</b> TV and we <b>didn't go</b> home early. <button type="button" class="listen" data-say="We didn't watch TV and we didn't go home early." aria-label="Listen">▶</button></p>
      ${choice("n1", {prompt: T("After <i>didn't</i>, the verb is…", "Après didn't, le verbe est…"), opts: ["the base verb: watch, go", "in the past: watched, went"], a: "the base verb: watch, go"})}
      ${choice("n2", {prompt: T("<i>didn't</i> is the short form of…", "didn't est la forme courte de…"), opts: ["did not", "do not"], a: "did not"})}
      ${is4() ? choice("n3_4", {prompt: T("And with <i>be</i>? <i>I was late.</i> → I…", "Et avec be ? I was late. → I…"), opts: ["wasn't late", "didn't be late"], a: "wasn't late"}) : ""}
      <div class="rule" data-need="n1 n2${is4() ? " n3_4" : ""}" hidden>
        <p><b>My rule · the negative</b></p>
        <p lang="en"><b>didn't</b> (= did not) + <b>base verb</b>: I didn't play, she didn't go. ✗ <s>didn't played</s></p>
        ${is4() ? `<p lang="en">${T("With <b>be</b>: I <b>wasn't</b>, we <b>weren't</b> (no didn't!).", "Avec be : wasn't, weren't (sans didn't !).")}</p>` : ""}
      </div>`;
    const st = stars();
    $("#neg").innerHTML = pick(NEG, "neg").map(x => {
      const pr = `<span class="pos" lang="en">${esc(x.pos)}</span> → ❌`;
      if (st < 2) return `<div class="card">${choice(x.id, {prompt: pr, opts: [x.ans].concat(x.w), a: x.ans, why: g => /didn't \w+ed\b|didn't (went|had|got|forgot|was|were)/.test(g) ? ["After didn't: the base verb!", "Après didn't : la base verbale !"] : null})}</div>`;
      return order(x.id, {prompt: pr, words: tok(x.ans), acc: [x.ans], trap: st >= 2 && x.past !== "didn't" ? [x.past] : x.past === "didn't" ? ["didn't"] : [], noHint: true, placeholder: "Write the negative sentence",
        trapMsg: x.past === "didn't" ? ["With be: wasn't / weren't, no didn't!", "Avec be : wasn't / weren't, sans didn't !"] : ["After didn't: the base verb!", "Après didn't : la base verbale !"]});
    }).join("");
  }

  /* ======================= Step 5 · questions ======================= */
  const QO = [
    {id: "o1", words: ["Did", "you", "play", "basketball", "last weekend?"], acc: ["Did you play basketball last weekend?"], trap: ["played"]},
    {id: "o2", words: ["What", "did", "you", "do", "on Saturday?"], acc: ["What did you do on Saturday?", "On Saturday, what did you do?"], trap: ["does"]},
    {id: "o3", words: ["Where", "did", "you", "go?"], acc: ["Where did you go?"], trap: ["went"]},
    {id: "o4", words: ["Did", "you", "watch", "a film?"], acc: ["Did you watch a film?"], trap: ["watched"]},
    {id: "o5", words: ["Who", "did", "you", "see?"], acc: ["Who did you see?"], trap: ["saw"]},
    {id: "o6_4", words: ["What time", "did", "you", "get up?"], acc: ["What time did you get up?"], trap: ["got"]},
    {id: "o7_4", words: ["Was", "it", "fun?"], acc: ["Was it fun?"], trap: ["Did"]}
  ];
  const QA = [
    {id: "a1", q: "Did you go to the beach?", m: "✅", a: "Yes, I did.", w: ["Yes, I went.", "Yes, I do."]},
    {id: "a2", q: "Did you watch TV?", m: "❌", a: "No, I didn't.", w: ["No, I don't.", "No, I not watched."]},
    {id: "a3", q: "Did your friends come?", m: "✅", a: "Yes, they did.", w: ["Yes, they came did.", "Yes, they do."]},
    {id: "a4", q: "Did you have a good weekend?", m: "✅", a: "Yes, I did.", w: ["Yes, I had.", "Yes, I have."]},
    {id: "a5_4", q: "Were you tired?", m: "❌", a: "No, I wasn't.", w: ["No, I didn't.", "No, I weren't."]}
  ];
  function renderQ() {
    if (!is4()) $("#qt").innerHTML = rule5("questions", `<p lang="en"><b>Did you + base verb…?</b> ↗ · <b>What did you + base verb?</b> ↘ · Yes, I did. / No, I didn't. <button type="button" class="listen" data-say="Did you play basketball last weekend? | What did you do?" aria-label="Listen">▶</button></p>`);
    else $("#qt").innerHTML = `<p class="quote" lang="en">And you? <b>Did you play</b> basketball last weekend? ↗ <b>What did you do</b>? ↘ <button type="button" class="listen" data-say="And you? | Did you play basketball last weekend? | What did you do?" aria-label="Listen">▶</button></p>
      ${choice("q1", {prompt: T("After <i>Did you…</i>, the verb is…", "Après Did you…, le verbe est…"), opts: ["the base verb: play, do", "in the past: played, did"], a: "the base verb: play, do"})}
      ${choice("q2", {prompt: T("<i>Did you play…?</i> The short answer is…", "La réponse courte est…"), opts: ["Yes, I did. / No, I didn't.", "Yes, I played. / No, I not."], a: "Yes, I did. / No, I didn't."})}
      ${choice("q3", {prompt: T("Listen. <i>What did you do?</i> My voice…", "Écoute. Pour What did you do?, ma voix…"), opts: ["goes down ↘", "goes up ↗"], a: "goes down ↘", after: T("<i>Did you…?</i> (yes / no) ↗ · <i>What…? Where…? Who…?</i> ↘", "Question fermée : la voix monte. Question avec un mot interrogatif : elle descend.")})}
      <div class="rule" data-need="q1 q2 q3" hidden>
        <p><b>My rule · questions</b></p>
        <p lang="en"><b>Did</b> + you + <b>base verb</b> …? ↗ · <b>What / Where / Who</b> + did + you + <b>base verb</b>? ↘</p>
        <p lang="en">Yes, I did. / No, I didn't.</p>
      </div>`;
    $("#qo").innerHTML = pick(QO, "qo").map(x => order(x.id, Object.assign({trapMsg: ["After did: the base verb!", "Après did : la base verbale !"], placeholder: "Write the question"}, x))).join("");
    $("#qa").hidden = !is4();
    if (!is4()) { $("#qa").innerHTML = ""; return; }
    $("#qa").innerHTML = `<p class="gapq">${T("Answer with a short answer.", "Réponds par une réponse courte.")}</p>` + keep(QA).map(x => choice(x.id, {prompt: `<span lang="en">👩 ${esc(x.q)}</span> <span aria-label="${x.m === "✅" ? "yes" : "no"}">${x.m}</span>`, opts: [x.a].concat(x.w), a: x.a, onOk: () => say([x.q, x.a])})).join("");
  }

  /* ======================= Step 6 · linking words ======================= */
  const CX5 = [["First", "to start", "d'abord"], ["Then", "next", "ensuite"], ["Finally", "to finish", "enfin"], ["and", "to add", "et"], ["but", "the opposite", "mais"], ["because", "the cause", "parce que"], ["so", "the consequence", "donc"]];
  const CX4 = [["After that", "next", "après"], ["because of", "+ a noun: the cause", "à cause de"], ["That's why", "the consequence", "c'est pourquoi"]];
  const GAP5 = ["Last Saturday, I got up late", {id: "p1_5", a: "because", o: ["so"]}, "I was tired.", {id: "p2_5", a: "First", o: ["Finally"]}, ", I had breakfast.", {id: "p3_5", a: "Then", o: ["But"]}, "we played football. It started to rain,", {id: "p4_5", a: "so", o: ["because"]}, "we went home. It was fun,", {id: "p5_5", a: "but", o: ["so"]}, "I didn't do my homework!"];
  const GAP4 = ["Last weekend, I didn't go out", {id: "c1_4", a: "because of", o: ["because", "so"]}, "the rain.", {id: "c2_4", a: "First", o: ["Finally", "That's why"]}, ", I tidied my bedroom.", {id: "c3_4", a: "After that", o: ["Because of", "But"]}, ", I phoned my friend Léa,", {id: "c4_4", a: "but", o: ["so", "because of"]}, "she didn't answer. I was bored.", {id: "c5_4", a: "That's why", o: ["Because of", "Because"]}, "I made a chocolate cake!", {id: "c6_4", a: "Then", o: ["Because", "First"]}, "my cousins arrived,", {id: "c7_4", a: "so", o: ["because", "but"]}, "we ate the cake together. It was a great weekend", {id: "c8_4", a: "because", o: ["because of", "so"]}, "we laughed a lot."];
  const plain = g => g.map(x => typeof x === "string" ? x : x.a).join(" ").replace(/ ,/g, ",");
  function renderGap() {
    $("#cx").innerHTML = CX5.concat(is4() ? CX4 : []).map(([w, en, fr]) => `<span class="cx"><b lang="en">${esc(w)}</b><span>${esc(en)}</span>${stars() < 3 ? `<small>${esc(fr)}</small>` : ""}</span>`).join("");
    const G = is4() ? GAP4 : GAP5, st = stars(), ids = G.filter(x => typeof x !== "string").map(x => x.id);
    $("#gap").innerHTML = `<p class="gaptext" lang="en">${G.map(x => {
      if (typeof x === "string") return esc(x);
      IDS.push(x.id); const ok = S.res[x.id];
      const opts = shuffle([x.a].concat(st >= 2 ? x.o : x.o.slice(0, 1)));
      return `<select data-gap="${x.id}" aria-label="linking word"${ok ? ` class="right" disabled` : ""}>${ok ? `<option>${esc(x.a)}</option>` : `<option value="">…</option>${opts.map(o => `<option>${esc(o)}</option>`).join("")}`}</select>`;
    }).join(" ").replace(/<\/select> ,/g, "</select>,")}</p><p class="fb" id="gap-fb"></p>
      <div class="actions" data-need="${ids.join(" ")}" hidden><span class="done-tag" style="margin:0">✓</span><button type="button" class="listen" data-say="${esc(plain(G))}">▶ Listen to the text</button></div>`;
  }
  document.addEventListener("change", e => {
    const s = e.target.closest("select[data-gap]"); if (!s || !s.value) return;
    const G = is4() ? GAP4 : GAP5, x = G.find(g => g.id === s.dataset.gap), f = $("#gap-fb");
    if (s.value === x.a) { s.className = "right"; s.disabled = true; f.textContent = ""; done(x.id); refreshRules(); }
    else { s.className = "wrong"; f.className = "fb bad"; f.innerHTML = T("Not this one: read the sentence again. Cause, consequence, order or opposite?", "Pas celui-là : relis la phrase. Cause, conséquence, ordre ou opposition ?"); }
  });

  /* ======================= Step 7 · write 30 words ======================= */
  const IRRP = "was were had went got woke forgot took came saw ate left lost broke overslept slept met bought made ran swam rode drank sang gave wrote flew won felt found told said thought drove built caught taught sat spent began brought heard kept knew became fell chose threw wore stood understood did".split(" ");
  const NOT_ED = "tired bored excited interested scared worried surprised amazed annoyed disappointed frightened need speed hundred naked wicked".split(" ");
  const CONN = [["first", /\bfirst(ly)?\b/], ["then", /\bthen\b/], ["after that", /\bafter that\b/], ["finally", /\bfinally\b/], ["and", /\band\b/], ["but", /\bbut\b/], ["because", /\bbecause\b(?! of)/], ["so", /\bso\b/], ["because of", /\bbecause of\b/], ["that's why", /\bthat'?s why\b|\bthat is why\b/]];
  const MIN = 28, MAX = 40, GOAL = 30;
  function analyse(txt) {
    const t = " " + String(txt || "").replace(/[’‘`]/g, "'").toLowerCase() + " ";
    const words = String(txt || "").split(/\s+/).filter(w => /[a-zA-Zà-ÿ]/.test(w));
    const toks = t.replace(/[^a-z' ]+/g, " ").split(/\s+/).filter(Boolean);
    const reg = new Set(), irr = new Set(), warn = [];
    toks.forEach((w, i) => {
      const prev = toks[i - 1] || "", next = toks[i + 1] || "", afterDid = /^(did|didn't|didnt)$/.test(prev) || /^(did|didn't|didnt)$/.test(toks[i - 2] || "");
      if (afterDid) return; // "didn't went", "did you played": a mistake (warned below), not a past verb
      if (w.length >= 4 && w.endsWith("ed") && !NOT_ED.includes(w)) reg.add(w);
      if (IRRP.includes(w) && !(w === "did" && /^(you|i|he|she|we|they|it|your|my|not)$/.test(next)) && !/^(to)$/.test(prev)) irr.add(w);
    });
    const negs = (t.match(/\b(didn't|did not|wasn't|weren't|was not|were not)\b/g) || []).length;
    (t.match(/\b(?:didn't|did not)\s+([a-z]+)/g) || []).forEach(m => { const v = m.split(/\s+/).pop(); if ((v.length >= 4 && v.endsWith("ed") && v !== "need") || IRRP.includes(v)) warn.push([`<b>${esc(m)}</b> → after didn't, the base verb (didn't play, didn't go).`, "Après didn't : la base verbale."]); });
    (t.match(/\bdid\s+(?:you|he|she|they|we|it|your \w+)\s+([a-z]+)/g) || []).forEach(m => { const v = m.split(/\s+/).pop(); if ((v.length >= 4 && v.endsWith("ed")) || IRRP.includes(v)) warn.push([`<b>${esc(m)}</b> → after did, the base verb (Did you play…?).`, "Après did : la base verbale."]); });
    const PRES = ["go", "play", "watch", "eat", "see", "visit", "stay", "walk", "take", "get", "wake", "have", "do"];
    const past = /\b(last|yesterday|on (saturday|sunday))\b/.test(t);
    toks.forEach((w, i) => { if (past && /^(i|we|they)$/.test(w) && PRES.includes(toks[i + 1] || "") && !/^(did|didn't|do|don't|can|will|to|you)$/.test(toks[i - 1] || "") && !warn.some(x => x.pres)) { const m = (w === "i" ? "I" : w) + " " + toks[i + 1]; warn.push(Object.assign([`<b>${esc(m)}</b> → it's last weekend: use the past simple (I went, I played…).`, "C'est le week-end dernier : utilise le prétérit."], {pres: 1})); } });
    const qs = (String(txt || "").match(/[^.!?]*\?/g) || []).filter(q => /\b(did|was|were|what|where|who|when|how|why)\b/i.test(q) && q.trim().split(/\s+/).length >= 3);
    const conns = CONN.filter(([, r]) => r.test(t)).map(([w]) => w);
    const time = /\b(last (weekend|saturday|sunday|friday|week|night)|on (saturday|sunday|friday)|yesterday|at the weekend)\b/.test(t);
    const four = is4();
    const items = [
      {id: "len", ok: words.length >= MIN && words.length <= MAX, en: `About ${GOAL} words (${MIN} to ${MAX})`, fr: `Environ ${GOAL} mots (de ${MIN} à ${MAX})`, d: `${words.length} words`},
      {id: "time", ok: time, en: "When? last weekend, on Saturday…", fr: "Quand ? last weekend, on Saturday…"},
      {id: "reg", ok: reg.size >= 2, en: "2 regular verbs in -ed", fr: "2 verbes réguliers en -ed", d: [...reg].join(", ")},
      {id: "irr", ok: irr.size >= (four ? 2 : 1), en: four ? "2 irregular verbs (went, had, saw…)" : "1 irregular verb (went, had, saw…)", fr: four ? "2 verbes irréguliers" : "1 verbe irrégulier", d: [...irr].join(", ")},
      {id: "neg", ok: negs >= 1, en: four ? "1 negative (didn't…, wasn't…)" : "1 negative (didn't + verb)", fr: "1 phrase négative"},
      {id: "q", ok: qs.length >= 1, en: "1 question (Did you…? What did you…?)", fr: "1 question"},
      {id: "con", ok: four ? conns.length >= 3 && conns.some(c => c === "because of" || c === "that's why") : conns.length >= 2, en: four ? "3 linking words, with because of or That's why" : "2 linking words (first, then, but, because, so…)", fr: four ? "3 mots de liaison, dont because of ou That's why" : "2 mots de liaison", d: conns.join(", ")}
    ];
    return {n: words.length, items, warn, all: items.every(i => i.ok) && !warn.length};
  }
  const MODEL = {
    "5e": "No, I didn't play basketball last weekend. On Saturday, I went to the beach with my cousins and we played volleyball. Then it started to rain, so we watched a film. What did you do?",
    "4e": "Yes, I did! Last Saturday, I played basketball, but we lost the match because of the referee. Then we were hungry, so we walked to a pizzeria. I didn't go to bed late. Did you have a nice weekend?"
  };
  function renderWrite() {
    IDS.push("w1");
    const st = stars(), lv = L(), txt = S.txt[lv] || "";
    const frame = `<div><b>${T("Sentence starters", "Débuts de phrases")}</b><ul lang="en"><li>Yes, I did. / No, I didn't play basketball.</li><li>Last weekend, I… / On Saturday, I…</li><li>First, … Then, … ${is4() ? "After that, … " : ""}Finally, …</li><li>It was great / fun / boring${is4() ? ", because of…" : "."}</li><li>And you? Did you…? / What did you…?</li></ul></div>`;
    const bank = `<div><b>${T("Word bank", "Banque de mots")}</b><div class="bk" lang="en">${["played", "watched", "visited", "stayed", "tidied", "chatted", "went", "had", "saw", "ate", "got up", "woke up", "came", "took"].concat(is4() ? ["met", "bought", "lost", "left"] : []).map(w => `<span>${w}</span>`).join("")}</div><div class="bk" lang="en">${["first", "then", "after that", "finally", "and", "but", "because", "so"].concat(is4() ? ["because of", "That's why"] : []).map(w => `<span>${w}</span>`).join("")}</div></div>`;
    $("#write").innerHTML = `<h3>${T("Answer the text in 30 words", "Réponds au texte en 30 mots")}</h3>
      <p class="quote" lang="en">“… And you? Did you play basketball last weekend? What did you do?” <button type="button" class="listen" data-say="And you? | Did you play basketball last weekend? | What did you do?" aria-label="Listen">▶</button></p>
      <p class="consigne" data-fr="Réponds à la question (oui ou non), puis raconte ton week-end : ce que tu as fait, et ce que tu n'as pas fait. Termine par une question à ton camarade. Utilise tout ce que tu as appris dans les étapes 1 à 6.">Answer the question (yes or no), then tell us about your weekend: what you did, and what you didn't do. End with a question to your friend. Use everything from steps 1 to 6.</p>
      ${st >= 3 ? "" : `<div class="help">${st < 2 ? frame : ""}${bank}</div>`}
      <label class="wc" id="wc"><span class="n" id="wn">0</span><span>/ ${GOAL} words</span><span class="bar" aria-hidden="true"><span id="wbar"></span><i></i></span></label>
      <textarea class="wr" id="wtxt" lang="en" spellcheck="false" aria-label="My text" placeholder="Last weekend, I…">${esc(txt)}</textarea>
      <ul class="checks" id="wchk"></ul>
      <ul class="warns" id="wwarn"></ul>
      <div class="bravo" id="wbravo" hidden>${T("🎉 Well done! Your text has everything. Read it again, listen to it, then download it for Pronote.", "Bravo ! Ton texte a tout ce qu'il faut. Relis-le, écoute-le, puis télécharge-le pour Pronote.")}</div>
      <div class="actions" id="wact"><button type="button" class="listen" id="wsay">▶ Listen to my text</button></div>
      <details class="ex2"><summary>${T("See an example", "Voir un exemple")}</summary><p lang="en">${esc(MODEL[lv])}</p><button type="button" class="listen" data-say="${esc(MODEL[lv])}">▶ Listen</button><small> · ${analyse(MODEL[lv]).n} words</small></details>`;
    if (window.ExportPDF) $("#wact").appendChild(ExportPDF.button("📄 My text in PDF, for Pronote", () => ({
      title: "What did you do last weekend?", file: "My-weekend",
      intro: "Ton texte se télécharge en PDF, avec ta liste de vérification. Dépose-le ensuite sur Pronote.",
      build(d) {
        const a = analyse($("#wtxt").value), tx = $("#wtxt").value.trim();
        d.h("What did you do last weekend?", 17);
        d.p([["“… And you? Did you play basketball last weekend? What did you do?”", "I"]], {size: 11, gray: true, gap: 10});
        d.p(tx || "(no text)", {size: 13, lead: 1.9, gap: 6});
        d.p([[`${a.n} words`, "B"]], {size: 10.5, gap: 12});
        d.h("My checklist", 12.5);
        a.items.forEach(i => d.p([[i.ok ? "[x]  " : "[  ]  ", "B"], [i.en, "R"]], {size: 10.5, gap: 1}));
        if (a.warn.length) { d.space(6); d.h("To check", 12); a.warn.forEach(w => d.p(w[0].replace(/<[^>]+>/g, ""), {size: 10.5, gap: 1})); }
      }
    })));
    check();
  }
  let tmo = null;
  function check() {
    const box = $("#wtxt"); if (!box) return;
    const a = analyse(box.value);
    $("#wn").textContent = a.n;
    $("#wbar").style.width = Math.min(100, 100 * a.n / 45) + "%";
    $("#wc").className = "wc" + (a.n > MAX ? " over" : a.n >= MIN ? " good" : "");
    $("#wchk").innerHTML = a.items.map(i => `<li class="${i.ok ? "ok" : ""}"><span class="m" role="img" aria-label="${i.ok ? "done" : "to do"}">${i.ok ? "✓" : ""}</span><span>${T(esc(i.en), i.fr)}${i.d ? `<small lang="en">${esc(i.d)}</small>` : ""}</span></li>`).join("");
    $("#wwarn").innerHTML = a.warn.map(w => `<li>⚠️ ${T(w[0], w[1])}</li>`).join("") + (a.n > MAX ? `<li>⚠️ ${T(`Too long: ${a.n} words. Keep about ${GOAL}!`, `Trop long : garde environ ${GOAL} mots.`)}</li>` : "");
    $("#wbravo").hidden = !a.all || a.n > MAX;
    if (a.all && a.n <= MAX && !S.res.w1) done("w1");
  }
  document.addEventListener("input", e => {
    if (e.target.id !== "wtxt") return;
    S.txt[L()] = e.target.value; clearTimeout(tmo); tmo = setTimeout(() => { save(); }, 300); check();
  });
  document.addEventListener("click", e => { if (e.target.closest("#wsay")) { const v = $("#wtxt").value.trim(); if (v) say(v.split(/(?<=[.!?])\s+/)); } });

  /* ---------- level and version boxes ---------- */
  function renderLevel() {
    const k = K(), st = stars(), imp = imposed();
    $$("[data-st]").forEach(b => { b.setAttribute("aria-pressed", +b.dataset.st === st); b.disabled = imp; });
    $("#lvl-msg").innerHTML = k && k.admin ? "Mode professeur : choisissez le niveau et la version à prévisualiser."
      : imp ? T(`Your level, chosen by your teacher: ${"★".repeat(st)}.`, `Ton niveau, choisi par ton professeur : ${"★".repeat(st)}.`)
      : T("Free level: choose your challenge. ★ choices · ★★ choices + traps · ★★★ you write.", "Niveau libre : choisis ton défi. ★ choix · ★★ choix et pièges · ★★★ tu écris toi-même.");
    $("#ver-box").hidden = !admin();
    $$("[data-ver]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ver === L()));
  }
  $("#lvl-box").addEventListener("click", e => {
    const b = e.target.closest("[data-st]"), v = e.target.closest("[data-ver]");
    if (v && admin()) { S.ver = v.dataset.ver; save(); renderAll(true); return; }
    if (!b || b.disabled) return;
    if (admin()) S.pv = +b.dataset.st; else S.free = +b.dataset.st;
    save(); renderAll(true); document.dispatchEvent(new CustomEvent("level:change"));
  });
  const CONS5 = {h1s: ["Read the rule, then put the words in order.", "Lis la règle, puis remets les mots dans l'ordre."],
    h2s: ["Read the rule, then write the past simple.", "Lis la règle, puis écris le prétérit."],
    h3s: ["Write the past simple with the words in the box.", "Écris le prétérit avec les mots de la boîte."],
    h4s: ["Read the rule, then make the sentences negative.", "Lis la règle, puis mets les phrases à la forme négative."],
    h5s: ["Read the rule, then put the words in order.", "Lis la règle, puis remets les mots dans l'ordre."],
    h6s: ["Choose the right word.", "Choisis le bon mot."]};
  function renderCons() {
    Object.entries(CONS5).forEach(([h, [en, fr]]) => {
      const sec = $(`section[aria-labelledby="${h}"]`), ins = $$(":scope > .instr", sec), p = $(".consigne", ins[0]);
      if (!sec.dataset.orig) sec.dataset.orig = JSON.stringify([p.textContent, p.dataset.fr || ""]);
      const [oen, ofr] = JSON.parse(sec.dataset.orig), five = !is4();
      p.outerHTML = `<p class="consigne" data-fr="${esc(five ? fr : ofr)}">${esc(five ? en : oen)}</p>`;
      if (h === "h3s" && ins[1]) ins[1].hidden = five;
    });
    const n = $("#sheet5"); if (n) n.hidden = is4();
  }
  let lastSig = null;
  function renderAll(force) {
    renderLevel();
    const sig = stars() + L(); if (!force && sig === lastSig) return; lastSig = sig;
    IDS = [];
    renderCons(); renderSyn(); renderBuild(); renderEd(); renderIrr(); renderNeg(); renderQ(); renderGap(); renderWrite();
    refreshRules(); progress();
    if (window.Consigne && Consigne.refresh) Consigne.refresh();
    if (window.SiteArt) $$("[data-art]").forEach(SiteArt.draw);
  }
  if (C()) C().mountPicker($("#class-box"));
  renderAll(true);
  document.addEventListener("classes:ready", () => renderAll());
  document.addEventListener("classes:change", () => renderAll());
  try { speechSynthesis.getVoices(); } catch (e) {}
})();
