/* The current sequence: its steps, the learner's progress in each tool (read from that tool's own saved state),
   and the rendering for (1) the sequence page, (2) the home page card, (3) the step navigation inside each tool.
   Tool pages load this script with data-step="<step id>". */
(function () {
  const me = document.currentScript;
  const base = new URL("..", me ? me.src : location.href);
  const url = p => new URL(p, base).href;

  const SEQ5 = {
    id: "late-and-absent", title: "Late and absent", level: "5e", axis: "Axe 4 · École et loisirs", href: "late-and-absent/",
    // Evaluations stay locked until the teacher unlocks them for a class (classes.json → evals)
    evals: [
      {id: "ed-final", href: "ed-sounds/#eval", art: "ed", title: "Évaluation orale : le prétérit",
        what: "Lis un court texte au prétérit à voix haute, enregistre-toi, puis rends le fichier sur Pronote."}
    ],
    // Steps in order. Each one stays locked until the teacher opens it for a class (classes.json → open).
    steps: [
      {id: "note", href: "fill-the-note/", art: "note", title: "Fill in the note",
        what: "Écoute les dialogues du collège en autonomie et remplis les billets : late slip, absence note ou permission note. 5e : dialogues 1 à 3 · 4e : les 6 dialogues.",
        skills: ["Compréhension orale", "Intonation", "because"], key: "fillnote",
        // 5e: 3 situations + 3 dialogues x 3 activities + bilan = 13 ; 4e: 3 + 6 x 3 + 1 = 22
        total: s => s.lvl === "4e" ? 22 : 13,
        count: s => Object.keys(s.res || {}).filter(k => s.lvl === "4e" || !/^[lqw][456]$/.test(k)).length},
      {id: "ed", href: "ed-sounds/", art: "ed", title: "The sounds of -ed",
        what: "Le prétérit : /t/, /d/ ou /ɪd/ ? Puis la négation (didn't) et les questions (Did…?), avec de vraies voix. Entraîne-toi, puis passe l'évaluation finale.",
        skills: ["Prétérit", "Prononciation"], key: "edlab5e-real", total: 19},
      {id: "so", href: "can-you-explain/", art: "so", title: "Can you explain?",
        what: "Lesson 2: revise the excuses, recap the notes, find the rule (cause and consequence), recreate the situations, then play against the clock. Homework at the end.",
        skills: ["Cause / consequence", "Past simple", "Game"], key: "becauseso", total: 21},
      {id: "bus", href: "late-bus/", art: "bus", title: "Blame the bus!",
        what: "Un vrai article de presse britannique sur les retards à Londres. Lis-le, écoute-le, puis entraîne-toi sur ses verbes en -ed.",
        skills: ["Lecture", "Document authentique", "Royaume-Uni"], key: "latebus5e", total: 12},
      {id: "excuse", href: "excuse-lab/", art: "excuse", title: "Recap: Excuse Lab",
        what: "Pour finir la séquence : reprends toutes les excuses et les vraies voix des dialogues. Écoute, répète en respectant l'accent des mots et le rythme des phrases, puis joue la scène.",
        skills: ["Récapitulatif", "Accent et rythme", "Jouer la scène"], key: "excuselab4e", total: 27,
        count: s => Object.keys(s.res || {}).filter(k => !k.startsWith("play")).length}
    ]
  };

  // The 4e version: the same lessons (shared pages adapt to the 4e class code), plus the present perfect
  // of the "constat" (I've forgotten my exercise book) and a 4e version of Blame the bus!. Only 4e codes see it.
  const S5 = id => SEQ5.steps.find(x => x.id === id);
  const SEQ4 = {
    id: "late-and-absent-4e", title: "Late and absent", level: "4e", axis: "Axe 4 · École et loisirs", href: "late-and-absent-4e/",
    evals: SEQ5.evals,
    steps: [
      Object.assign({}, S5("note"), {total: () => 22, count: s => Object.keys(s.res || {}).length, what: "Écoute les six dialogues du collège en autonomie et remplis les billets : late slip, absence note ou permission note. Repère les questions et le question tag « weren't you? »."}),
      S5("ed"),
      S5("so"),
      {id: "have", href: "what-have-you-done/", art: "have", title: "Oh no, I've forgotten it!",
        what: "Nouveau en 4e : have + participe passé pour faire un constat. « I've forgotten my exercise book », « I haven't finished my homework ». Observe, trouve la règle, puis entraîne-toi.",
        skills: ["Present perfect", "Constat", "Participes passés"], key: "pp4e", total: 35},
      {id: "bus", href: "late-bus-4e/", art: "bus", title: "Blame the bus! (4e)",
        what: "Le vrai article de presse britannique, en version 4e : plus long, avec le present perfect. Lis-le, écoute-le, puis entraîne-toi sur ses verbes en -ed.",
        skills: ["Lecture", "Present perfect", "Royaume-Uni"], key: "latebus4e", total: 16},
      Object.assign({}, S5("excuse"), {what: "Pour finir la séquence : reprends toutes les excuses et les vraies voix des dialogues. Écoute, répète en respectant l'accent et le rythme, puis joue la scène. Ajoute un constat au present perfect dans ta scène !"})
    ]
  };
  const SEQS = [SEQ5, SEQ4];
  const C = () => window.Classes;
  const klassNow = () => (C() && C().klass ? C().klass() : null);
  const is4e = () => { const k = klassNow(); return !!(k && !k.admin && k.level === "4e"); };
  // Which sequence this page shows: forced by the page (data-seq), else the learner's class (4e → the 4e version)
  const forcedId = (me && me.dataset.seq) || ((document.getElementById("seq-steps") || {}).dataset || {}).seq || "";
  const pick = () => forcedId ? (SEQS.find(x => x.id === forcedId) || SEQ5) : (is4e() ? SEQ4 : SEQ5);
  let SEQ = pick();

  function prog(st) {
    let raw = null, s = {};
    try { raw = localStorage.getItem(st.key); s = JSON.parse(raw || "{}") || {}; } catch (e) {}
    const total = typeof st.total === "function" ? st.total(s) : st.total;
    const n = Math.min(total, st.count ? st.count(s) : Object.keys(s.res || {}).length);
    return {n, total, pct: Math.round(100 * n / total), done: n >= total, started: n > 0};
  }
  const all = (q) => (q || SEQ).steps.map(st => Object.assign({p: prog(st)}, st));
  const overall = steps => { const n = steps.reduce((a, s) => a + s.p.n, 0), t = steps.reduce((a, s) => a + s.p.total, 0); return Math.round(100 * n / t); };
  const drawArt = root => { if (window.SiteArt) root.querySelectorAll("[data-art]").forEach(SiteArt.draw); };
  const css = t => { const st = document.createElement("style"); st.textContent = t; document.head.appendChild(st); };

  /* ---------- 1. Sequence page ---------- */
  const ready = () => !!(C() && C().isReady && C().isReady());
  const isOpen = (st, i) => !!(C() && C().stepOpen && C().stepOpen(SEQ.id, st.id, i));
  const hasClass = () => !!(C() && C().klass && C().klass());
  const list = document.getElementById("seq-steps");
  // A 4e class sees only the 4e version; the 4e version is for 4e codes (and the teacher) only
  function hubBlock() {
    const k = klassNow();
    if (k && k.admin) return null;
    if (SEQ.level === "4e" && !k) return {t: "Séquence réservée aux 4e", w: "Entre le code de ta classe de 4e, en haut de la page, pour voir les étapes."};
    if (SEQ.level === "4e" && k.level !== "4e") return {t: "Séquence réservée aux 4e", w: `Ta classe est en ${k.level} : ta séquence est la version ${k.level}.`, href: SEQ5.href, go: "Ouvrir ma séquence"};
    if (SEQ.level === "5e" && k && k.level === "4e") return {t: "Ta séquence est la version 4e", w: "Ta classe est en 4e : la séquence Late and absent a une version pour toi, avec du nouveau (le present perfect) et un article plus long.", href: SEQ4.href, go: "Ouvrir Late and absent · 4e"};
    return null;
  }
  function renderHub() {
    const block = hubBlock();
    ["seq-overall", "seq-evals"].forEach(id => { const el = document.getElementById(id); if (el) el.hidden = !!block; });
    const evh = document.getElementById("seq-evals-h"); if (evh) evh.hidden = !!block;
    if (block) {
      list.innerHTML = `<li><div class="step-card${block.href ? " next" : " locked"}"><span class="num" aria-hidden="true">${block.href ? "→" : "🔒"}</span><span class="step-art" data-art="excuse" aria-hidden="true"></span>
        <span class="step-body"><span class="step-t">${block.t}</span><span class="step-w">${block.w}</span>${block.href ? `<a class="seq-go" href="${url(block.href)}">${block.go} →</a>` : ""}</span></div></li>`;
      css(".seq-go{align-self:flex-start;margin-top:6px;font-weight:700;color:#fff;background:var(--accent,#2f4fd8);border-radius:10px;padding:9px 14px;text-decoration:none}");
      mountClass(); drawArt(list); return;
    }
    const steps = all(), open = steps.map((s, i) => isOpen(s, i)), nextI = steps.findIndex((s, i) => open[i] && !s.p.done);
    list.innerHTML = steps.map((s, i) => {
      if (!open[i]) return `<li><div class="step-card locked" aria-disabled="true">
        <span class="num" aria-hidden="true">🔒</span>
        <span class="step-art" data-art="${s.art}" aria-hidden="true"></span>
        <span class="step-body"><span class="step-k">Étape ${i + 1} · verrouillée</span><span class="step-t">${s.title}</span>
        <span class="step-w">${!ready() ? "Chargement…" : hasClass() ? "Ton professeur ouvrira cette étape en classe, au bon moment." : "Entre d'abord le code de ta classe, en haut de la page."}</span></span></div></li>`;
      const partial = C() && C().part ? C().part(SEQ.id, s.id) : null;
      const status = s.p.done ? `<span class="st done">Terminé ✓</span>` : s.p.started ? `<span class="st doing">En cours</span>` : `<span class="st todo">À faire</span>`;
      const cta = s.p.done ? "Revoir" : s.p.started ? "Continuer" : "Commencer";
      return `<li><a class="step-card${i === nextI ? " next" : ""}${s.p.done ? " is-done" : ""}" href="${url(s.href)}">
        ${i === nextI ? `<span class="here">${s.p.started ? "Tu en es ici" : "Commence ici"}</span>` : ""}
        <span class="num" aria-hidden="true">${s.p.done ? "✓" : i + 1}</span>
        <span class="step-art" data-art="${s.art}" aria-hidden="true"></span>
        <span class="step-body">
          <span class="step-k">Étape ${i + 1}${partial && partial.dialogues ? ` · ouverte en partie (dialogue${partial.dialogues.length > 1 ? "s" : ""} ${partial.dialogues.join(", ")})` : ""}</span>
          <span class="step-t">${s.title}</span>
          <span class="step-w">${s.what}</span>
          <span class="skills">${s.skills.map(k => `<span>${k}</span>`).join("")}</span>
          <span class="bar" role="img" aria-label="${s.p.n} sur ${s.p.total} faits"><span style="width:${s.p.pct}%"></span></span>
          <span class="step-foot">${status}<span class="cnt">${s.p.n} / ${s.p.total} faits</span><span class="go">${cta} →</span></span>
        </span></a></li>`;
    }).join("");
    const o = document.getElementById("seq-overall");
    if (o) { const pc = overall(steps); o.querySelector(".bar span").style.width = pc + "%"; o.querySelector(".pc").textContent = pc + " %"; }
    // Evaluations
    const ev = document.getElementById("seq-evals");
    if (ev) {
      const k = C() && C().klass ? C().klass() : null;
      ev.innerHTML = SEQ.evals.map(e => {
        const ok = k && C().evalOpen(SEQ.id, e.id);
        const why = !k ? "Entre d'abord le code de ta classe, en haut de la page."
          : "Ton professeur débloquera l'évaluation quand ta classe sera prête. En attendant, entraîne-toi : c'est comme ça que tu progresses !";
        return ok
          ? `<li><a class="step-card eval-card open" href="${url(e.href)}"><span class="num" aria-hidden="true">✎</span><span class="step-art" data-art="${e.art}" aria-hidden="true"></span>
              <span class="step-body"><span class="step-k">Évaluation · ${k.admin ? "ouverte (mode professeur)" : "débloquée pour ta classe"}</span><span class="step-t">${e.title}</span><span class="step-w">${e.what}</span>
              <span class="step-foot"><span class="st done">Ouverte</span><span class="go">Passer l'évaluation →</span></span></span></a></li>`
          : `<li><div class="step-card eval-card locked" aria-disabled="true"><span class="num" aria-hidden="true">🔒</span><span class="step-art" data-art="${e.art}" aria-hidden="true"></span>
              <span class="step-body"><span class="step-k">Évaluation · verrouillée</span><span class="step-t">${e.title}</span><span class="step-w">${why}</span></span></div></li>`;
      }).join("");
      drawArt(ev);
    }
    mountClass();
    drawArt(list);
  }
  function mountClass() {
    const cl = document.getElementById("class-box");
    if (cl && C() && !cl.dataset.mounted) {
      cl.dataset.mounted = "1";
      C().mountPicker(cl, {note: c => c.admin ? `Mode professeur : vous voyez la version ${SEQ.level}. <a href="${url((SEQ.level === "4e" ? SEQ5 : SEQ4).href)}">Voir la version ${SEQ.level === "4e" ? "5e" : "4e"} →</a>` : ""});
    }
  }
  if (list) {
    renderHub();
    document.addEventListener("classes:ready", renderHub);
    document.addEventListener("classes:change", renderHub);
  }

  /* ---------- 2. Home page card ---------- */
  const feat = document.getElementById("seq-feature");
  function renderFeature() {
    const q = is4e() ? SEQ4 : SEQ5, steps = all(q), pc = overall(steps);
    feat.setAttribute("href", url(q.href));
    const tg = feat.querySelector(".tag"); if (tg) tg.textContent = `Séquence en cours · ${q.level}`;
    const h = feat.querySelector("h2"); if (h) h.textContent = q.level === "4e" ? "Late and absent · 4e" : "Late and absent";
    const mini = feat.querySelector(".mini");
    if (mini) mini.innerHTML = steps.map((s, i) => `<span class="ms${s.p.done ? " ok" : ""}" title="${s.title}"><span class="ms-art" data-art="${s.art}" aria-hidden="true"></span><span class="ms-t">${i + 1}. ${s.title}${s.p.done ? " ✓" : ""}</span></span>`).join("");
    const b = feat.querySelector(".bar span"); if (b) b.style.width = pc + "%";
    const t = feat.querySelector(".pc"); if (t) t.textContent = pc ? `Ta progression : ${pc} %` : "Pas encore commencé : à toi de jouer !";
    drawArt(feat);
  }
  if (feat) {
    renderFeature();
    document.addEventListener("classes:ready", renderFeature);
    document.addEventListener("classes:change", renderFeature);
  }

  /* ---------- 3. Navigation inside a tool ---------- */
  // Shared pages (Fill in the note, -ed, Can you explain?, Excuse Lab) belong to the learner's version (5e or 4e);
  // a page made for one version only says so with data-seq.
  const stepId = me && me.dataset.step;
  if (stepId && SEQS.some(q => q.steps.some(x => x.id === stepId))) {
    css(`.seqbar{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 8px;font:600 14px/1.4 "Atkinson Hyperlegible",Verdana,sans-serif}
      .seqbar a{color:inherit;opacity:.8;text-decoration:none}.seqbar a:hover{opacity:1;text-decoration:underline}
      .seqbar .sep{opacity:.45}.seqbar .stp{font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--accent-soft,#e3e8ff);color:var(--accent,#2f4fd8)}
      .seqnav{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:8px}
      .seqnav a{flex:1 1 200px;display:flex;flex-direction:column;gap:2px;text-decoration:none;color:inherit;background:var(--card,#fff);border:1px solid var(--line,#d9ddea);border-radius:14px;padding:12px 16px}
      .seqnav a:hover{border-color:var(--accent,#2f4fd8)}
      .seqnav small{font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#5b6380)}
      .seqnav b{font-family:"Bricolage Grotesque","Trebuchet MS",sans-serif;font-size:1.1rem}
      .seqnav .nx{text-align:right;border-color:var(--accent,#2f4fd8)}
      .seqnav .nx b{color:var(--accent,#2f4fd8)}
      #seq-lock{position:fixed;inset:0;z-index:80;background:rgba(17,21,42,.78);display:grid;place-items:center;padding:16px;overflow:auto}
      #seq-lock>div{max-width:460px;background:var(--card,#fff);color:var(--ink,#1b2340);border-radius:18px;padding:24px;text-align:center;font:400 1rem/1.5 "Atkinson Hyperlegible",Verdana,sans-serif}
      #seq-lock b.t{display:block;font:800 1.4rem/1.2 "Bricolage Grotesque","Trebuchet MS",sans-serif;margin:8px 0}
      #seq-lock .cl-box{margin-top:14px;text-align:left}
      #seq-lock a.back{display:inline-block;margin-top:14px;font-weight:700;color:#fff;background:var(--accent,#2f4fd8);border-radius:10px;padding:10px 16px;text-decoration:none}`);
    const home0 = document.querySelector(".homebar") || document.querySelector(".homelink");
    const bar = document.createElement("nav"); bar.className = "seqbar homebar"; bar.setAttribute("aria-label", "Fil d'Ariane");
    if (home0) home0.replaceWith(bar);
    const nav = document.createElement("nav"); nav.className = "seqnav"; nav.setAttribute("aria-label", "Steps of the sequence");
    const wrap = document.querySelector(".wrap");
    if (wrap) { const notes = [...wrap.children].reverse().find(el => el.tagName === "DETAILS"); notes ? wrap.insertBefore(nav, notes) : wrap.appendChild(nav); }
    // Shared computers: a way to hand the device to the next learner (assets/reset.js)
    if (wrap && !document.getElementById("class-box")) {
      const r = document.createElement("p"); r.style.cssText = "margin:0;text-align:center";
      r.innerHTML = `<button type="button" class="reset-btn" data-reset-btn><span aria-hidden="true">👤</span> I am another student</button>`;
      nav.after(r);
    }
    function renderTool() {
      SEQ = pick();
      const i = SEQ.steps.findIndex(x => x.id === stepId);
      if (i < 0) { SEQ = SEQS.find(q => q.steps.some(x => x.id === stepId)); }
      const j = SEQ.steps.findIndex(x => x.id === stepId);
      bar.innerHTML = `<a href="${url("")}">Home</a><span class="sep">›</span><a href="${url(SEQ.href)}">← ${SEQ.title}${SEQ.level === "4e" ? " · 4e" : ""}</a><span class="stp">Step ${j + 1} / ${SEQ.steps.length}</span>`;
      const prev = SEQ.steps[j - 1], next = SEQ.steps[j + 1];
      nav.innerHTML = (prev ? `<a href="${url(prev.href)}"><small>← Step ${j}</small><b>${prev.title}</b></a>` : `<a href="${url(SEQ.href)}"><small>←</small><b>The sequence</b></a>`)
        + (next ? `<a class="nx" href="${url(next.href)}"><small>Next step ${j + 2} →</small><b>${next.title}</b></a>` : `<a class="nx" href="${url(SEQ.href)}"><small>Last step done? →</small><b>Back to the sequence</b></a>`);
      lockIfClosed(j);
    }
    function lockIfClosed(j) {
      const old = document.getElementById("seq-lock"); if (old) old.remove();
      if (!ready()) return;
      const k = klassNow();
      // A page of one version opened by a learner of the other version: send them to theirs
      let other = null;
      if (forcedId && k && !k.admin && k.level !== SEQ.level) {
        const q = SEQS.find(x => x.level === k.level);
        const st = q && (q.steps.find(x => x.id === stepId) || null);
        other = {href: st ? st.href : q ? q.href : SEQ5.href, lvl: k.level};
      }
      if (!other && isOpen(SEQ.steps[j], j)) return;
      const d = document.createElement("div"); d.id = "seq-lock"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "seq-lock-t");
      d.innerHTML = other
        ? `<div><span style="font-size:2.4rem" aria-hidden="true">↪</span><b class="t" id="seq-lock-t">This page is for ${SEQ.level} classes</b><span data-fr="Ta classe est en ${other.lvl} : ta version de cette étape est ailleurs.">Your class is in ${other.lvl}: your version of this step is on another page.</span><br><a class="back" href="${url(other.href)}">Go to my version →</a></div>`
        : `<div><span style="font-size:2.4rem" aria-hidden="true">🔒</span><b class="t" id="seq-lock-t">Locked step</b>${k
        ? `<span data-fr="Cette étape n'est pas encore ouverte pour ta classe. Ton professeur l'ouvrira en classe, au bon moment.">This step is not open for your class yet. Your teacher will open it in class.</span>`
        : `<span data-fr="Entre le code de ta classe : seules les étapes ouvertes par ton professeur sont accessibles.">Enter your class code: you can only open the steps your teacher has opened.</span>`}
        ${k ? "" : `<div id="seq-lock-cl"></div>`}<br><a class="back" href="${url(SEQ.href)}">← Back to the sequence</a></div>`;
      document.body.appendChild(d);
      const box = document.getElementById("seq-lock-cl"); if (box && C()) C().mountPicker(box, {noReset: true});
    }
    renderTool();
    document.addEventListener("classes:ready", renderTool);
    document.addEventListener("classes:change", renderTool);
  }
})();
