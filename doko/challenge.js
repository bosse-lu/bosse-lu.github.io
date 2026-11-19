/* DÒKÒ · Challenge a parent! 🔥 · extra questions (never the ones of the evaluation "Recreate the situation").
   scene: recreate the situation with so / because (5e), with the negative, because of and That's why (4e)
   box:   the mystery box ❓, find the right linking word
   ed:    the pronunciation of -ed: /t/, /d/ or /ɪd/ (the same for 5e and 4e)
   Same format as themes.js: lv 1 easy, 2 medium, 3 difficult; a = index of the right choice (the choices are mixed at each game). */
(function () {
  const ED = (w, a, lv, why) => ({lv, q: `How do you say the -ed of “${w}”?`, w, o: ["/t/", "/d/", "/ɪd/"], a: {t: 0, d: 1, id: 2}[a], why, hear: w});
  const ed = [
    ED("missed", "t", 1, "miss finit par le son /s/ (sourd, ça ne vibre pas) → /t/ : missed = « mist »."),
    ED("watched", "t", 1, "watch finit par le son /tʃ/ (sourd) → /t/ : pas de syllabe en plus."),
    ED("played", "d", 1, "play finit par un son voyelle (sonore, ça vibre) → /d/."),
    ED("stayed", "d", 1, "stay finit par un son voyelle (sonore) → /d/."),
    ED("wanted", "id", 1, "want finit par le son /t/ → /ɪd/ : une syllabe en plus, want-ed."),
    ED("waited", "id", 1, "wait finit par le son /t/ → /ɪd/ : wait-ed."),
    ED("walked", "t", 2, "walk finit par le son /k/ (sourd) → /t/ : walked = « wokt »."),
    ED("looked", "t", 2, "look finit par le son /k/ (sourd) → /t/."),
    ED("called", "d", 2, "call finit par le son /l/ (sonore) → /d/."),
    ED("arrived", "d", 2, "arrive finit par le son /v/ (sonore) → /d/."),
    ED("rained", "d", 2, "rain finit par le son /n/ (sonore) → /d/."),
    ED("needed", "id", 2, "need finit par le son /d/ → /ɪd/ : need-ed."),
    ED("started", "id", 2, "start finit par le son /t/ → /ɪd/ : start-ed."),
    ED("twisted", "id", 2, "twist finit par le son /t/ → /ɪd/ : twist-ed."),
    ED("laughed", "t", 3, "Piège : laugh s'écrit gh mais finit par le son /f/ (sourd) → /t/ : « laft »."),
    ED("coughed", "t", 3, "Piège : cough finit par le son /f/ (sourd) → /t/ : « koft »."),
    ED("danced", "t", 3, "Piège : dance finit par le son /s/ (sourd) → /t/, pas de syllabe en plus."),
    ED("finished", "t", 3, "finish finit par le son /ʃ/ (sourd) → /t/."),
    ED("closed", "d", 3, "Piège : close finit par le son /z/ (sonore) → /d/."),
    ED("used", "d", 3, "Piège : use finit par le son /z/ (sonore) → /d/."),
    ED("decided", "id", 3, "decide finit par le son /d/ → /ɪd/ : decid-ed."),
    ED("visited", "id", 3, "visit finit par le son /t/ → /ɪd/ : visit-ed.")
  ];
  const BOX = "What's in the mystery box ❓?";
  window.DOKO_CHALLENGE = {
    "5e": {
      ed,
      scene: [
        {lv: 1, scene: [{img: "sick"}, {note: "abs"}], o: ["I was sick, so I was absent.", "I was sick, because I was absent.", "I was absent, so I was sick.", "I was sick, so I'm late.", "I is sick, so I was absent."], a: 0, why: "Image puis billet : la cause + so + la conséquence."},
        {lv: 1, scene: [{note: "late"}, {img: "car"}], o: ["I'm late because the car broke down.", "I'm late so the car broke down.", "I'm late because the car breaked down.", "The car broke down because I'm late.", "I was absent because the car broke down."], a: 0, why: "Billet puis image : la conséquence + because + la cause. break → broke."},
        {lv: 1, scene: [{img: "toothache"}, {img: "dentist"}], o: ["I had a toothache, so I went to the dentist.", "I had a toothache, because I went to the dentist.", "I had a toothache, so I goed to the dentist.", "I went to the dentist, so I had a toothache.", "I had a toothache, so I went to the nurse."], a: 0, why: "La cause d'abord, puis so. go → went (irrégulier)."},
        {lv: 2, scene: [{note: "abs", f: {Date: "Tuesday"}}, {img: "brokeleg"}], o: ["I was absent on Tuesday because I broke my leg.", "I was absent on Tuesday because I breaked my leg.", "I was absent on Tuesday so I broke my leg.", "I broke my leg on Tuesday because I was absent.", "I were absent on Tuesday because I broke my leg."], a: 0, why: "Billet puis image → because. I was ; break → broke."},
        {lv: 2, scene: [{img: "flu"}, {img: "house", verb: "STAY"}], o: ["I had the flu, so I stayed at home.", "I had the flu, so I stay at home.", "I had the flu, because I stayed at home.", "I stayed at home, so I had the flu.", "I had the flu, so I stayed at school."], a: 0, why: "La cause, puis so + la conséquence. C'est fini : stay → stayed."},
        {lv: 2, scene: [{img: "toothache"}, {img: "nursesign", wide: 1}, {q: 1}], o: ["I have a toothache, so can I go to the nurse?", "I have a toothache, because can I go to the nurse?", "I has a toothache, so can I go to the nurse?", "I have a toothache, so can I went to the nurse?", "Can I go to the nurse, so I have a toothache?"], a: 0, why: "La cause, puis so + la demande. Après can : la base verbale (go)."},
        {lv: 3, scene: [{note: "late"}, {img: "car", lab: "This morning"}], o: ["I was late this morning because my dad's car broke down.", "I was late this morning so my dad's car broke down.", "I was late this morning because my dad's car breaked down.", "My dad's car broke down this morning because I was late.", "I am late this morning because my dad's car broke down."], a: 0, why: "Billet puis image → because. C'est fini (this morning) : was, broke."},
        {lv: 3, scene: [{img: "sick", lab: "Last night"}, {note: "abs", f: {Date: "Today"}}], o: ["I was sick last night, so I'm absent today.", "I was sick last night, because I'm absent today.", "I am sick last night, so I'm absent today.", "I'm absent today, so I was sick last night.", "I was sick last night, so I'm late today."], a: 0, why: "Hier soir (passé : was) → so → aujourd'hui (présent : I'm absent)."},
        {lv: 3, scene: [{note: "abs", f: {Date: "Last Friday"}}, {img: "headache"}, {img: "house", verb: "STAY"}], o: ["I was absent last Friday because I had a headache and I stayed at home.", "I was absent last Friday because I have a headache and I stay at home.", "I was absent last Friday so I had a headache and I stayed at home.", "I was absent last Friday because I had a headache but I stayed at home.", "I had a headache and I stayed at home because I was absent last Friday."], a: 0, why: "Billet puis deux images → because + deux causes reliées par and. Passé : had, stayed."}
      ],
      box: [
        {lv: 1, q: BOX, scene: [{img: "overslept", cap: "I overslept"}, {box: 1}, {note: "late", cap: "I'm late"}], o: ["so", "because", "but", "and", "or"], a: 0, say: "I overslept, so I'm late.", why: "La 2e partie est le résultat (la conséquence) → so."},
        {lv: 1, q: BOX, scene: [{note: "abs", cap: "I was absent"}, {box: 1}, {img: "flu", cap: "I had the flu"}], o: ["because", "so", "but", "and", "or"], a: 0, say: "I was absent because I had the flu.", why: "La 2e partie dit pourquoi (la cause) → because."},
        {lv: 2, q: BOX, scene: [{img: "headache", cap: "I have a headache"}, {box: 1}, {img: "nursesign", wide: 1, cap: "I go to the nurse"}], o: ["so", "because", "but", "or", "and"], a: 0, say: "I have a headache, so I go to the nurse.", why: "La 2e partie est le résultat → so."},
        {lv: 2, q: BOX, scene: [{img: "house", cap: "I stayed at home"}, {box: 1}, {img: "sick", cap: "I was sick"}], o: ["because", "so", "but", "or", "and"], a: 0, say: "I stayed at home because I was sick.", why: "La 2e partie dit pourquoi → because."},
        {lv: 3, q: BOX, scene: [{img: "school", no: "COME", wide: 1, cap: "I didn't come to school"}, {box: 1}, {img: "brokeleg", cap: "I broke my leg"}], o: ["because", "so", "but", "and", "or"], a: 0, say: "I didn't come to school because I broke my leg.", why: "La 2e partie dit pourquoi → because."},
        {lv: 3, q: BOX, scene: [{img: "car", cap: "The car broke down"}, {box: 1}, {note: "late", cap: "I was late"}], o: ["so", "because", "but", "and", "or"], a: 0, say: "The car broke down, so I was late.", why: "La 2e partie est le résultat → so."},
        {lv: 3, q: BOX, scene: [{img: "dentist", cap: "I went to the dentist"}, {box: 1}, {note: "abs", cap: "I was absent this morning"}], o: ["so", "because", "but", "or", "and"], a: 0, say: "I went to the dentist, so I was absent this morning.", why: "La 2e partie est le résultat → so."}
      ]
    },
    "4e": {
      ed,
      scene: [
        {lv: 1, scene: [{note: "late"}, {img: "car"}], o: ["I'm late because the car broke down.", "I'm late because of the car broke down.", "I'm late so the car broke down.", "I'm late because the car breaked down.", "The car broke down because I'm late."], a: 0, why: "Billet puis image → because + une phrase (sujet + verbe)."},
        {lv: 1, scene: [{img: "sick"}, {note: "abs"}], o: ["I was sick. That's why I was absent.", "I was sick. Because I was absent.", "I was absent. That's why I was sick.", "I was sick. That's why I were absent.", "I was sick. Because of I was absent."], a: 0, why: "La cause, puis That's why (= so) + la conséquence."},
        {lv: 1, scene: [{note: "abs"}, {img: "headache", cap: "a headache"}], o: ["I was absent because of a headache.", "I was absent because a headache.", "I was absent because of I had a headache.", "I was absent so a headache.", "I were absent because of a headache."], a: 0, why: "Devant un nom (a headache) → because of."},
        {lv: 2, scene: [{img: "overslept"}, {img: "bus", no: "CATCH"}], o: ["I overslept, so I didn't catch the bus.", "I overslept, so I didn't caught the bus.", "I overslept, so I don't catch the bus.", "I overslept, because I didn't catch the bus.", "I oversleeped, so I didn't catch the bus."], a: 0, why: "Négation au passé : didn't + base verbale (catch). La cause, puis so."},
        {lv: 2, scene: [{img: "brokeleg", lab: "Last Saturday"}, {img: "school", no: "GO", wide: 1}], o: ["I broke my leg last Saturday. That's why I didn't go to school.", "I broke my leg last Saturday. That's why I didn't went to school.", "I breaked my leg last Saturday. That's why I didn't go to school.", "I broke my leg last Saturday. Because I didn't go to school.", "I didn't go to school last Saturday. That's why I broke my leg."], a: 0, why: "La cause, puis That's why. didn't + base verbale (go)."},
        {lv: 2, scene: [{note: "abs", f: {Date: "Friday"}}, {img: "dentist", cap: "a dentist appointment"}], o: ["I was absent on Friday because of a dentist appointment.", "I was absent on Friday because a dentist appointment.", "I was absent on Friday because of I had a dentist appointment.", "I were absent on Friday because of a dentist appointment.", "I was absent on Friday so a dentist appointment."], a: 0, why: "Devant un nom (a dentist appointment) → because of."},
        {lv: 3, scene: [{img: "sorethroat", lab: "Yesterday"}, {img: "house", verb: "STAY"}], o: ["I had a sore throat yesterday. That's why I stayed at home.", "I had a sore throat yesterday. That's why I stay at home.", "I have a sore throat yesterday. That's why I stayed at home.", "I had a sore throat yesterday. Because I stayed at home.", "I stayed at home yesterday. That's why I had a sore throat."], a: 0, why: "La cause, puis That's why. Hier : had, stayed."},
        {lv: 3, scene: [{img: "school", no: "COME", wide: 1, lab: "Monday"}, {img: "toothache", cap: "a bad toothache"}], o: ["I didn't come to school on Monday because of a bad toothache.", "I didn't came to school on Monday because of a bad toothache.", "I didn't come to school on Monday because a bad toothache.", "I don't come to school on Monday because of a bad toothache.", "I didn't come to school on Monday so a bad toothache."], a: 0, why: "didn't + base verbale (come) ; devant un nom → because of."},
        {lv: 3, scene: [{note: "abs", f: {Date: "Yesterday"}}, {img: "flu", cap: "the flu"}], o: ["I wasn't at school yesterday because of the flu.", "I weren't at school yesterday because of the flu.", "I didn't was at school yesterday because of the flu.", "I wasn't at school yesterday because the flu.", "I wasn't at school yesterday so the flu."], a: 0, why: "Négation de was → wasn't ; devant un nom (the flu) → because of."}
      ],
      box: [
        {lv: 1, q: BOX, scene: [{note: "late", cap: "I'm late"}, {box: 1}, {img: "bus", cap: "I missed the bus"}], o: ["because", "because of", "That's why", "but", "and"], a: 0, say: "I'm late because I missed the bus.", why: "La 2e partie dit pourquoi, avec un sujet et un verbe → because."},
        {lv: 1, q: BOX, scene: [{note: "abs", cap: "I was absent"}, {box: 1}, {img: "sorethroat", cap: "a sore throat"}], o: ["because of", "because", "That's why", "but", "so"], a: 0, say: "I was absent because of a sore throat.", why: "Devant un nom (a sore throat) → because of."},
        {lv: 2, q: BOX, scene: [{img: "overslept", cap: "I overslept"}, {box: 1}, {note: "late", cap: "I was late"}], o: ["That's why", "Because", "Because of", "But", "And"], a: 0, say: "I overslept. That's why I was late.", why: "La 2e partie est le résultat → That's why (= so)."},
        {lv: 2, q: BOX, scene: [{img: "house", cap: "I stayed at home"}, {box: 1}, {img: "toothache", cap: "a toothache"}], o: ["because of", "because", "That's why", "but", "so"], a: 0, say: "I stayed at home because of a toothache.", why: "Devant un nom (a toothache) → because of."},
        {lv: 2, q: BOX, scene: [{img: "car", cap: "The car broke down"}, {box: 1}, {note: "late", cap: "I was late"}], o: ["That's why", "Because", "Because of", "But", "And"], a: 0, say: "The car broke down. That's why I was late.", why: "La 2e partie est le résultat → That's why."},
        {lv: 3, q: BOX, scene: [{img: "school", no: "COME", wide: 1, cap: "I didn't come to school"}, {box: 1}, {img: "headache", cap: "a bad headache"}], o: ["because of", "because", "That's why", "so", "but"], a: 0, say: "I didn't come to school because of a bad headache.", why: "Devant un nom (a bad headache) → because of."},
        {lv: 3, q: BOX, scene: [{img: "bus", no: "CATCH", cap: "I didn't catch the bus"}, {box: 1}, {img: "overslept", cap: "I overslept"}], o: ["because", "because of", "That's why", "so", "but"], a: 0, say: "I didn't catch the bus because I overslept.", why: "La 2e partie dit pourquoi, avec un sujet et un verbe (I overslept) → because."},
        {lv: 3, q: BOX, scene: [{img: "wrist", cap: "I twisted my wrist"}, {box: 1}, {img: "nursesign", wide: 1, cap: "I went to the nurse"}], o: ["That's why", "Because", "Because of", "But", "Or"], a: 0, say: "I twisted my wrist. That's why I went to the nurse.", why: "La 2e partie est le résultat → That's why."}
      ]
    }
  };
})();
