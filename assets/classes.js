/* Class codes. The learner types their class code once; it is checked against classes.json (which only holds
   a fingerprint of each code) and remembered on this device. classes.json also says, per class, which steps
   of each sequence are open (everything is locked by default), which parts of a step are open, and which
   evaluations the teacher has unlocked. A teacher code (classes.json → admins) opens everything on the device.
   Events: "classes:ready" once the settings are loaded, "classes:change" when the learner joins or leaves a class. */
(function () {
  const me = document.currentScript;
  const base = new URL("..", me ? me.src : location.href);
  const LS = "bosse-class";
  let cfg = null, cur = null;
  try { cur = JSON.parse(localStorage.getItem(LS) || "null"); } catch (e) {}
  const norm = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  async function sha(t) {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  const fire = n => document.dispatchEvent(new CustomEvent(n));
  const ready = fetch(new URL("classes.json", base).href + "?v=" + Date.now(), {cache: "no-store"})
    .then(r => r.json()).catch(() => ({classes: []}))
    .then(j => { cfg = j; cfg.admins = cfg.admins || []; if (cur && !cur.admin && !cfg.classes.find(c => c.id === cur.id)) cur = null; fire("classes:ready"); return cfg; });

  const ADMIN = {id: "PROF", label: "Professeur", level: null, admin: true, sequences: {}};
  const klass = () => (cur && cfg) ? (cur.admin ? ADMIN : (cfg.classes.find(c => c.id === cur.id) || null)) : null;
  const isAdmin = () => !!(klass() && klass().admin);
  // Imposed level: 1 = free (class code), 2 = ★★, 3 = ★★★ (group code). null for the teacher (free preview).
  const stars = () => { const k = klass(); if (!k) return 1; if (k.admin) return null; return (cur && cur.stars) || 1; };
  async function join(code) {
    if (!cfg) await ready;
    if (!window.crypto || !crypto.subtle) return null;
    const h = await sha("bosse-lu:" + norm(code));
    const adm = cfg.admins.find(x => x.hash === h);
    if (adm) {
      // A visit code (role "visit", e.g. for an inspector) opens everything like the teacher code, under its own name
      cur = adm.role === "visit" ? {id: "PROF", admin: true, role: "visit"} : {id: "PROF", admin: true}; try { localStorage.setItem(LS, JSON.stringify(cur)); } catch (e) {}
      fire("classes:change"); return ADMIN;
    }
    let c = cfg.classes.find(x => x.hash === h), stars = 1;
    if (!c) {
      // A group code: same class, but a level imposed by the teacher (★★ or ★★★)
      c = cfg.classes.find(x => (x.groups || []).some(g => g.hash === h));
      if (c) stars = c.groups.find(g => g.hash === h).stars || 1;
    }
    if (!c) return null;
    cur = stars > 1 ? {id: c.id, stars} : {id: c.id}; try { localStorage.setItem(LS, JSON.stringify(cur)); } catch (e) {}
    fire("classes:change"); return c;
  }
  function leave() { cur = null; try { localStorage.removeItem(LS); } catch (e) {} fire("classes:change"); }
  const seqConf = seq => { const c = klass(); return (c && c.sequences && c.sequences[seq]) || null; };
  const evalOpen = (seq, id) => { if (isAdmin()) return true; const s = seqConf(seq); return !!(s && (s.evals || []).includes(id)); };
  // A step is open only if the teacher opened it for the learner's class ("open": [ids]; old format "steps": n = the first n).
  const stepOpen = (seq, id, index) => {
    if (isAdmin()) return true;
    const s = seqConf(seq); if (!s) return false;
    if (Array.isArray(s.open)) return s.open.includes(id);
    return typeof s.steps === "number" ? index < s.steps : false;
  };
  // Partial opening of a step, e.g. {dialogues: [1]} ; null = the whole step.
  const part = (seq, id) => { if (isAdmin()) return null; const s = seqConf(seq); return (s && s.parts && s.parts[id]) || null; };

  const st = document.createElement("style");
  st.textContent = `
  .cl-box{background:var(--card,#fff);border:1px solid var(--line,#d9ddea);border-radius:14px;padding:12px 16px;display:flex;flex-wrap:wrap;align-items:center;gap:10px}
  .cl-box .cl-ico{font-size:1.4rem}
  .cl-box b{font-family:"Bricolage Grotesque","Trebuchet MS",sans-serif;font-size:1.05rem}
  .cl-badge{font-weight:800;font-family:"Bricolage Grotesque","Trebuchet MS",sans-serif;background:var(--ink,#1b2340);color:var(--paper,#fff);border-radius:999px;padding:3px 12px}
  .cl-box form{display:flex;flex-wrap:wrap;gap:8px;align-items:center;flex:1 1 260px}
  .cl-box input{font:inherit;font-size:1rem;text-transform:uppercase;letter-spacing:.06em;color:var(--ink,#1b2340);background:var(--paper,#f3f5fb);border:1px solid var(--line,#d9ddea);border-radius:10px;padding:8px 12px;width:11em}
  .cl-box button{font:inherit;font-weight:700;border-radius:10px;padding:8px 14px;cursor:pointer;border:1px solid var(--accent,#2f4fd8);background:var(--accent,#2f4fd8);color:var(--card,#fff)}
  .cl-box button.lite{background:none;color:var(--accent,#2f4fd8)}
  .cl-box input:focus-visible,.cl-box button:focus-visible{outline:3px solid var(--accent,#2f4fd8);outline-offset:2px}
  .cl-msg{flex:1 1 100%;margin:0;font-size:.88rem;color:var(--muted,#5b6380)}
  .cl-msg.err{color:#c2412d;font-weight:700}
  .cl-reset{margin-left:auto}`;
  document.head.appendChild(st);

  // "Je suis un autre élève" (assets/reset.js handles the click): for computers shared by several learners
  const RESET = `<span class="cl-reset"><button type="button" class="reset-btn" data-reset-btn><span aria-hidden="true">👤</span> I am another student</button></span>`;
  // A small "my class" box: shows the class, or a field to type the class code.
  function mountPicker(el, opts) {
    opts = opts || {};
    function draw(msg, err) {
      const c = klass();
      el.className = "cl-box";
      if (c && c.admin) {
        const visit = cur && cur.role === "visit";
        el.innerHTML = `<span class="cl-ico" aria-hidden="true">${visit ? "🔎" : "🔑"}</span><span>${visit ? "Mode visite" : "Mode professeur"} :</span><span class="cl-badge">accès complet</span><button type="button" class="lite" data-cl="leave">${visit ? "Quitter le mode visite" : "Quitter le mode professeur"}</button><p class="cl-msg">Sur cet appareil, toutes les étapes et toutes les évaluations sont ouvertes, quels que soient les réglages des classes.</p>`;
      } else if (c) {
        el.innerHTML = `<span class="cl-ico" aria-hidden="true">🏫</span><span>My class:</span><span class="cl-badge">${c.label}${stars() > 1 ? " · " + "★".repeat(stars()) : ""}</span><button type="button" class="lite" data-cl="leave">Change class</button>${opts.noReset ? "" : RESET}${opts.note ? `<p class="cl-msg">${opts.note(c)}</p>` : ""}`;
      } else {
        el.innerHTML = `<span class="cl-ico" aria-hidden="true">🏫</span><b data-fr="${opts.titleFr || "Entre le code de ta classe"}">${opts.title || "Enter your class code"}</b>
          <form novalidate><label class="sr" for="cl-in-${el.id || "x"}" style="position:absolute;left:-9999px">Class code</label>
          <input id="cl-in-${el.id || "x"}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="e.g. ABC-5X"><button type="submit">OK</button></form>
          <p class="cl-msg${err ? " err" : ""}">${msg || opts.hint || "Your teacher gives you this code. You type it only once on this device."}</p>${opts.noReset ? "" : RESET}`;
        el.querySelector("form").addEventListener("submit", async e => {
          e.preventDefault();
          const v = el.querySelector("input").value;
          if (!norm(v)) { draw("Write your class code.", true); return; }
          const c2 = await join(v);
          if (!c2) draw("This code does not match any class. Check it with your teacher.", true);
        });
      }
      const lv = el.querySelector('[data-cl="leave"]'); if (lv) lv.addEventListener("click", leave);
    }
    draw();
    document.addEventListener("classes:ready", () => draw());
    document.addEventListener("classes:change", () => draw());
  }

  window.Classes = {ready, klass, join, leave, evalOpen, stepOpen, part, isAdmin, stars, mountPicker, isReady: () => !!cfg};
})();
