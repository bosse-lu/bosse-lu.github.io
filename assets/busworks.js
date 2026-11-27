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

  /* ---------- the authentic photo of the two buses of the article (W12 and W14, London) ---------- */
  const SCENE = `<img src="../assets/img/bus-w12-w14.jpg" width="1170" height="530" alt="Two red London buses: on the left the W12, on the right the W14 to Whipps Cross, both run by Stagecoach">`;

  /* ---------- the two sheets ---------- */
  const TITLE = "London school pupils handed detentions for lateness after TfL change bus routes";
  const ANTE = {
    title: four
      ? [["city", "a city", "", /london/], ["people", "the people in the article", "another word for students", /pupil/], ["problem", "a problem", "", /lateness|late/], ["punish", "a punishment", "une punition", /detention/], ["cause", "the cause of the problem", "", /tfl|bus route|change/]]
      : [["city", "a city", "", /london/], ["problem", "a problem", "", /lateness|late/], ["punish", "a punishment", "une punition", /detention/]],
    source: [["paper", "The newspaper is called…", /independent/], ["journalist", "The journalist is…", /amelia|neath/], ["date", "It was published on…", /4 april|april 4|04 04|4 4 2025|friday/], ["country", "The newspaper is from… (country)", /uk|united kingdom|england|britain|great britain|english|british/]]
  };
  // Activity 1 "How do you know?": the clue, then the element that proves it
  const CLUES = [["title", "there is a title", /late for school|blame the bus|london school pupils/, "Late for school? Blame the bus!"], ["date", "there is a date", /4 april|april 4|friday|2025/, "Friday 4 April 2025"],
    ["paper", "there is the name of a newspaper", /independent/, "The Independent"], ["journalist", "there is the name of a journalist", /amelia|neath/, "Amelia Neath"], ["photo", "there is a photo", /bus|w12|w14|red|stagecoach/, "two red buses"]];
  const NEED = ["date", "paper", "journalist"];
  const MODEL2 = ["I can see two red buses: the W12 and the W14. The name of the company is Stagecoach. I think it's in London.",
    "I can see two red buses: the W12 and the W14 to Whipps Cross. The name of the company is Stagecoach. I think it's in London because London buses are red."];
  const ACT = four ? {
    id: [["school", "Name of the school", /woodbridge/], ["where", "Where is it?", /london|woodford/], ["many", "How many students?", /2 ?000|two thousand/], ["changed", "What has TfL changed?", /route|line|bus|w14|w12/], ["conseq", "What's the consequence for the students?", /late|detention|wait/], ["who", "Who took action? What did he do?", /clifton|deputy/]],
    tf: [["a", "Most students walk to school.", "F", 1], ["b", "There are fewer W14 buses now.", "T", 2], ["c", "When the buses are crowded, they sometimes don't stop.", "T", 3], ["d", "The students think it's their fault.", "F", 4], ["e", "Mr Clifton asked TfL for a special bus.", "T", 5], ["f", "The school still gives detentions for bus lateness.", "F", 6], ["g", "TfL agrees with the school.", "F", 7]],
    sum: ["a. TfL has cancelled the W14 bus, so the students can't go to school any more.", "b. Since TfL changed two bus routes, the students have often been late. The school punished them, then stopped the detentions, but TfL defends its new routes.", "c. The students were late because they overslept, so the deputy headteacher wrote to their parents."], sumA: 1,
    link: {n: 5, title: "Because, because of, so or That's why?", fr: "Complète. Attention : because + une phrase, because of + un nom.", opts: ["because", "because of", "so", "That's why"], items: [
      ["The students were late", "the buses.", "because of"], ["The buses are crowded.", "they don't stop.", ["That's why", "so"]], ["The students got a detention", "they arrived late.", "because"],
      ["It wasn't the students' fault,", "the school stopped the detentions.", "so"], ["The school stopped the detentions", "the bus problem.", "because of"], ["Mr Clifton wanted to help the students.", "he wrote to TfL.", ["That's why", "so"]]]},
    ed: {n: 7, verbs: {changed: "d", waited: "id", arrived: "d", decided: "id", asked: "t", stopped: "t"}},
    note: {n: 8, situ: ["Tu es élève à Woodbridge High School. Ce matin, le W14 était bondé et ne s'est pas arrêté : tu as attendu 20 minutes. Écris un mot à ton professeur, Mr Kalaghan.", "This morning the W14 was crowded and didn't stop: you waited 20 minutes. Write a note to your teacher, Mr Kalaghan."],
      gaps: ["Dear Mr ", ["Kalaghan", /kalaghan/], ", I'm sorry I'm late. I ", ["waited", /^waited$/], " at the bus stop for 20 minutes, but the W14 didn't stop ", ["because", /^because$/], " it was ", ["crowded", /crowded|full/], ". It isn't my ", ["fault", /^fault$/], ": the bus ", ["hasn't", /^(hasn't|hasnt|has not)$/], " come!"],
      checks: [["because or because of", /\bbecause\b/], ["a verb in the past (-ed)", /\b\w{3,}ed\b/], ["the present perfect (the bus hasn't come, I've missed…)", /\b(has|have|hasn't|haven't|i've|it's)\s+(not\s+)?(come|missed|been|waited|arrived|stopped|gone)\b/], ["★★★ so or That's why", /\bso\b|that'?s why/]]},
    med: {n: 9, rows: ["Où ça se passe ?", "Quel est le problème ?", "Comment réagissent les élèves ?", "Qu'est-ce qui a changé depuis ?", "Que répond TfL ? Qui a raison selon nous ?"]},
    pp: true
  } : {
    id: [["school", "Name of the school", /woodbridge/], ["where", "Where is it?", /london|woodford/], ["many", "How many students?", /2 ?000|two thousand/], ["problem", "What's the problem?", /bus|late|full/], ["who", "Who wrote a letter?", /clifton|deputy/], ["whom", "To whom? (à qui ?)", /tfl|transport/]],
    tf: [["a", "The school is in the south of London.", "F", 1], ["b", "Now there are three W14 buses an hour.", "F", 2], ["c", "Sometimes the buses don't stop.", "T", 3], ["d", "The students were happy.", "F", 4], ["e", "The deputy headteacher wrote to TfL.", "T", 5], ["f", "Today, students still get a detention when the bus is late.", "F", 6]],
    sum: ["a. Students in London are late because they overslept.", "b. Students in London are late because of the buses, and their school punished them.", "c. A London bus driver is late for work every day."], sumA: 1,
    link: {n: 5, title: "Because or so?", fr: "Relie les deux phrases avec because ou so. Attention : la cause n'est pas toujours en premier !", opts: ["because", "so"], items: [
      ["The buses are late.", "the students arrive late.", "so"], ["The students got a detention", "they arrived late.", "because"], ["The students were angry", "the detentions were not fair.", "because"], ["The buses are full.", "some students walk home.", "so"]]},
    ed: {n: 6, verbs: {changed: "d", waited: "id", arrived: "d", asked: "t"}},
    note: {n: 7, situ: ["Tu es élève à Woodbridge High School. Ce matin, le bus W14 était en retard de 15 minutes. Écris un mot à ton professeur, Mr Kalaghan.", "This morning the W14 bus was 15 minutes late. Write a note to your teacher, Mr Kalaghan."],
      gaps: ["Dear Mr ", ["Kalaghan", /kalaghan/], ", I'm sorry I was late this morning because the ", ["bus", /bus|w14/], " arrived late. I waited at the ", ["bus", /^bus$/], " ", ["stop", /^stop$/], " for ", ["15", /^(15|fifteen)$/], " minutes."],
      checks: [["Dear Mr Kalaghan", /dear/], ["sorry", /sorry/], ["because", /\bbecause\b/], ["a verb in the past (waited, arrived…)", /\b(waited|arrived|was|missed|stopped)\b/]]},
    med: {n: 8, rows: ["Où ça se passe ?", "Quel est le problème ?", "Comment réagissent les élèves ?", "Qu'est-ce qui a changé ?"]}
  };
  // Part 1 (paragraphs 1 to 3): the first five verbs in the past, then the summary. Part 2 (paragraphs 4 to 7): true or false, then the summary.
  const VERBS = [["changed", 2, "change"], ["were", 2, "be"], ["waited", 3, "wait"], ["arrived", 3, "arrive"], ["got", 3, "get"]];
  const P1 = four ? {sum: ["a. TfL has cancelled the W14, so the students can't go to school any more.",
      "b. Since TfL changed two bus routes, the buses have often been late or crowded, so many students have arrived late and got detentions.",
      "c. The buses are crowded because more students take the bus, so the school has given detentions to the bus drivers."], a: 1}
    : {sum: ["a. Woodbridge High School has a new bus, so the students arrive early.",
      "b. TfL changed two bus lines. Now the buses are often late or full, so the students arrive late and get detentions.",
      "c. The students overslept, so they missed the bus and got a detention."], a: 1};
  const P2 = four ? {tf: [["a", "The students think it's their fault.", "F", 4], ["b", "The students say they haven't done anything wrong.", "T", 4], ["c", "Mr Clifton decided to do nothing.", "F", 5], ["d", "Mr Clifton asked TfL for a special bus.", "T", 5], ["e", "The school still gives detentions for bus lateness.", "F", 6], ["f", "TfL agrees with the school.", "F", 7], ["g", "According to TfL, the new routes help people go to the hospital.", "T", 7]],
      sum: ["a. The students accepted the detentions, and TfL has put the old routes back.",
        "b. The students protested, the deputy headteacher took action and the school has stopped the detentions, but TfL defends its new routes.",
        "c. Mr Clifton has given more detentions, so the students wrote an open letter to TfL."], a: 1}
    : {tf: [["a", "The students were happy.", "F", 4], ["b", "The students said: “It's the bus!”", "T", 4], ["c", "Mr Clifton is a student.", "F", 5], ["d", "Mr Clifton wrote an open letter to TfL.", "T", 5], ["e", "He asked for a special bus for the teachers.", "F", 5], ["f", "Today, the school still gives detentions for bus lateness.", "F", 6], ["g", "TfL says the new bus lines are good for other people.", "T", 7]],
      sum: ["a. The students accepted the detentions, and TfL changed the bus lines again.",
        "b. The students were angry. The deputy headteacher wrote to TfL, and now the school doesn't give detentions for bus lateness. But TfL likes the new bus lines.",
        "c. Mr Clifton gave more detentions, and the students wrote a letter to TfL."], a: 1};
  const PP = [["3", /have often been|have been/, "+"], ["4", /haven't done|have not done|haven t done/, "-"], ["4b", /hasn't come|has not come|hasn t come/, "-"], ["6", /has stopped/, "+"]];

  /* ---------- items counted in the progress (sequence) ---------- */
  const ITEMS = ["a1", "a2", "a5"].concat(["vb", "s1"], P2.tf.map(t => "tf" + t[0]), ["s2"], ACT.link.items.map((_, i) => "lk" + i), ACT.pp ? ["pp"] : [], ["ed", "note"]);
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
      <figure class="sw-fig">${SCENE}<figcaption>${T("The two buses of the article: the W12 and the W14, in London.", "Les deux bus de l'article : le W12 et le W14, à Londres.")}</figcaption></figure>
      <div class="sw-paper"><p class="sw-k">The article</p><p class="sw-title" lang="en">Late for school? Blame the bus!</p>
        <p class="sw-src"><i>The Independent</i> · by Amelia Neath · Friday 4 April 2025</p>
        <p class="sw-orig"><span class="sw-k">Original title</span> <span lang="en">“${TITLE}”</span></p></div>
      ${box(1, "What is it?", ["Choose the right answer, then the clues that help you.", "Coche la bonne réponse, puis les indices qui t'aident."],
        `<p>${opts("a1", ["a poster", "a newspaper article", "a letter", "an advertisement"])}</p>
         <p class="sw-q">How do you know? <small>${T("Tick the clues, and write the element that proves it.", "Coche les indices et écris à côté l'élément qui le prouve.")}</small></p>
         <div class="sw-clues">${CLUES.map(([k, en, , ex]) => `<div class="sw-clue">${opts("a1c." + k, [en], true)}${inp("a1j." + k, four ? "" : "e.g. " + (k === "title" ? ex : "…"))}</div>`).join("")}</div>${chk("a1")}`, "a1")}
      ${box(2, "Look at the pictures.", four ? ["What can you see? Where is it? How do you know? Write 2 or 3 sentences.", "Que vois-tu ? Où est-ce ? Comment le sais-tu ? Écris 2 ou 3 phrases."] : ["What can you see? Where is it? Write, then check: you get a model.", "Que vois-tu ? Où est-ce ? Écris, puis clique sur Check : tu as un modèle."],
        `${four ? "" : `<p class="sw-q">Help: <small lang="en">red · buses · two · the W12 · the W14 · the company · Stagecoach · London</small></p>`}
         <textarea class="sw-ta" data-k="a2.free" rows="4" lang="en" spellcheck="false" placeholder="${four ? "" : "I can see…"}">${esc(val("a2.free"))}</textarea>
         ${four ? "" : `<p class="sw-q">I think it's in…</p><p>${opts("a2b", ["London", "Paris", "New York", "Sydney"])}</p>`}
         <div class="sw-model" hidden><p class="sw-k">Model</p><p lang="en">${four ? MODEL2[1] : MODEL2[0]} <button type="button" class="sw-say" data-say="${esc(four ? MODEL2[1] : MODEL2[0])}" aria-label="Listen">▶</button></p></div>${chk("a2")}`, "a2")}
      ${box(3, "My hypothesis.", four ? ["Why are the pupils late? Is it fair? Write your hypothesis in one or two sentences. Check it after reading the text.", "Pourquoi les élèves sont-ils en retard ? Est-ce juste ? Écris ton hypothèse en une ou deux phrases. Vérifie-la après la lecture du texte."] : ["Complete the sentence. Check it after reading the text.", "Complète la phrase. Vérifie-la après la lecture du texte."],
        four ? `<textarea class="sw-ta" data-k="a5" rows="3" lang="en" spellcheck="false">${esc(val("a5"))}</textarea>${chk("a5")}`
             : `<div class="sw-rows wide"><label><span>I think the pupils are late because…</span>${inp("a5", "…the buses…")}</label></div>${chk("a5")}`, "a5")}
      <div class="sw-next"><button type="button" class="btn primary" data-goto="read">${T("Now read the text →", "Maintenant, lis le texte →")}</button></div>`;
  }

  /* ---------- render: Activities ---------- */
  function renderActs() {
    const A = ACT, L = A.link;
    $("#acts").innerHTML = `
      <div class="sw-intro"><p>${T(`Read the text again (tab 2), part by part, to answer. My work: <b data-sheet-pc></b>`, `Relis le texte (onglet 2), partie par partie, pour répondre.`)}</p></div>
      <h2 class="sw-h">Part 1 · paragraphs 1 to 3</h2>
      ${box(1, four ? "The first five verbs in the past simple." : "The first five verbs in the past.", four
          ? ["Find the first five verbs in the past simple in paragraphs 2 and 3 (careful: not the present perfect!). Write each verb and its base verb.", "Trouve les cinq premiers verbes au prétérit dans les paragraphes 2 et 3 (attention : pas le present perfect !). Écris chaque verbe et sa base verbale."]
          : ["Here are the first five verbs in the past in the text. Write the base verb.", "Voici les cinq premiers verbes au passé du texte. Écris la base verbale."],
        `<div class="sw-rows">${VERBS.map(([w, p], i) => four
            ? `<label><span>Verb ${i + 1}</span><span class="sw-two">${inp("vb.w" + i, "past simple")}${inp("vb.b" + i, "base verb")}</span></label>`
            : `<label><span lang="en">[${p}] <b>${w}</b> →</span>${inp("vb.b" + i, "base verb", "12em")}</label>`).join("")}</div>${chk("vb")}`, "vb")}
      ${box(2, "Choose the best summary of part 1.", ["Paragraphs 1 to 3.", "Paragraphes 1 à 3."], `<div class="sw-sum">${opts("s1", P1.sum)}</div>${chk("s1")}`, "s1")}
      <h2 class="sw-h">Part 2 · paragraphs 4 to 7</h2>
      ${box(3, "True or false?", ["★ Tick. ★★ Justify: which paragraph?", "★ Coche. ★★ Justifie : quel paragraphe ?"],
        `<div class="sw-tf">${P2.tf.map(([k, s]) => `<div class="sw-tfr" data-tf="${k}"><span lang="en">${k}. ${esc(s)}</span>${opts("tf." + k, ["T", "F"])}<span class="sw-par">[¶] ${opts("tfp." + k, ["4", "5", "6", "7"])}</span></div>`).join("")}</div>${chk("tf")}`, "tf")}
      ${box(4, "Choose the best summary of part 2.", ["Paragraphs 4 to 7.", "Paragraphes 4 à 7."], `<div class="sw-sum">${opts("s2", P2.sum)}</div>${chk("s2")}`, "s2")}
      <h2 class="sw-h">Language</h2>
      ${box(L.n, L.title, [L.title, L.fr],
        `<div class="sw-link">${L.items.map(([a, b], i) => `<p lang="en">${String.fromCharCode(97 + i)}. ${esc(a)} ${opts("lk" + i, L.opts)} ${esc(b)}</p>`).join("")}</div>${chk("lk")}`, "lk")}
      ${A.pp ? box(6, "The present perfect.", ["Find 4 verbs in the present perfect (have / has + past participle).", "Trouve dans le texte 4 verbes au present perfect (have / has + participe passé)."],
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
      const ok1 = val("a1") === "a newspaper article"; mark($(`.sw-opts[data-k="a1"]`, card), ok1);
      let ok2 = NEED.every(k => (val("a1c." + k) || []).length), ok3 = true;
      CLUES.forEach(([k, , re]) => {
        const on = (val("a1c." + k) || []).length > 0, w = norm(val("a1j." + k)), el = $(`[data-k="a1j.${k}"]`, card);
        if (on) { const ok = re.test(w); mark(el, ok); ok3 = ok3 && ok; } else if (el) el.classList.remove("right", "wrong");
        const g = $(`.sw-opts[data-k="a1c.${k}"]`, card); if (NEED.includes(k)) mark(g, on); else if (g) g.classList.remove("right", "wrong");
      });
      if (ok1 && ok2 && ok3) { done("a1"); fb(card, true, "Yes! The newspaper, the date and the journalist show it's an article.", "Oui ! Le journal, la date et la journaliste montrent que c'est un article."); }
      else fb(card, false, !ok1 ? null : !ok2 ? "Which clues are only in a newspaper article? (a poster can have a title and a photo too)" : "Write the element next to each clue you ticked (in red): look at the article card.",
        !ok1 ? null : !ok2 ? "Quels indices sont seulement dans un article ? (une affiche peut aussi avoir un titre et une photo)" : "Écris l'élément à côté de chaque indice coché (en rouge) : regarde la carte de l'article.");
    },
    a2(card) {
      const t = norm(val("a2.free")), n = t ? t.split(" ").length : 0, okc = four ? /london/.test(t) : val("a2b") === "London";
      const okt = four ? n >= 12 && /because/.test(t) : n >= 4;
      mark($(`[data-k="a2.free"]`, card), okt); if (!four) mark($(`.sw-opts[data-k="a2b"]`, card), okc);
      $(".sw-model", card).hidden = !t;
      if (okt && okc) { done("a2"); fb(card, true, "Compare with the model and improve your text.", "Compare avec le modèle et améliore ton texte."); }
      else fb(card, false, four ? "Write 2 or 3 sentences: what you can see, where it is, and how you know (because…)." : "Write what you can see (at least one sentence), and choose the city.",
        four ? "Écris 2 ou 3 phrases : ce que tu vois, où c'est, et comment tu le sais (because…)." : "Écris ce que tu vois (au moins une phrase) et choisis la ville.");
    },
    a5(card) {
      const t = norm(val("a5")), ok = four ? t.split(" ").length >= 6 && /because/.test(t) : t.split(" ").length >= 2;
      mark($(`[data-k="a5"]`, card), ok);
      if (ok) { done("a5"); fb(card, true, "Saved! After reading, check: were you right?", "Enregistré ! Après la lecture, vérifie : avais-tu raison ?"); }
      else fb(card, false, four ? "Write a full sentence with because: I think the pupils are late because…" : "Complete the sentence: …because the bus…", four ? "Écris une phrase complète avec because." : "Complète la phrase : …because the bus…");
    },
    vb(card) {
      let all = true; const seen = new Set();
      VERBS.forEach(([w, , base], i) => {
        if (four) {
          const got = norm(val("vb.w" + i)), okw = VERBS.some(v => v[0] === got) && !seen.has(got); if (okw) seen.add(got);
          mark($(`[data-k="vb.w${i}"]`, card), okw);
          const want = okw ? VERBS.find(v => v[0] === got)[2] : null, okb = !!want && norm(val("vb.b" + i)).replace(/^to /, "") === want;
          mark($(`[data-k="vb.b${i}"]`, card), okb); all = all && okw && okb;
        } else { const okb = norm(val("vb.b" + i)).replace(/^to /, "") === base; mark($(`[data-k="vb.b${i}"]`, card), okb); all = all && okb; }
      });
      if (all) { done("vb"); fb(card, true, "changed → change · were → be · waited → wait · arrived → arrive · got → get", "Trois verbes réguliers en -ed, deux irréguliers : were (be) et got (get)."); }
      else fb(card, false, four ? "Look in paragraphs 2 and 3: past simple only (have been is the present perfect). Each verb once." : "The base verb = the verb without -ed. Careful: were and got are irregular!",
        four ? "Cherche dans les paragraphes 2 et 3 : seulement le prétérit (have been est au present perfect). Chaque verbe une fois." : "La base verbale = le verbe sans -ed. Attention : were et got sont irréguliers !");
    },
    s1(card) {
      const ok = val("s1") === P1.sum[P1.a]; mark($(`.sw-opts[data-k="s1"]`, card), ok);
      if (ok) { done("s1"); fb(card, true); } else fb(card, false, "Is it really in paragraphs 1 to 3? Read them again.", "Est-ce vraiment dans les paragraphes 1 à 3 ? Relis-les.");
    },
    tf(card) {
      let all = true, paras = true;
      P2.tf.forEach(([k, , a, p]) => {
        const ok = val("tf." + k) === a; mark($(`.sw-opts[data-k="tf.${k}"]`, card), ok); all = all && ok; if (ok) done("tf" + k);
        const pv = val("tfp." + k); if (pv) { const okp = +pv === p; mark($(`.sw-opts[data-k="tfp.${k}"]`, card), okp); paras = paras && okp; }
      });
      if (all) fb(card, true, paras ? "Well done!" : "True / false: well done! ★★ Check the paragraph numbers in red.", paras ? "Bravo !" : "Vrai / faux : bravo ! ★★ Vérifie les paragraphes en rouge.");
      else fb(card, false, "Some answers are wrong (in red). Read paragraphs 4 to 7 again.", "Des réponses sont fausses (en rouge). Relis les paragraphes 4 à 7.");
    },
    s2(card) {
      const ok = val("s2") === P2.sum[P2.a]; mark($(`.sw-opts[data-k="s2"]`, card), ok);
      if (ok) { done("s2"); fb(card, true); } else fb(card, false, "Is it really in paragraphs 4 to 7? Read them again.", "Est-ce vraiment dans les paragraphes 4 à 7 ? Relis-les.");
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
.sw-fig{margin:0 0 12px}.sw-fig img{width:100%;height:auto;border-radius:14px;border:1px solid var(--line);display:block}.sw-fig svg{width:100%;height:auto;border-radius:14px;border:1px solid var(--line);display:block}
.sw-fig figcaption{font-size:.85rem;color:var(--muted);margin-top:4px}
.sw-paper{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--mark);border-radius:12px;padding:10px 14px;margin:0 0 12px}
.sw-k{margin:0;font-size:.75rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.sw-title{font-family:var(--display);font-weight:800;font-size:1.15rem;margin:4px 0}.sw-title.sm{font-size:1rem}
.sw-src{margin:0;color:var(--muted)}
.sw-clues{display:grid;gap:6px}.sw-clue{display:grid;grid-template-columns:minmax(12em,45%) 1fr;gap:8px;align-items:center}.sw-clue .sw-opts{display:block}.sw-clue .sw-o{width:100%}
.sw-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
@media (max-width:520px){.sw-clue{grid-template-columns:1fr}}
.sw-model{margin-top:10px;border-left:4px solid var(--good);background:var(--good-soft);border-radius:10px;padding:8px 12px}.sw-model p{margin:0}
.sw-orig{margin:8px 0 0;padding-top:8px;border-top:1px dashed var(--line);font-weight:700}.sw-orig .sw-k{display:block}
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
.sw-in.right,.sw-ta.right{border-color:var(--good);background:var(--good-soft)}.sw-in.wrong,.sw-ta.wrong{border-color:var(--bad);background:var(--bad-soft)}
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
