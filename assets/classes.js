/* Class codes. The learner types their class code once; it is checked against classes.json (which only holds
   a fingerprint of each code) and remembered on this device. classes.json also says, per class, how many steps
   of each sequence are open and which evaluations the teacher has unlocked.
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
    .then(j => { cfg = j; if (cur && !cfg.classes.find(c => c.id === cur.id)) cur = null; fire("classes:ready"); return cfg; });

  const klass = () => (cur && cfg) ? (cfg.classes.find(c => c.id === cur.id) || null) : null;
  async function join(code) {
    if (!cfg) await ready;
    if (!window.crypto || !crypto.subtle) return null;
    const h = await sha("bosse-lu:" + norm(code));
    const c = cfg.classes.find(x => x.hash === h);
    if (!c) return null;
    cur = {id: c.id}; try { localStorage.setItem(LS, JSON.stringify(cur)); } catch (e) {}
    fire("classes:change"); return c;
  }
  function leave() { cur = null; try { localStorage.removeItem(LS); } catch (e) {} fire("classes:change"); }
  const seqConf = seq => { const c = klass(); return (c && c.sequences && c.sequences[seq]) || null; };
  const evalOpen = (seq, id) => { const s = seqConf(seq); return !!(s && (s.evals || []).includes(id)); };
  const stepsOpen = (seq, total) => { const s = seqConf(seq); return (s && typeof s.steps === "number") ? s.steps : total; };

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
  .cl-msg.err{color:#c2412d;font-weight:700}`;
  document.head.appendChild(st);

  // A small "my class" box: shows the class, or a field to type the class code.
  function mountPicker(el, opts) {
    opts = opts || {};
    function draw(msg, err) {
      const c = klass();
      el.className = "cl-box";
      if (c) {
        el.innerHTML = `<span class="cl-ico" aria-hidden="true">🏫</span><span>Ma classe :</span><span class="cl-badge">${c.label}</span><button type="button" class="lite" data-cl="leave">Changer de classe</button>${opts.note ? `<p class="cl-msg">${opts.note(c)}</p>` : ""}`;
      } else {
        el.innerHTML = `<span class="cl-ico" aria-hidden="true">🏫</span><b>${opts.title || "Entre le code de ta classe"}</b>
          <form novalidate><label class="sr" for="cl-in-${el.id || "x"}" style="position:absolute;left:-9999px">Code de la classe</label>
          <input id="cl-in-${el.id || "x"}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ex. ABC-5X"><button type="submit">Valider</button></form>
          <p class="cl-msg${err ? " err" : ""}">${msg || "Ton professeur te donne ce code. Tu ne le tapes qu'une fois sur cet appareil."}</p>`;
        el.querySelector("form").addEventListener("submit", async e => {
          e.preventDefault();
          const v = el.querySelector("input").value;
          if (!norm(v)) { draw("Écris le code de ta classe.", true); return; }
          const c2 = await join(v);
          if (!c2) draw("Ce code ne correspond à aucune classe. Vérifie-le avec ton professeur.", true);
        });
      }
      const lv = el.querySelector('[data-cl="leave"]'); if (lv) lv.addEventListener("click", leave);
    }
    draw();
    document.addEventListener("classes:ready", () => draw());
    document.addEventListener("classes:change", () => draw());
  }

  window.Classes = {ready, klass, join, leave, evalOpen, stepsOpen, mountPicker, isReady: () => !!cfg};
})();
