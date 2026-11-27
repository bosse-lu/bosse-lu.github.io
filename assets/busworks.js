/* Blame the bus! · the paper worksheets on the site (5e and 4e).
   Adds two tabs to late-bus/ and late-bus-4e/: "Before reading" (the anticipation sheet, with a drawn London bus scene)
   and "Activities" (the activities of the student sheet, same numbers as on paper), so the class can work on paper and on the site.
   Answers are kept with the page's own state (state.sheet), so the sequence progress counts them. */
(function () {
  if (typeof state === "undefined" || typeof save !== "function") return;
  const four = /late-bus-4e/.test(location.pathname);
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
  const T = (en, fr) => window.Consigne ? Consigne.t(en, fr) : en;
  const norm = s => String(s || "").toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  const SH = state.sheet = Object.assign({v: {}, done: {}}, state.sheet || {});
  let tmo = null; const store = () => { clearTimeout(tmo); tmo = setTimeout(save, 250); };
  const done = id => { if (!SH.done[id]) { SH.done[id] = 1; save(); } progress(); };
  function say(t) {
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = ($("#accent") || {}).value || "en-GB"; u.rate = .9;
      const v = speechSynthesis.getVoices().find(x => x.lang.replace("_", "-") === u.lang); if (v) u.voice = v; speechSynthesis.speak(u); } catch (e) {}
  }

  /* ---------- a London street, drawn (the article photo is shown in class or on the paper sheet) ---------- */
  const bus = (x, y, s, route, dest) => `<g transform="translate(${x} ${y}) scale(${s})">
    <rect x="0" y="0" width="210" height="150" rx="16" fill="#d7262e" stroke="#1b2340" stroke-width="3"/>
    <rect x="12" y="14" width="186" height="40" rx="6" fill="#bfe1f5" stroke="#1b2340" stroke-width="2.5"/>
    <path d="M58 14v40M104 14v40M150 14v40" stroke="#1b2340" stroke-width="2.5"/>
    <rect x="12" y="74" width="140" height="38" rx="6" fill="#bfe1f5" stroke="#1b2340" stroke-width="2.5"/>
    <path d="M58 74v38M104 74v38" stroke="#1b2340" stroke-width="2.5"/>
    <rect x="160" y="70" width="38" height="70" rx="4" fill="#bfe1f5" stroke="#1b2340" stroke-width="2.5"/>
    <path d="M179 70v70" stroke="#1b2340" stroke-width="2"/>
    <rect x="0" y="58" width="210" height="10" fill="#b51d24"/>
    <rect x="14" y="117" width="60" height="16" rx="3" fill="#1b2340"/><text x="44" y="129" text-anchor="middle" font-size="12" font-weight="800" fill="#ffd23f" font-family="Verdana,sans-serif">${route}</text>
    <text x="82" y="129" font-size="10" font-weight="700" fill="#fff" font-family="Verdana,sans-serif">${dest}</text>
    <circle cx="45" cy="152" r="17" fill="#1b2340"/><circle cx="45" cy="152" r="7" fill="#9aa1bd"/>
    <circle cx="165" cy="152" r="17" fill="#1b2340"/><circle cx="165" cy="152" r="7" fill="#9aa1bd"/></g>`;
  const person = (x, c) => `<g transform="translate(${x} 318)"><circle cx="0" cy="-58" r="9" fill="#8a5a3c"/><rect x="-9" y="-48" width="18" height="30" rx="7" fill="${c}"/><rect x="-8" y="-20" width="7" height="22" fill="#1b2340"/><rect x="1" y="-20" width="7" height="22" fill="#1b2340"/><rect x="5" y="-46" width="10" height="13" rx="2" fill="#2f4fd8"/></g>`;
  const SCENE = `<svg class="scene" viewBox="0 0 640 340" role="img" aria-label="A London street: red double-decker buses, Big Ben, a black taxi, a red phone box and students waiting at a bus stop">
    <rect width="640" height="340" fill="#cfe6f7"/>
    <circle cx="560" cy="58" r="26" fill="#ffd23f" opacity=".85"/>
    <g fill="#b9a27a" stroke="#1b2340" stroke-width="2.5">
      <rect x="40" y="70" width="44" height="190"/><path d="M36 70h52l-26-52z"/><path d="M62 18v-12"/>
      <rect x="84" y="140" width="120" height="120"/><rect x="204" y="120" width="60" height="140"/></g>
    <circle cx="62" cy="104" r="15" fill="#fff8e7" stroke="#1b2340" stroke-width="2.5"/><path d="M62 104v-9M62 104l6 4" stroke="#1b2340" stroke-width="2.5" stroke-linecap="round"/>
    <g fill="#1b2340" opacity=".35"><rect x="96" y="156" width="10" height="22"/><rect x="120" y="156" width="10" height="22"/><rect x="144" y="156" width="10" height="22"/><rect x="168" y="156" width="10" height="22"/><rect x="214" y="140" width="10" height="22"/><rect x="238" y="140" width="10" height="22"/></g>
    <rect x="0" y="260" width="640" height="80" fill="#8a8fa3"/><rect x="0" y="318" width="640" height="22" fill="#c9ccd6"/>
    <path d="M0 290h640" stroke="#fff" stroke-width="4" stroke-dasharray="26 22"/>
    ${bus(250, 120, .95, "W14", "LEYTON")}
    ${bus(455, 150, .72, "W12", "WOODFORD")}
    <g transform="translate(150 266)"><rect x="0" y="0" width="70" height="28" rx="10" fill="#1b2340"/><rect x="10" y="-14" width="44" height="18" rx="6" fill="#1b2340"/><circle cx="16" cy="30" r="8" fill="#333"/><circle cx="56" cy="30" r="8" fill="#333"/><rect x="18" y="-11" width="14" height="11" fill="#bfe1f5"/><rect x="36" y="-11" width="14" height="11" fill="#bfe1f5"/></g>
    <g transform="translate(18 250)"><rect x="0" y="0" width="30" height="68" rx="4" fill="#d7262e" stroke="#1b2340" stroke-width="2.5"/><rect x="5" y="14" width="20" height="40" fill="#bfe1f5" stroke="#1b2340" stroke-width="1.5"/><text x="15" y="10" text-anchor="middle" font-size="6.5" font-weight="800" fill="#fff" font-family="Verdana,sans-serif">PHONE</text></g>
    <g transform="translate(600 230)"><path d="M0 0v88" stroke="#1b2340" stroke-width="4"/><circle cx="0" cy="-8" r="17" fill="#fff" stroke="#d7262e" stroke-width="5"/><rect x="-19" y="-12" width="38" height="8" fill="#2f4fd8"/><rect x="-16" y="12" width="32" height="18" rx="3" fill="#1b2340"/><text x="0" y="25" text-anchor="middle" font-size="10" font-weight="800" fill="#ffd23f" font-family="Verdana,sans-serif">W14</text></g>
    ${person(520, "#2f4fd8")}${person(546, "#1f8a55")}${person(572, "#8a3fc7")}${person(498, "#c27a00")}
    <g transform="translate(468 112)"><rect x="0" y="0" width="70" height="22" rx="11" fill="#fff" stroke="#1b2340" stroke-width="2"/><text x="35" y="15" text-anchor="middle" font-size="11" font-weight="700" fill="#1b2340" font-family="Verdana,sans-serif">8:42 ⏰</text></g>
  </svg>`;

  /* ---------- the two sheets ---------- */
  const TITLE = "London school pupils handed detentions for lateness after TfL change bus routes";
  const ANTE = {
    title: four
      ? [["city", "a city", "", /london/], ["people", "the people in the article", "another word for students", /pupil/], ["problem", "a problem", "", /lateness|late/], ["punish", "a punishment", "une punition", /detention/], ["cause", "the cause of the problem", "", /tfl|bus route|change/]]
      : [["city", "a city", "", /london/], ["problem", "a problem", "", /lateness|late/], ["punish", "a punishment", "une punition", /detention/]],
    source: [["paper", "The newspaper is called…", /independent/], ["journalist", "The journalist is…", /amelia|neath/], ["date", "It was published on…", /4 april|april 4|04 04|4 4 2025|friday/], ["country", "The newspaper is from… (country)", /uk|united kingdom|england|britain|great britain|english|british/]]
  };
  const SEE = [["red buses", 1], ["double-decker buses", 1], ["a bus stop", 1], ["Big Ben", 1], ["a black taxi", 1], ["students waiting", 1], ["a beach", 0], ["the Eiffel Tower", 0]];
  const ACT = four ? {
    id: [["school", "Name of the school", /woodbridge/], ["where", "Where is it?", /london|woodford/], ["many", "How many students?", /2 ?000|two thousand/], ["changed", "What has TfL changed?", /route|line|bus|w14|w12/], ["conseq", "What's the consequence for the students?", /late|detention|wait/], ["who", "Who took action? What did he do?", /clifton|deputy/]],
    tf: [["a", "Most students walk to school.", "F", 1], ["b", "There are fewer W14 buses now.", "T", 2], ["c", "When the buses are crowded, they sometimes don't stop.", "T", 3], ["d", "The students think it's their fault.", "F", 4], ["e", "Mr Clifton asked TfL for a special bus.", "T", 5], ["f", "The school still gives detentions for bus lateness.", "F", 6], ["g", "TfL agrees with the school.", "F", 7]],
    sum: ["a. TfL has cancelled the W14 bus, so the students can't go to school any more.", "b. Since TfL changed two bus routes, the students have often been late. The school punished them, then stopped the detentions, but TfL defends its new routes.", "c. The students were late because they overslept, so the deputy headteacher wrote to their parents."], sumA: 1,
    link: {n: 4, title: "Because, because of, so or That's why?", fr: "Complète. Attention : because + une phrase, because of + un nom.", opts: ["because", "because of", "so", "That's why"], items: [
      ["The students were late", "the buses.", "because of"], ["The buses are crowded.", "they don't stop.", ["That's why", "so"]], ["The students got a detention", "they arrived late.", "because"],
      ["It wasn't the students' fault,", "the school stopped the detentions.", "so"], ["The school stopped the detentions", "the bus problem.", "because of"], ["Mr Clifton wanted to help the students.", "he wrote to TfL.", ["That's why", "so"]]]},
    ed: {n: 6, verbs: {changed: "d", waited: "id", arrived: "d", decided: "id", asked: "t", stopped: "t"}},
    note: {n: 7, situ: ["Tu es élève à Woodbridge High School. Ce matin, le W14 était bondé et ne s'est pas arrêté : tu as attendu 20 minutes. Écris un mot à ton professeur, Mr Kalaghan.", "This morning the W14 was crowded and didn't stop: you waited 20 minutes. Write a note to your teacher, Mr Kalaghan."],
      gaps: ["Dear Mr ", ["Kalaghan", /kalaghan/], ", I'm sorry I'm late. I ", ["waited", /^waited$/], " at the bus stop for 20 minutes, but the W14 didn't stop ", ["because", /^because$/], " it was ", ["crowded", /crowded|full/], ". It isn't my ", ["fault", /^fault$/], ": the bus ", ["hasn't", /^(hasn't|hasnt|has not)$/], " come!"],
      checks: [["because or because of", /\bbecause\b/], ["a verb in the past (-ed)", /\b\w{3,}ed\b/], ["the present perfect (the bus hasn't come, I've missed…)", /\b(has|have|hasn't|haven't|i've|it's)\s+(not\s+)?(come|missed|been|waited|arrived|stopped|gone)\b/], ["★★★ so or That's why", /\bso\b|that'?s why/]]},
    med: {n: 8, rows: ["Où ça se passe ?", "Quel est le problème ?", "Comment réagissent les élèves ?", "Qu'est-ce qui a changé depuis ?", "Que répond TfL ? Qui a raison selon nous ?"]},
    pp: true
  } : {
    id: [["school", "Name of the school", /woodbridge/], ["where", "Where is it?", /london|woodford/], ["many", "How many students?", /2 ?000|two thousand/], ["problem", "What's the problem?", /bus|late|full/], ["who", "Who wrote a letter?", /clifton|deputy/], ["whom", "To whom? (à qui ?)", /tfl|transport/]],
    tf: [["a", "The school is in the south of London.", "F", 1], ["b", "Now there are three W14 buses an hour.", "F", 2], ["c", "Sometimes the buses don't stop.", "T", 3], ["d", "The students were happy.", "F", 4], ["e", "The deputy headteacher wrote to TfL.", "T", 5], ["f", "Today, students still get a detention when the bus is late.", "F", 6]],
    sum: ["a. Students in London are late because they overslept.", "b. Students in London are late because of the buses, and their school punished them.", "c. A London bus driver is late for work every day."], sumA: 1,
    link: {n: 4, title: "Because or so?", fr: "Relie les deux phrases avec because ou so. Attention : la cause n'est pas toujours en premier !", opts: ["because", "so"], items: [
      ["The buses are late.", "the students arrive late.", "so"], ["The students got a detention", "they arrived late.", "because"], ["The students were angry", "the detentions were not fair.", "because"], ["The buses are full.", "some students walk home.", "so"]]},
    ed: {n: 5, verbs: {changed: "d", waited: "id", arrived: "d", asked: "t"}},
    note: {n: 6, situ: ["Tu es élève à Woodbridge High School. Ce matin, le bus W14 était en retard de 15 minutes. Écris un mot à ton professeur, Mr Kalaghan.", "This morning the W14 bus was 15 minutes late. Write a note to your teacher, Mr Kalaghan."],
      gaps: ["Dear Mr ", ["Kalaghan", /kalaghan/], ", I'm sorry I was late this morning because the ", ["bus", /bus|w14/], " arrived late. I waited at the ", ["bus", /^bus$/], " ", ["stop", /^stop$/], " for ", ["15", /^(15|fifteen)$/], " minutes."],
      checks: [["Dear Mr Kalaghan", /dear/], ["sorry", /sorry/], ["because", /\bbecause\b/], ["a verb in the past (waited, arrived…)", /\b(waited|arrived|was|missed|stopped)\b/]]},
    med: {n: 7, rows: ["Où ça se passe ?", "Quel est le problème ?", "Comment réagissent les élèves ?", "Qu'est-ce qui a changé ?"]}
  };
  const PP = [["3", /have often been|have been/, "+"], ["4", /haven't done|have not done|haven t done/, "-"], ["4b", /hasn't come|has not come|hasn t come/, "-"], ["6", /has stopped/, "+"]];

  /* ---------- items counted in the progress (sequence) ---------- */
  const ITEMS = ["a1", "a2", "a3", "a4", "a5"].concat(["id"], ACT.tf.map(t => "tf" + t[0]), ["sum"], ACT.link.items.map((_, i) => "lk" + i), ACT.pp ? ["pp"] : [], ["ed", "note"]);
  window.BUS_SHEET_TOTAL = ITEMS.length;
  function progress() {
    const n = ITEMS.filter(i => SH.done[i]).length;
    $$("[data-sheet-pc]").forEach(e => { e.textContent = `${n} / ${ITEMS.length}`; });
  }

  /* ---------- helpers ---------- */
  const val = k => SH.v[k] || "";
  const inp = (k, ph, w) => `<input class="sw-in" data-k="${k}" value="${esc(val(k))}" placeholder="${esc(ph || "")}" autocomplete="off" spellcheck="false"${w ? ` style="width:${w}"` : ""}>`;
  const opts = (k, list, multi) => `<span class="sw-opts" data-k="${k}"${multi ? " data-multi" : ""}>${list.map(o => { const on = multi ? (val(k) || []).includes(o) : val(k) === o; return `<button type="button" class="sw-o${on ? " on" : ""}" data-o="${esc(o)}">${esc(o)}</button>`; }).join("")}</span>`;
  const box = (n, en, fr, body, id) => `<div class="sw-card" data-id="${id || ""}"><h3><span class="sw-n">${n}</span>${en} <span class="sw-ok" ${id && SH.done[id] ? "" : "hidden"}>✓</span></h3>${fr ? `<p class="sw-fr">${T(fr[0], fr[1])}</p>` : ""}${body}<p class="sw-fb" aria-live="polite"></p></div>`;
  const chk = id => `<div class="sw-act"><button type="button" class="btn primary" data-chk="${id}">Check</button></div>`;

  /* ---------- render: Before reading ---------- */
  function renderAnte() {
    $("#ante").innerHTML = `
      <div class="sw-intro"><p>${T("Before reading, discover the article: the picture, the title and the source. Same questions as your sheet « Before reading: what is it? ».", "Avant de lire, découvre l'article : l'image, le titre et la source. Ce sont les questions de ta fiche d'anticipation.")}</p></div>
      <figure class="sw-fig">${SCENE}<figcaption>${T("A street in London, drawn for the class. In class, your teacher shows you the real photo of the article.", "Une rue de Londres, dessinée pour la classe. En classe, ton professeur te montre la vraie photo de l'article.")}</figcaption></figure>
      <div class="sw-paper"><p class="sw-k">The article</p><p class="sw-title" lang="en">“${TITLE}”</p><p class="sw-src"><i>The Independent</i> · by Amelia Neath · Friday 4 April 2025</p></div>
      ${box(1, "What is it?", ["Choose the right answer, then the clues that help you.", "Coche la bonne réponse, puis les indices qui t'aident."],
        `<p>${opts("a1", ["a poster", "a newspaper article", "a letter", "an advertisement"])}</p>
         <p class="sw-q">How do you know? <small>${T("Tick the clues.", "Coche les indices.")}</small></p>
         <p>${opts("a1b", ["there is a title", "there is a date", "there is the name of a newspaper", "there is the name of a journalist", "there is a photo"], true)}</p>${chk("a1")}`, "a1")}
      ${box(2, "Look at the picture.", ["What can you see? Where is it?", "Que vois-tu ? Où est-ce ?"],
        `<p class="sw-q">I can see… <small>${T("Tick what you can see.", "Coche ce que tu vois.")}</small></p><p>${opts("a2", SEE.map(s => s[0]), true)}</p>
         <p class="sw-q">I think it's in…</p><p>${opts("a2b", ["London", "Paris", "New York", "Cayenne"])}</p>${chk("a2")}`, "a2")}
      ${box(3, "Read the title.", ["Find in the title:", "Trouve dans le titre :"],
        `<p class="sw-title sm" lang="en">“${TITLE}” <button type="button" class="sw-say" data-say="${esc(TITLE)}" aria-label="Listen">▶</button></p>
         <div class="sw-rows">${ANTE.title.map(([k, en, fr]) => `<label><span>${en}${fr ? ` <small>(${fr})</small>` : ""} →</span>${inp("a3." + k, "")}</label>`).join("")}</div>
         ${four ? `<p class="sw-q">TfL is… <small>${T("Guess!", "Devine !")}</small></p><p>${opts("a3.tfl", ["a school", "a newspaper", "a transport company"])}</p>` : ""}${chk("a3")}`, "a3")}
      ${box(4, "The source.", null, `<div class="sw-rows">${ANTE.source.map(([k, en]) => `<label><span>${en}</span>${inp("a4." + k, "")}</label>`).join("")}</div>${chk("a4")}`, "a4")}
      ${box(5, four ? "My hypotheses." : "My hypothesis.", ["Write, then check after reading the text.", "Écris, puis vérifie après la lecture du texte."],
        `<div class="sw-rows wide"><label><span>I think the pupils are late because…</span>${inp("a5", "…the buses…")}</label>
         ${four ? `<label><span>In my opinion, the detentions are fair / unfair because…</span>${inp("a5b", "")}</label>` : ""}</div>${chk("a5")}`, "a5")}
      <div class="sw-next"><button type="button" class="btn primary" data-goto="read">${T("Now read the text →", "Maintenant, lis le texte →")}</button></div>`;
  }

  /* ---------- render: Activities ---------- */
  function renderActs() {
    const A = ACT, L = A.link;
    $("#acts").innerHTML = `
      <div class="sw-intro"><p>${T(`The activities of your sheet, with the same numbers. Read the text again (tab 2) to answer. My sheet: <b data-sheet-pc></b>`, `Les activités de ta fiche, avec les mêmes numéros. Relis le texte (onglet 2) pour répondre.`)}</p></div>
      <h2 class="sw-h">Read and understand</h2>
      ${box(1, "Complete the ID card of the article.", ["Pair work: complete with your neighbour.", "Complète la carte d'identité avec ton voisin."],
        `<div class="sw-rows">${A.id.map(([k, en]) => `<label><span>${en}</span>${inp("id." + k, "")}</label>`).join("")}</div>${chk("id")}`, "id")}
      ${box(2, "True or false?", ["★ Tick. ★★ Justify: which paragraph?", "★ Coche. ★★ Justifie : quel paragraphe ?"],
        `<div class="sw-tf">${A.tf.map(([k, s]) => `<div class="sw-tfr" data-tf="${k}"><span lang="en">${k}. ${esc(s)}</span>${opts("tf." + k, ["T", "F"])}<span class="sw-par">[¶] ${opts("tfp." + k, ["1", "2", "3", "4", "5", "6", "7"])}</span></div>`).join("")}</div>${chk("tf")}`, "tf")}
      ${box(3, "Choose the best summary.", ["Check that you understood the main idea.", "Tu vérifies que tu as compris l'essentiel du texte."],
        `<div class="sw-sum">${opts("sum", A.sum)}</div>${chk("sum")}`, "sum")}
      <h2 class="sw-h">Language</h2>
      ${box(L.n, L.title, [L.title, L.fr],
        `<div class="sw-link">${L.items.map(([a, b], i) => `<p lang="en">${String.fromCharCode(97 + i)}. ${esc(a)} ${opts("lk" + i, L.opts)} ${esc(b)}</p>`).join("")}</div>${chk("lk")}`, "lk")}
      ${A.pp ? box(5, "The present perfect.", ["Find 4 verbs in the present perfect (have / has + past participle).", "Trouve dans le texte 4 verbes au present perfect (have / has + participe passé)."],
        `<div class="sw-rows">${PP.map(([p]) => `<label><span>[${p.replace("b", "")}]</span>${inp("pp." + p, "have / has …")}${opts("ppn." + p, ["positive", "negative"])}</label>`).join("")}</div>
         <p class="sw-q">Which words come before the present perfect in paragraphs [3] and [6]? ${inp("pp.since", "", "10em")}</p>
         <p class="sw-q">Why the present perfect?</p><p>${opts("pp.why", ["The action happened at a precise moment and it's finished.", "It started in the past and it's still true now."])}</p>${chk("pp")}`, "pp") : ""}
      ${box(A.ed.n, "The sounds of -ed.", [`Find ${Object.keys(A.ed.verbs).length} regular verbs in -ed in the text, then choose the sound of -ed. Practise in tab 4 (Lab -ed).`, `Trouve dans le texte ${Object.keys(A.ed.verbs).length} verbes réguliers en -ed, puis choisis le son de -ed. Entraîne-toi dans l'onglet 4 (Lab -ed).`],
        `<div class="sw-rows">${Object.keys(A.ed.verbs).map((_, i) => `<label><span>Verb ${i + 1}</span>${inp("ed.v" + i, "…ed", "9em")}${opts("ed.s" + i, ["/t/", "/d/", "/ɪd/"])}</label>`).join("")}</div>${chk("ed")}`, "ed")}
      <h2 class="sw-h">Your turn</h2>
      ${box(A.note.n, "Write an excuse note.", [A.note.situ[1], A.note.situ[0]],
        `<p class="sw-q">★ ${T("Complete:", "Complète :")}</p><p class="sw-gaps" lang="en">${A.note.gaps.map((g, i) => typeof g === "string" ? esc(g) : inp("ng." + i, "", Math.max(5, g[0].length + 2) + "ch")).join("")}</p>
         <p class="sw-q">★★ ${T(four ? "Write your note in 4 or 5 lines." : "Write your note in 3 or 4 lines.", four ? "Écris ton mot en quatre ou cinq lignes." : "Écris ton mot en trois ou quatre lignes.")}</p>
         <textarea class="sw-ta" data-k="note.free" rows="5" lang="en" spellcheck="false" placeholder="Dear Mr Kalaghan, …">${esc(val("note.free"))}</textarea>
         <ul class="sw-checks" id="sw-checks"></ul>${chk("note")}`, "note")}
      <h2 class="sw-h">End of the lesson</h2>
      ${box(A.med.n, "Médiation collective · in class", ["A classmate was absent and didn't read the article. Together, explain it in French. Write the sentence chosen by the class.", "Un camarade absent n'a pas lu l'article. Ensemble, expliquez-le en français. Note la phrase retenue par la classe."],
        `<div class="sw-rows wide">${A.med.rows.map((r, i) => `<label><span>${r}</span>${inp("med." + i, "")}</label>`).join("")}</div>`)}
    `;
    progress(); noteChecks();
  }

  /* ---------- checking ---------- */
  const mark = (el, ok) => { if (el) { el.classList.toggle("right", ok); el.classList.toggle("wrong", !ok); } };
  const fb = (card, ok, en, fr) => { const f = $(".sw-fb", card); f.className = "sw-fb " + (ok ? "good" : "bad"); f.innerHTML = ok ? T(en || "Well done!", fr || "Bravo !") : T(en || "Not yet: look again.", fr || "Pas encore : regarde encore."); if (ok) { const o = $(".sw-ok", card); if (o) o.hidden = false; } };
  const optBtn = (k, o) => $(`.sw-opts[data-k="${k}"] .sw-o[data-o="${CSS.escape(o)}"]`);
  const CHECK = {
    a1(card) {
      const ok1 = val("a1") === "a newspaper article", clues = val("a1b") || [], need = ["there is a date", "there is the name of a newspaper", "there is the name of a journalist"];
      const ok2 = need.every(c => clues.includes(c));
      mark($(`.sw-opts[data-k="a1"]`, card), ok1); mark($(`.sw-opts[data-k="a1b"]`, card), ok2);
      if (ok1 && ok2) { done("a1"); fb(card, true, "Yes! The newspaper, the date and the journalist show it's an article.", "Oui ! Le journal, la date et la journaliste montrent que c'est un article."); }
      else fb(card, false, ok1 ? "Which clues are only in a newspaper article? (a poster can have a title and a photo too)" : null, ok1 ? "Quels indices sont seulement dans un article ? (une affiche peut aussi avoir un titre et une photo)" : null);
    },
    a2(card) {
      const sel = val("a2") || [], good = SEE.filter(s => s[1]).map(s => s[0]), bad = SEE.filter(s => !s[1]).map(s => s[0]);
      const ok1 = sel.length >= 4 && !sel.some(s => bad.includes(s)), ok2 = val("a2b") === "London";
      mark($(`.sw-opts[data-k="a2"]`, card), ok1); mark($(`.sw-opts[data-k="a2b"]`, card), ok2);
      if (ok1 && ok2) { done("a2"); say("I can see red double-decker buses. I think it's in London."); fb(card, true, "I can see red double-decker buses and Big Ben: it's in London!", "Bus rouges à impériale et Big Ben : c'est Londres !"); }
      else fb(card, false, !ok1 ? "Look again: tick at least 4 things, and nothing that isn't in the picture." : null, !ok1 ? "Regarde encore : coche au moins 4 choses, et rien qui ne soit pas sur l'image." : null);
    },
    a3(card) {
      let all = true;
      ANTE.title.forEach(([k, , , re]) => { const ok = re.test(norm(val("a3." + k))); mark($(`[data-k="a3.${k}"]`, card), ok); all = all && ok; });
      if (four) { const ok = val("a3.tfl") === "a transport company"; mark($(`.sw-opts[data-k="a3.tfl"]`, card), ok); all = all && ok; }
      if (all) { done("a3"); fb(card, true); } else fb(card, false, "Read the title again: the words are there.", "Relis le titre : les mots y sont.");
    },
    a4(card) {
      let all = true;
      ANTE.source.forEach(([k, , re]) => { const ok = re.test(norm(val("a4." + k))); mark($(`[data-k="a4.${k}"]`, card), ok); all = all && ok; });
      if (all) { done("a4"); fb(card, true); } else fb(card, false, "Look at the source under the title.", "Regarde la source sous le titre.");
    },
    a5(card) {
      const ok = norm(val("a5")).split(" ").length >= 3;
      if (ok) { done("a5"); fb(card, true, "Saved! After reading, check: were you right?", "Enregistré ! Après la lecture, vérifie : avais-tu raison ?"); } else fb(card, false, "Write your idea: …because the bus…", "Écris ton idée : …because the bus…");
    },
    id(card) {
      let all = true;
      ACT.id.forEach(([k, , re]) => { const ok = re.test(norm(val("id." + k))); mark($(`[data-k="id.${k}"]`, card), ok); all = all && ok; });
      if (all) { done("id"); fb(card, true); } else fb(card, false, "Look for the answers in paragraphs 1, 2, 3 and 5.", "Cherche les réponses dans les paragraphes 1, 2, 3 et 5.");
    },
    tf(card) {
      let all = true, paras = true;
      ACT.tf.forEach(([k, , a, p]) => {
        const ok = val("tf." + k) === a; mark($(`.sw-opts[data-k="tf.${k}"]`, card), ok); all = all && ok; if (ok) done("tf" + k);
        const pv = val("tfp." + k); if (pv) { const okp = +pv === p; mark($(`.sw-opts[data-k="tfp.${k}"]`, card), okp); paras = paras && okp; }
      });
      if (all) { done("tf"); fb(card, true, paras ? "Well done!" : "True / false: well done! ★★ Check the paragraph numbers in red.", paras ? "Bravo !" : "Vrai / faux : bravo ! ★★ Vérifie les paragraphes en rouge."); }
      else fb(card, false, "Some answers are wrong (in red). Read the paragraph again.", "Des réponses sont fausses (en rouge). Relis le paragraphe.");
    },
    sum(card) {
      const ok = val("sum") === ACT.sum[ACT.sumA]; mark($(`.sw-opts[data-k="sum"]`, card), ok);
      if (ok) { done("sum"); fb(card, true); } else fb(card, false, "Is it really in the text? Read paragraph 3 again.", "Est-ce vraiment dans le texte ? Relis le paragraphe 3.");
    },
    lk(card) {
      let all = true;
      ACT.link.items.forEach((it, i) => { const ans = [].concat(it[2]), v = val("lk" + i); const ok = ans.includes(v); if (v) mark($(`.sw-opts[data-k="lk${i}"]`, card), ok); all = all && ok; if (ok) done("lk" + i); });
      if (all) fb(card, true, "Because (of) = the cause · so / That's why = the consequence.", "Because (of) = la cause · so / That's why = la conséquence.");
      else fb(card, false, "Ask yourself: what happens first, the cause or the consequence?", "Demande-toi : qu'est-ce qui arrive en premier, la cause ou la conséquence ?");
    },
    pp(card) {
      let all = true;
      PP.forEach(([p, re, sign]) => { const ok = re.test(norm(val("pp." + p)).replace(/ t /g, "'t ")) || re.test(String(val("pp." + p)).toLowerCase()); mark($(`[data-k="pp.${p}"]`, card), ok); const okn = val("ppn." + p) === (sign === "+" ? "positive" : "negative"); mark($(`.sw-opts[data-k="ppn.${p}"]`, card), okn); all = all && ok && okn; });
      const oks = /since then/.test(norm(val("pp.since"))); mark($(`[data-k="pp.since"]`, card), oks);
      const okw = val("pp.why") === "It started in the past and it's still true now."; mark($(`.sw-opts[data-k="pp.why"]`, card), okw);
      if (all && oks && okw) { done("pp"); fb(card, true, "Since then + present perfect: it started in the past and it's still true now.", "Since then + present perfect : ça a commencé dans le passé et c'est encore vrai."); }
      else fb(card, false, "Look for have / has + a past participle in paragraphs 3, 4 and 6.", "Cherche have / has + participe passé dans les paragraphes 3, 4 et 6.");
    },
    ed(card) {
      const V = ACT.ed.verbs, seen = new Set(); let all = true;
      Object.keys(V).forEach((_, i) => {
        const w = norm(val("ed.v" + i)), okw = !!V[w] && !seen.has(w); if (okw) seen.add(w);
        mark($(`[data-k="ed.v${i}"]`, card), okw);
        const s = val("ed.s" + i), oks = okw && s && s.replace(/[\/ɪ]/g, m => m === "ɪ" ? "i" : "") === V[w];
        mark($(`.sw-opts[data-k="ed.s${i}"]`, card), !!oks); all = all && okw && oks;
      });
      if (all) { done("ed"); fb(card, true, "/ɪd/ only after the sounds /t/ and /d/: waited" + (four ? ", decided." : "."), "/ɪd/ seulement après les sons /t/ et /d/."); }
      else fb(card, false, "Find each verb only once. /t/ after p, k, f, s, ch, sh · /d/ after a voiced sound · /ɪd/ after t or d.", "Chaque verbe une seule fois. /t/ après p, k, f, s, ch, sh · /d/ après un son voisé · /ɪd/ après t ou d.");
    },
    note(card) {
      let gapsOk = true;
      ACT.note.gaps.forEach((g, i) => { if (typeof g === "string") return; const ok = g[1].test(norm(val("ng." + i))); mark($(`[data-k="ng.${i}"]`, card), ok); gapsOk = gapsOk && ok; });
      const t = String(val("note.free")).toLowerCase().replace(/[’‘]/g, "'"), free = ACT.note.checks.filter(c => !/^★★★/.test(c[0])).every(c => c[1].test(t)) && norm(t).split(" ").length >= 15;
      if (gapsOk || free) { done("note"); fb(card, true, free ? "Your note is ready. Read it aloud!" : "★ Done! Now try ★★: write your own note.", free ? "Ton mot est prêt. Lis-le à voix haute !" : "★ Réussi ! Essaie maintenant ★★ : écris ton propre mot."); }
      else fb(card, false, "★ Check the gaps in red, or ★★ complete your note with the checklist.", "★ Vérifie les trous en rouge, ou ★★ complète ton mot avec la liste.");
      noteChecks();
    }
  };
  function noteChecks() {
    const ul = $("#sw-checks"); if (!ul) return;
    const t = String(val("note.free")).toLowerCase().replace(/[’‘]/g, "'");
    ul.innerHTML = ACT.note.checks.map(([en, re]) => `<li class="${re.test(t) ? "ok" : ""}">${re.test(t) ? "✓" : "○"} ${esc(en)}</li>`).join("") + `<li class="${norm(t).split(" ").length >= 15 ? "ok" : ""}">${norm(t).split(" ").length >= 15 ? "✓" : "○"} ${four ? "4 or 5 lines" : "3 or 4 lines"} (${t.trim() ? norm(t).split(" ").length : 0} words)</li>`;
  }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const o = e.target.closest(".sw-o");
    if (o) {
      const g = o.closest(".sw-opts"), k = g.dataset.k;
      if (g.hasAttribute("data-multi")) { const a = new Set(SH.v[k] || []); a.has(o.dataset.o) ? a.delete(o.dataset.o) : a.add(o.dataset.o); SH.v[k] = [...a]; o.classList.toggle("on"); }
      else { SH.v[k] = o.dataset.o; $$(".sw-o", g).forEach(b => b.classList.toggle("on", b === o)); }
      g.classList.remove("right", "wrong"); store(); return;
    }
    const c = e.target.closest("[data-chk]"); if (c) { CHECK[c.dataset.chk](c.closest(".sw-card")); return; }
    const s = e.target.closest(".sw-say"); if (s) { say(s.dataset.say); return; }
    const gt = e.target.closest("[data-goto]"); if (gt && typeof showTab === "function") { showTab(gt.dataset.goto); window.scrollTo({top: $(".tabs").offsetTop - 10, behavior: "smooth"}); }
  });
  document.addEventListener("input", e => {
    const el = e.target.closest(".sw-in, .sw-ta"); if (!el) return;
    SH.v[el.dataset.k] = el.value; el.classList.remove("right", "wrong"); store();
    if (el.classList.contains("sw-ta")) noteChecks();
  });

  /* ---------- styles ---------- */
  const css = document.createElement("style");
  css.textContent = `
.tabs{grid-template-columns:repeat(4,1fr)!important}
@media (max-width:620px){.tabs{grid-template-columns:1fr 1fr!important}}
.sw-intro{background:var(--accent-soft);border-radius:14px;padding:10px 14px;margin:0 0 12px}
.sw-intro p{margin:0}
.sw-fig{margin:0 0 12px}.sw-fig svg{width:100%;height:auto;border-radius:14px;border:1px solid var(--line);display:block}
.sw-fig figcaption{font-size:.85rem;color:var(--muted);margin-top:4px}
.sw-paper{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--mark);border-radius:12px;padding:10px 14px;margin:0 0 12px}
.sw-k{margin:0;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.sw-title{font-family:var(--display);font-weight:800;font-size:1.15rem;margin:4px 0}.sw-title.sm{font-size:1rem}
.sw-src{margin:0;color:var(--muted)}
.sw-card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin:0 0 12px}
.sw-card h3{margin:0 0 6px;font-family:var(--display);font-size:1.08rem;display:flex;align-items:center;gap:8px}
.sw-n{flex:none;display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--ink);color:var(--paper);font-size:.9rem}
.sw-ok{color:var(--good);font-weight:800}
.sw-fr{margin:0 0 8px;color:var(--muted);font-size:.92rem}
.sw-q{margin:10px 0 4px;font-weight:700}.sw-q small{font-weight:400;color:var(--muted)}
.sw-opts{display:inline-flex;flex-wrap:wrap;gap:6px;vertical-align:middle;border-radius:10px;padding:2px}
.sw-opts.right{outline:2px solid var(--good)}.sw-opts.wrong{outline:2px solid var(--bad)}
.sw-o{font:inherit;font-size:.92rem;border:1.5px solid var(--line);background:var(--paper);color:var(--ink);border-radius:999px;padding:5px 11px;cursor:pointer;text-align:left}
.sw-o.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.sw-sum .sw-opts{display:flex;flex-direction:column}.sw-sum .sw-o{border-radius:10px}
.sw-rows{display:grid;gap:8px}.sw-rows label{display:grid;grid-template-columns:minmax(9em,40%) 1fr;gap:8px;align-items:center}
.sw-rows label .sw-opts{grid-column:2}
.sw-rows.wide label{grid-template-columns:1fr}
.sw-rows span small{color:var(--muted)}
@media (max-width:520px){.sw-rows label{grid-template-columns:1fr}.sw-rows label .sw-opts{grid-column:1}}
.sw-in,.sw-ta{font:inherit;color:var(--ink);background:var(--paper);border:1.5px solid var(--line);border-radius:9px;padding:6px 9px;min-width:0;width:100%;box-sizing:border-box}
.sw-gaps .sw-in{width:auto;padding:3px 6px}
.sw-in.right,.sw-ta.right{border-color:var(--good);background:var(--good-soft)}.sw-in.wrong{border-color:var(--bad);background:var(--bad-soft)}
.sw-gaps{line-height:2.4}
.sw-tfr{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;padding:6px 0;border-top:1px dashed var(--line)}
.sw-tfr>span:first-child{flex:1 1 16em}
.sw-par{font-size:.85rem;color:var(--muted)}.sw-par .sw-o{padding:3px 8px;font-size:.82rem}
.sw-link p{margin:8px 0;line-height:2}
.sw-act{margin-top:10px}
.sw-fb{margin:8px 0 0;font-weight:700}.sw-fb.good{color:var(--good)}.sw-fb.bad{color:var(--bad)}
.sw-checks{list-style:none;padding:0;margin:8px 0 0;display:flex;flex-wrap:wrap;gap:6px}
.sw-checks li{border:1px solid var(--line);border-radius:999px;padding:3px 10px;font-size:.85rem;color:var(--muted)}
.sw-checks li.ok{border-color:var(--good);color:var(--good);background:var(--good-soft)}
.sw-h{font-family:var(--display);font-size:1.2rem;margin:18px 0 8px}
.sw-next{margin:4px 0 12px;text-align:right}
.sw-say{border:none;background:var(--accent-soft);color:var(--accent);border-radius:50%;width:30px;height:30px;cursor:pointer}`;
  document.head.appendChild(css);

  renderAnte(); renderActs();
  if (window.Consigne && Consigne.refresh) Consigne.refresh();
})();
