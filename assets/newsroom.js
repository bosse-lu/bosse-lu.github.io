/* Newsroom: loads articles.json (published) and, with ?apercu in the URL, drafts.json (waiting for the teacher's approval). */
(async function () {
  const root = document.getElementById("newsroom");
  const list = document.getElementById("list");
  const preview = /[?&]apercu\b/.test(location.search);
  const KEY = "newsroom-" + root.dataset.kind;
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} };
  store.answers = store.answers || {};
  store.seen = store.seen || {};
  const NEW_DAYS = 14; // an unread article stays "NEW" for two weeks

  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  async function load(file) {
    try {
      const r = await fetch(file + "?v=" + Date.now(), {cache: "no-store"});
      if (!r.ok) return [];
      const j = await r.json(); return Array.isArray(j) ? j : (j.articles || []);
    } catch (e) { return []; }
  }
  const published = await load("articles.json");
  const drafts = preview ? (await load("drafts.json")).map(a => Object.assign({}, a, {draft: true})) : [];
  const all = drafts.concat(published).sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  if (preview) {
    const p = document.getElementById("previewNote");
    p.hidden = false;
    p.innerHTML = drafts.length
      ? `<b>Mode aperçu.</b> ${drafts.length} brouillon${drafts.length > 1 ? "s" : ""} en attente de validation (cadre orange). Les élèves ne les voient pas : ils n'apparaissent qu'avec <code>?apercu</code> dans l'adresse.`
      : `<b>Mode aperçu.</b> Aucun brouillon en attente.`;
  }

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const fmt = d => { const [y, m, dd] = (d || "").split("-").map(Number); return y ? `${dd} ${MONTHS[m - 1]} ${y}` : ""; };
  const recent = d => { const t = Date.parse(d); return t && (Date.now() - t) < NEW_DAYS * 864e5; };
  const unread = a => !a.draft && recent(a.date) && !store.seen[a.id];
  const flag = code => (window.EnglishFlags && code && EnglishFlags.flag) ? (() => { try { return EnglishFlags.flag(code); } catch (e) { return ""; } })() : "";

  function markKeywords(paras, kws) {
    // Underline the first occurrence of each key word (longest first), only in plain text, never inside a tag or another key word.
    const used = new Set();
    const sorted = (kws || []).slice().sort((x, y) => y[0].length - x[0].length);
    return paras.map(p => {
      let parts = [esc(p)]; // even index = text, odd index = already-built span
      sorted.forEach(([en, fr]) => {
        if (used.has(en)) return;
        const re = new RegExp("(^|[^A-Za-z'])(" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![A-Za-z])", "i");
        for (let i = 0; i < parts.length; i += 2) {
          const m = parts[i].match(re); if (!m) continue;
          const start = m.index + m[1].length, end = start + m[2].length;
          const span = `<span class="kwd" tabindex="0" data-fr="${esc(fr)}">${parts[i].slice(start, end)}</span>`;
          parts.splice(i, 1, parts[i].slice(0, start), span, parts[i].slice(end));
          used.add(en); break;
        }
      });
      return `<p>${parts.join("")}</p>`;
    }).join("");
  }
  function quizHTML(a) {
    const ans = store.answers[a.id] || {};
    const qs = (a.questions || []).map((q, qi) => {
      const pick = ans[qi];
      const opts = q.options.map((o, oi) => {
        let c = "opt"; if (pick !== undefined) { if (oi === q.answer) c += " right"; else if (oi === pick) c += " wrong"; }
        return `<button class="${c}" data-a="${esc(a.id)}" data-q="${qi}" data-o="${oi}" ${pick !== undefined ? "disabled" : ""}>${esc(o)}</button>`;
      }).join("");
      return `<div class="q"><p>${qi + 1}. ${esc(q.q)}</p><div class="opts" lang="en">${opts}</div></div>`;
    }).join("");
    const n = (a.questions || []).length, done = Object.keys(ans).length;
    const good = (a.questions || []).filter((q, qi) => ans[qi] === q.answer).length;
    const score = done === n && n ? `<p class="qscore">${good} / ${n} ${good === n ? "– Excellent!" : good >= n - 1 ? "– Well done!" : "– Relis l'article et réessaie demain !"}</p>` : "";
    return qs + score;
  }
  function card(a) {
    const open = store.open === a.id;
    const tags = [
      a.draft ? `<span class="tag dr">Brouillon</span>` : (unread(a) ? `<span class="tag hot">NEW</span>` : ""),
      a.level ? `<span class="tag lvl">${esc(a.level)}</span>` : "",
      a.topic ? `<span class="tag">${esc(a.topic)}</span>` : ""
    ].join("");
    const srcs = (a.sources || []).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>${s.date ? `, ${esc(s.date)}` : ""}`).join(" · ");
    return `<article class="art${a.draft ? " draft" : ""}${unread(a) ? " unread" : ""}" id="a-${esc(a.id)}">
      <div class="art-top">${flag(a.flag)}<span>${esc(a.country || "")} · ${fmt(a.date)}</span>${tags}</div>
      <h2 lang="en">${a.emoji ? `<span class="emo" aria-hidden="true">${esc(a.emoji)}</span>` : ""}${esc(a.title)}</h2>
      <p class="lead" lang="en">${esc(a.lead || "")}</p>
      <button class="open" data-open="${esc(a.id)}" aria-expanded="${open}">${open ? "Fermer l'article ↑" : "Lire l'article ↓"}</button>
      <div class="full" ${open ? "" : "hidden"}>
        <div class="body" lang="en">${markKeywords(a.body || [], a.keywords)}</div>
        <p class="hint">Touche un mot souligné pour voir sa traduction.</p>
        <div class="box"><h3>Key words</h3><ul class="kwlist">${(a.keywords || []).map(([en, fr]) => `<li><b lang="en">${esc(en)}</b> = ${esc(fr)}</li>`).join("")}</ul></div>
        <div class="box quiz" id="quiz-${esc(a.id)}"><h3>Quiz</h3>${quizHTML(a)}</div>
        ${a.turn ? `<div class="box turn"><h3>Your turn!</h3><p lang="en">${esc(a.turn)}</p></div>` : ""}
        <p class="src">Article écrit en anglais simplifié pour la classe, d'après : ${srcs}</p>
      </div>
    </article>`;
  }

  // Filters: level always; topic when several topics exist.
  let fl = store.level || "all", ft = store.topic || "all";
  const topics = [...new Set(all.map(a => a.topic).filter(Boolean))];
  function renderFilters() {
    const f = document.getElementById("filters");
    const levels = ["5e", "4e"].filter(l => all.some(a => (a.level || "").includes(l)));
    const lv = (levels.length > 1 ? ["all"].concat(levels) : []).map(v => `<button class="fchip" data-fl="${v}" aria-pressed="${fl === v}">${v === "all" ? "Tous" : v}</button>`).join("");
    const tp = topics.length > 1 ? `<span class="sep"></span><span class="lbl">Thème</span>` + ["all"].concat(topics).map(v => `<button class="fchip" data-ft="${esc(v)}" aria-pressed="${ft === v}">${v === "all" ? "Tous" : esc(v)}</button>`).join("") : "";
    f.innerHTML = (lv ? `<span class="lbl">Niveau</span>${lv}` : "") + (lv ? tp : tp.replace(`<span class="sep"></span>`, ""));
    f.hidden = !f.innerHTML;
  }
  function render() {
    const shown = all.filter(a => (fl === "all" || (a.level || "").includes(fl)) && (ft === "all" || a.topic === ft));
    list.innerHTML = shown.length ? shown.map(card).join("") : `<div class="empty">${all.length ? "Aucun article pour ce choix." : root.dataset.empty}</div>`;
  }
  // NEW corner badge, notification banner and tab title for unread articles
  const baseTitle = document.title;
  const corner = document.createElement("button");
  corner.className = "corner-new"; corner.type = "button"; corner.hidden = true;
  document.body.appendChild(corner);
  const banner = document.getElementById("notif");
  function updateUnread(first) {
    const n = all.filter(unread).length;
    corner.hidden = !n;
    document.body.classList.toggle("nb-has", !!n);
    corner.innerHTML = `<span class="cn-label">NEW</span><span class="cn-count">${n}</span>`;
    corner.setAttribute("aria-label", n + (n > 1 ? " nouveaux articles à lire" : " nouvel article à lire"));
    document.title = n ? `(${n}) ${baseTitle}` : baseTitle;
    if (banner) {
      if (n && first) {
        banner.hidden = false;
        banner.innerHTML = `<span class="bell" aria-hidden="true">🔔</span><span><b>${n === 1 ? "Un nouvel article" : n + " nouveaux articles"}</b> ${n === 1 ? "t'attend" : "t'attendent"} ! Ouvre ${n === 1 ? "celui" : "ceux"} marqué${n === 1 ? "" : "s"} <b class="red">NEW</b>.</span><button class="x" type="button" aria-label="Fermer">×</button>`;
      } else if (!n) banner.hidden = true;
    }
  }
  corner.addEventListener("click", () => {
    const a = all.find(unread); if (!a) return;
    if (fl !== "all" || ft !== "all") { fl = "all"; ft = "all"; store.level = fl; store.topic = ft; renderFilters(); }
    store.open = a.id; markSeen(a.id); render();
    const el = document.getElementById("a-" + a.id); if (el) el.scrollIntoView({block: "start"});
  });
  function markSeen(id) { const a = all.find(x => x.id === id); if (a && !a.draft) { store.seen[id] = 1; save(); updateUnread(false); } }

  renderFilters(); render(); updateUnread(true);
  if (location.hash.startsWith("#a-")) { store.open = location.hash.slice(3); markSeen(store.open); render(); const el = document.querySelector(location.hash); if (el) el.scrollIntoView(); }

  document.addEventListener("click", e => {
    const k = e.target.closest(".kwd"); if (k) { k.classList.toggle("show"); return; }
    const t = e.target.closest("button"); if (!t) return;
    if (t.classList.contains("x") && t.closest("#notif")) { document.getElementById("notif").hidden = true; return; }
    if (t.dataset.fl) { fl = t.dataset.fl; store.level = fl; save(); renderFilters(); render(); return; }
    if (t.dataset.ft) { ft = t.dataset.ft; store.topic = ft; save(); renderFilters(); render(); return; }
    if (t.dataset.open) {
      store.open = store.open === t.dataset.open ? null : t.dataset.open; save();
      if (store.open) markSeen(store.open);
      render();
      const el = document.getElementById("a-" + t.dataset.open); if (el && store.open) el.scrollIntoView({block: "start"});
      return;
    }
    if (t.dataset.q !== undefined) {
      const id = t.dataset.a, a = all.find(x => x.id === id);
      const ans = store.answers[id] || (store.answers[id] = {});
      if (ans[t.dataset.q] === undefined) { ans[t.dataset.q] = +t.dataset.o; save(); }
      document.getElementById("quiz-" + id).innerHTML = "<h3>Quiz</h3>" + quizHTML(a);
    }
  });
  document.addEventListener("keydown", e => {
    const k = e.target.closest && e.target.closest(".kwd");
    if (k && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); k.classList.toggle("show"); }
  });
})();
