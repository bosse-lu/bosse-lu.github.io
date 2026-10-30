/* The current sequence: its steps, the learner's progress in each tool (read from that tool's own saved state),
   and the rendering for (1) the sequence page, (2) the home page card, (3) the step navigation inside each tool.
   Tool pages load this script with data-step="<step id>". */
(function () {
  const me = document.currentScript;
  const base = new URL("..", me ? me.src : location.href);
  const url = p => new URL(p, base).href;

  const SEQ = {
    id: "late-and-absent", title: "Late and absent", level: "5e", axis: "Axe 4 · École et loisirs", href: "late-and-absent/",
    // Evaluations stay locked until the teacher unlocks them for a class (classes.json → evals)
    evals: [
      {id: "ed-final", href: "ed-sounds/#eval", art: "ed", title: "Évaluation orale : le prétérit",
        what: "Lis un court texte au prétérit à voix haute, enregistre-toi, puis rends le fichier sur Pronote."}
    ],
    steps: [
      {id: "excuse", href: "excuse-lab/", art: "excuse", title: "Excuse Lab",
        what: "Écoute les vraies voix des dialogues, répète les phrases et joue la scène.",
        skills: ["Écouter", "Répéter", "Jouer la scène"], key: "excuselab4e", total: 27,
        count: s => Object.keys(s.res || {}).filter(k => !k.startsWith("play")).length},
      {id: "ed", href: "ed-sounds/", art: "ed", title: "Les sons de -ed",
        what: "Le prétérit des verbes réguliers : /t/, /d/ ou /ɪd/ ? Entraîne-toi, puis passe l'évaluation finale.",
        skills: ["Prétérit", "Prononciation"], key: "edlab4e", total: 18},
      {id: "stress", href: "stress-lab/", art: "stress", title: "Stress Lab",
        what: "L'accent des mots et des phrases de la séquence : ABsent, exCUSE, SORry I'm LATE…",
        skills: ["Accent tonique", "Rythme"], key: "stresslab5e-late", total: 23},
      {id: "bus", href: "late-bus/", art: "bus", title: "Blame the bus!",
        what: "Un vrai article de presse britannique sur les retards à Londres. Lis-le, écoute-le, puis entraîne-toi sur ses verbes en -ed.",
        skills: ["Lecture", "Document authentique", "Royaume-Uni"], key: "latebus5e", total: 12}
    ]
  };

  function prog(st) {
    let raw = null, s = {};
    try { raw = localStorage.getItem(st.key); s = JSON.parse(raw || "{}") || {}; } catch (e) {}
    const n = Math.min(st.total, st.count ? st.count(s) : Object.keys(s.res || {}).length);
    return {n, total: st.total, pct: Math.round(100 * n / st.total), done: n >= st.total, started: n > 0};
  }
  const all = () => SEQ.steps.map(st => Object.assign({p: prog(st)}, st));
  const overall = steps => { const n = steps.reduce((a, s) => a + s.p.n, 0), t = steps.reduce((a, s) => a + s.p.total, 0); return Math.round(100 * n / t); };
  const drawArt = root => { if (window.SiteArt) root.querySelectorAll("[data-art]").forEach(SiteArt.draw); };
  const css = t => { const st = document.createElement("style"); st.textContent = t; document.head.appendChild(st); };

  /* ---------- 1. Sequence page ---------- */
  const C = () => window.Classes;
  const openCount = () => (C() && C().stepsOpen) ? C().stepsOpen(SEQ.id, SEQ.steps.length) : SEQ.steps.length;
  const list = document.getElementById("seq-steps");
  function renderHub() {
    const steps = all(), open = openCount(), nextI = steps.findIndex((s, i) => i < open && !s.p.done);
    list.innerHTML = steps.map((s, i) => {
      if (i >= open) return `<li><div class="step-card locked" aria-disabled="true">
        <span class="num" aria-hidden="true">🔒</span>
        <span class="step-art" data-art="${s.art}" aria-hidden="true"></span>
        <span class="step-body"><span class="step-k">Étape ${i + 1}</span><span class="step-t">${s.title}</span>
        <span class="step-w">Cette étape s'ouvrira bientôt pour ta classe. Termine d'abord les étapes précédentes !</span></span></div></li>`;
      const status = s.p.done ? `<span class="st done">Terminé ✓</span>` : s.p.started ? `<span class="st doing">En cours</span>` : `<span class="st todo">À faire</span>`;
      const cta = s.p.done ? "Revoir" : s.p.started ? "Continuer" : "Commencer";
      return `<li><a class="step-card${i === nextI ? " next" : ""}${s.p.done ? " is-done" : ""}" href="${url(s.href)}">
        ${i === nextI ? `<span class="here">${s.p.started ? "Tu en es ici" : "Commence ici"}</span>` : ""}
        <span class="num" aria-hidden="true">${s.p.done ? "✓" : i + 1}</span>
        <span class="step-art" data-art="${s.art}" aria-hidden="true"></span>
        <span class="step-body">
          <span class="step-k">Étape ${i + 1}</span>
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
              <span class="step-body"><span class="step-k">Évaluation · débloquée pour ta classe</span><span class="step-t">${e.title}</span><span class="step-w">${e.what}</span>
              <span class="step-foot"><span class="st done">Ouverte</span><span class="go">Passer l'évaluation →</span></span></span></a></li>`
          : `<li><div class="step-card eval-card locked" aria-disabled="true"><span class="num" aria-hidden="true">🔒</span><span class="step-art" data-art="${e.art}" aria-hidden="true"></span>
              <span class="step-body"><span class="step-k">Évaluation · verrouillée</span><span class="step-t">${e.title}</span><span class="step-w">${why}</span></span></div></li>`;
      }).join("");
      drawArt(ev);
    }
    const cl = document.getElementById("class-box");
    if (cl && C() && !cl.dataset.mounted) {
      cl.dataset.mounted = "1";
      C().mountPicker(cl, {note: c => c.level !== SEQ.level ? `Ta classe est en ${c.level} : cette séquence est celle des ${SEQ.level}. Tu peux la regarder, mais ta propre séquence arrivera bientôt.` : ""});
    }
    drawArt(list);
  }
  if (list) {
    renderHub();
    document.addEventListener("classes:ready", renderHub);
    document.addEventListener("classes:change", renderHub);
  }

  /* ---------- 2. Home page card ---------- */
  const feat = document.getElementById("seq-feature");
  if (feat) {
    const steps = all(), pc = overall(steps);
    const mini = feat.querySelector(".mini");
    if (mini) mini.innerHTML = steps.map((s, i) => `<span class="ms${s.p.done ? " ok" : ""}" title="${s.title}"><span class="ms-art" data-art="${s.art}" aria-hidden="true"></span><span class="ms-t">${i + 1}. ${s.title}${s.p.done ? " ✓" : ""}</span></span>`).join("");
    const b = feat.querySelector(".bar span"); if (b) b.style.width = pc + "%";
    const t = feat.querySelector(".pc"); if (t) t.textContent = pc ? `Ta progression : ${pc} %` : "Pas encore commencé : à toi de jouer !";
    drawArt(feat);
  }

  /* ---------- 3. Navigation inside a tool ---------- */
  const stepId = me && me.dataset.step;
  const i = SEQ.steps.findIndex(s => s.id === stepId);
  if (i >= 0) {
    css(`.seqbar{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px 8px;font:600 14px/1.4 "Atkinson Hyperlegible",Verdana,sans-serif}
      .seqbar a{color:inherit;opacity:.8;text-decoration:none}.seqbar a:hover{opacity:1;text-decoration:underline}
      .seqbar .sep{opacity:.45}.seqbar .stp{font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--accent-soft,#e3e8ff);color:var(--accent,#2f4fd8)}
      .seqnav{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;margin-top:8px}
      .seqnav a{flex:1 1 200px;display:flex;flex-direction:column;gap:2px;text-decoration:none;color:inherit;background:var(--card,#fff);border:1px solid var(--line,#d9ddea);border-radius:14px;padding:12px 16px}
      .seqnav a:hover{border-color:var(--accent,#2f4fd8)}
      .seqnav small{font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted,#5b6380)}
      .seqnav b{font-family:"Bricolage Grotesque","Trebuchet MS",sans-serif;font-size:1.1rem}
      .seqnav .nx{text-align:right;border-color:var(--accent,#2f4fd8)}
      .seqnav .nx b{color:var(--accent,#2f4fd8)}`);
    const home = document.querySelector(".homebar") || document.querySelector(".homelink");
    if (home) {
      const bar = document.createElement("nav"); bar.className = "seqbar homebar"; bar.setAttribute("aria-label", "Fil d'Ariane");
      bar.innerHTML = `<a href="${url("")}">Accueil</a><span class="sep">›</span><a href="${url(SEQ.href)}">← Séquence ${SEQ.title}</a><span class="stp">Étape ${i + 1} / ${SEQ.steps.length}</span>`;
      home.replaceWith(bar);
    }
    const prev = SEQ.steps[i - 1], next = SEQ.steps[i + 1];
    const nav = document.createElement("nav"); nav.className = "seqnav"; nav.setAttribute("aria-label", "Étapes de la séquence");
    nav.innerHTML = (prev ? `<a href="${url(prev.href)}"><small>← Étape ${i}</small><b>${prev.title}</b></a>` : `<a href="${url(SEQ.href)}"><small>←</small><b>Le parcours de la séquence</b></a>`)
      + (next ? `<a class="nx" href="${url(next.href)}"><small>Étape suivante ${i + 2} →</small><b>${next.title}</b></a>` : `<a class="nx" href="${url(SEQ.href)}"><small>Dernière étape terminée ? →</small><b>Retour au parcours</b></a>`);
    function lockIfClosed() {
      const old = document.getElementById("seq-lock"); if (old) old.remove();
      if (i < openCount()) return;
      css(`#seq-lock{position:fixed;inset:0;z-index:80;background:rgba(17,21,42,.72);display:grid;place-items:center;padding:16px}
        #seq-lock>div{max-width:440px;background:var(--card,#fff);color:var(--ink,#1b2340);border-radius:18px;padding:24px;text-align:center;font:400 1rem/1.5 "Atkinson Hyperlegible",Verdana,sans-serif}
        #seq-lock b{display:block;font:800 1.4rem/1.2 "Bricolage Grotesque","Trebuchet MS",sans-serif;margin:8px 0}
        #seq-lock a{display:inline-block;margin-top:14px;font-weight:700;color:#fff;background:var(--accent,#2f4fd8);border-radius:10px;padding:10px 16px;text-decoration:none}`);
      const d = document.createElement("div"); d.id = "seq-lock"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
      d.innerHTML = `<div><span style="font-size:2.4rem" aria-hidden="true">🔒</span><b>Pas encore ouvert</b>Cette étape n'est pas encore ouverte pour ta classe. Ton professeur l'ouvrira bientôt : termine d'abord les étapes précédentes.<br><a href="${url(SEQ.href)}">← Retour au parcours</a></div>`;
      document.body.appendChild(d);
    }
    lockIfClosed();
    document.addEventListener("classes:ready", lockIfClosed);
    document.addEventListener("classes:change", lockIfClosed);
    const wrap = document.querySelector(".wrap");
    if (wrap) { const notes = [...wrap.children].reverse().find(el => el.tagName === "DETAILS"); notes ? wrap.insertBefore(nav, notes) : wrap.appendChild(nav); }
  }
})();
