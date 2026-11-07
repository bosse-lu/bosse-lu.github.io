/* DÒKÒ content.
   Each game picks 4 questions per level (lv 1 easy, lv 2 medium, lv 3 difficult), in this order; the choices are mixed at each game.
   A question: q (question), o (5 choices, A to E), a (index of the right choice in o), why (short correction),
   img (picture with the question) and pic (picture with the correction): file names in assets/doko/pics/, without .png.
   Recreate the situation: scene = the pictures in order, as in Lesson 2:
     {img, lab (time label), cap (caption), verb (word above), no (word crossed out), wide}
     {note: "late" | "abs", f: {Date: "Yesterday"}}   {q: 1} = a question mark   {box: 1} = the mystery box ❓
   say = the sentence to say aloud for the bonus (by default, the right choice). */
window.DOKO_THEMES = [
  {
    id: "late-absent-words", title: "Late and absent · Words", kind: "Vocabulary", level: "5e · 4e", emoji: "⏰",
    q: [
      {lv: 1, q: "What's wrong?", img: "sorethroat", o: ["I have a headache.", "I have a sore throat.", "I have a toothache.", "I broke my leg.", "I have the flu."], a: 1, why: "throat = la gorge → a sore throat = mal à la gorge"},
      {lv: 1, q: "What's wrong?", img: "toothache", o: ["I have a cold.", "I'm sick.", "I have a headache.", "I have a toothache.", "I have a sore throat."], a: 3, why: "tooth 🦷 = une dent → a toothache = mal aux dents"},
      {lv: 1, q: "What happened?", img: "brokeleg", o: ["I missed the bus.", "I broke my leg.", "I overslept.", "My car broke down.", "I went to the dentist."], a: 1, why: "leg 🦵 = la jambe → I broke my leg = je me suis cassé la jambe"},
      {lv: 1, q: "Why are you late?", img: "bus", o: ["My car broke down.", "I overslept.", "I was with the nurse.", "I went to the dentist.", "I missed the bus."], a: 4, why: "to miss = rater → I missed the bus = j'ai raté le bus 🚌"},
      {lv: 1, q: "Why are you late?", img: "overslept", o: ["I went to the dentist.", "I have the flu.", "I overslept.", "I'm cold.", "I missed the bus."], a: 2, why: "over + slept = trop dormi 😴 → je ne me suis pas réveillé"},
      {lv: 1, q: "Why are you late?", img: "car", o: ["My car broke down.", "I missed the bus.", "I broke my leg.", "I overslept.", "I was with the nurse."], a: 0, why: "to break down = tomber en panne 🚗"},
      {lv: 1, q: "What's wrong?", img: "flu", o: ["I have a headache.", "I'm cold.", "I have a toothache.", "I have the flu.", "I broke my leg."], a: 3, why: "the flu = la grippe 🤒 · a fever = de la fièvre"},
      {lv: 1, q: "I have a ___ .", img: "headache", o: ["toothache", "sore throat", "headache", "flu", "cold"], a: 2, why: "head = la tête → a headache = mal à la tête"},
      {lv: 1, q: "Where were you?", img: "nursesign", o: ["I was at the bus stop.", "I was at the dentist.", "I was in bed.", "I was with the nurse.", "I was with the head teacher."], a: 3, why: "the nurse = l'infirmière → l'infirmerie ➕"},
      {lv: 1, q: "I went to the ___ .", img: "dentist", o: ["nurse", "bus stop", "head teacher", "toilets", "dentist"], a: 4, why: "the dentist 🦷 = le dentiste"},
      {lv: 2, q: "A late slip is…", o: ["un billet de retard", "un mot d'absence", "une retenue", "un rendez-vous", "un bulletin"], a: 0, why: "late ⏰ = en retard · a slip = un petit papier → le billet de retard", pic: "school"},
      {lv: 2, q: "An absence note is…", o: ["un billet de retard", "une retenue", "un mot d'absence", "un rendez-vous", "une signature"], a: 2, why: "absence + note (un mot) → le mot d'absence, signé par les parents ✍️", pic: "signature"},
      {lv: 2, q: "A detention is…", o: ["une absence", "une excuse", "un retard", "une retenue", "une infirmière"], a: 3, why: "a detention = une retenue (une colle) : tu restes au collège après les cours"},
      {lv: 2, q: "A doctor's appointment is…", o: ["une ordonnance", "un rendez-vous chez le médecin", "une infirmière", "un mot d'absence", "une maladie"], a: 1, why: "an appointment 📅 = un rendez-vous"},
      {lv: 2, q: "“I'm late” means…", o: ["je suis en avance", "je suis absent", "je suis malade", "je suis fatigué", "je suis en retard"], a: 4, why: "late ⏰ = en retard · absent = absent"},
      {lv: 2, q: "The bus stop is…", o: ["la gare", "le parking", "l'arrêt de bus", "le chauffeur", "le collège"], a: 2, why: "to stop = s'arrêter → the bus stop 🚏 = l'arrêt de bus", pic: "bus"},
      {lv: 3, q: "I have a sore ___ .", o: ["troat", "throat", "thought", "through", "threat"], a: 1, why: "throat = la gorge. Attention à l'orthographe : th-r-oa-t.", pic: "sorethroat"},
      {lv: 3, q: "Which word is spelled correctly?", o: ["tootache", "toothake", "tothache", "toothache", "toothach"], a: 3, why: "tooth + ache (la douleur) = toothache", pic: "toothache"},
      {lv: 3, q: "Odd one out: which one is NOT an illness?", o: ["a headache", "the flu", "a bus stop", "a sore throat", "a cold"], a: 2, why: "a bus stop 🚏 est un lieu, pas une maladie."},
      {lv: 3, q: "Yesterday, I ___ the bus.", o: ["miss", "misses", "missing", "missed", "mist"], a: 3, why: "yesterday → prétérit : miss → missed (le -ed se dit /t/)"},
      {lv: 3, q: "My dad's car ___ down this morning.", o: ["breaked", "broken", "broke", "breaks", "brake"], a: 2, why: "break → broke (verbe irrégulier) · break down = tomber en panne"},
      {lv: 3, q: "Last week, I ___ to the dentist.", o: ["goed", "go", "gone", "wented", "went"], a: 4, why: "go → went (verbe irrégulier)"},
      {lv: 3, q: "You were ill yesterday. What do you give to the teacher?", o: ["a late slip", "a detention", "a bus ticket", "an absence note", "a doctor"], a: 3, why: "absent hier → an absence note, signé par les parents ✍️"},
      {lv: 3, q: "Lessons start at 8:00. You arrive at 8:20. What do you say?", o: ["Sorry, I'm early.", "Sorry, I'm absent.", "Sorry, I'm late.", "Sorry, I'm on time.", "Sorry, I'm sick."], a: 2, why: "late = en retard · early = en avance · on time = à l'heure"}
    ]
  }
];

window.DOKO_RECREATE = {
  // A quick evaluation out of 20: 10 situations (3 easy, 4 medium, 3 difficult), 10 seconds each,
  // one letter right = 2 points, two letters with the right one = 1 point, no correction before the end.
  id: "recreate", title: "Recreate the situation", emoji: "🧩", time: 10, eval: true, per: {1: 3, 2: 4, 3: 3},
  q: [
    {lv: 1, scene: [{img: "overslept"}, {note: "late"}], o: ["I overslept, so I'm late.", "I overslept, because I'm late.", "I oversleep, so I'm late.", "I'm late, so I overslept.", "I overslept, so I was absent."], a: 0, why: "Image puis billet : cause + so + conséquence. oversleep → overslept."},
    {lv: 1, scene: [{note: "late"}, {img: "bus"}], o: ["I'm late because I missed the bus.", "I'm late so I missed the bus.", "I'm late because I miss the bus.", "I missed the bus because I'm late.", "I was absent because I missed the bus."], a: 0, why: "Billet puis image : conséquence + because + cause."},
    {lv: 1, scene: [{img: "car"}, {note: "late"}], o: ["The car broke down, so I'm late.", "The car breaked down, so I'm late.", "The car broke down, because I'm late.", "I'm late, so the car broke down.", "The car broke down, so I was absent."], a: 0, why: "Image puis billet → so. break → broke (irrégulier)."},
    {lv: 1, scene: [{note: "abs"}, {img: "flu"}], o: ["I was absent because I had the flu.", "I was absent because I have the flu.", "I was absent so I had the flu.", "I'm late because I had the flu.", "I had the flu because I was absent."], a: 0, why: "Billet d'absence puis image → because. C'est fini : have → had."},
    {lv: 2, scene: [{img: "brokeleg"}, {note: "abs"}], o: ["I broke my leg, so I was absent.", "I breaked my leg, so I was absent.", "I broke my leg, because I was absent.", "I broke my leg, so I'm late.", "I was absent, so I broke my leg."], a: 0, why: "Image puis billet → so. break → broke."},
    {lv: 2, scene: [{note: "abs", f: {Date: "Yesterday"}}, {img: "dentist"}], o: ["I was absent yesterday because I went to the dentist.", "I was absent yesterday because I go to the dentist.", "I was absent yesterday so I went to the dentist.", "I went to the dentist yesterday because I was absent.", "I was absent yesterday because I goed to the dentist."], a: 0, why: "Billet puis image → because. go → went."},
    {lv: 2, scene: [{img: "headache"}, {img: "nursesign", wide: 1}, {q: 1}], o: ["I have a headache, so can I go to the nurse?", "I have a headache, because can I go to the nurse?", "I has a headache, so can I go to the nurse?", "I have a headache, so can I goes to the nurse?", "Can I go to the nurse, so I have a headache?"], a: 0, why: "La cause d'abord, puis so + la demande. Après can : la base verbale (go)."},
    {lv: 2, scene: [{note: "abs", f: {Date: "Monday"}}, {img: "sorethroat"}], o: ["I was absent on Monday because I had a sore throat.", "I was absent on Monday because I have a sore throat.", "I were absent on Monday because I had a sore throat.", "I was absent on Monday so I had a sore throat.", "I had a sore throat on Monday because I was absent."], a: 0, why: "Billet puis image → because. I was (pas I were)."},
    {lv: 2, scene: [{img: "cold"}, {q: 1}], o: ["I'm cold, so can you close the window, please?", "I'm cold, because can you close the window, please?", "I'm cold, so can you closed the window, please?", "I'm cold, so you can close the window, please?", "Can you close the window, so I'm cold?"], a: 0, why: "La cause, puis so + la question (can you + base verbale)."},
    {lv: 3, scene: [{img: "brokeleg", lab: "Last Wednesday"}, {img: "school", no: "COME", wide: 1, lab: "Friday"}], o: ["I broke my leg last Wednesday, so I didn't come to school on Friday.", "I broke my leg last Wednesday, so I didn't came to school on Friday.", "I breaked my leg last Wednesday, so I didn't come to school on Friday.", "I broke my leg last Wednesday, because I didn't come to school on Friday.", "I didn't come to school on Friday, so I broke my leg last Wednesday."], a: 0, why: "Image puis école barrée → so. Négation : didn't + base verbale (come)."},
    {lv: 3, scene: [{img: "house", verb: "STAY", lab: "Yesterday"}, {img: "sorethroat"}], o: ["I stayed at home yesterday because I had a sore throat.", "I stay at home yesterday because I had a sore throat.", "I stayed at home yesterday because I have a sore throat.", "I stayed at home yesterday so I had a sore throat.", "I had a sore throat yesterday because I stayed at home."], a: 0, why: "La conséquence d'abord → because. Yesterday : stayed, had."},
    {lv: 3, scene: [{img: "wrist", lab: "Two days ago"}, {note: "abs", f: {Date: "Yesterday"}}], o: ["I twisted my wrist two days ago, so I was absent yesterday.", "I twist my wrist two days ago, so I was absent yesterday.", "I twisted my wrist two days ago, because I was absent yesterday.", "I twisted my wrist two days ago, so I'm absent yesterday.", "I was absent yesterday, so I twisted my wrist two days ago."], a: 0, why: "Image puis billet → so. twist → twisted · yesterday → I was."},
    {lv: 3, q: "What's in the mystery box ❓?", scene: [{img: "dentist", cap: "I go to the dentist"}, {box: 1}, {img: "toothache", cap: "I have a toothache"}], o: ["because", "so", "but", "and", "or"], a: 0, say: "I go to the dentist because I have a toothache.", why: "La 2e image dit pourquoi (la cause) → because."},
    {lv: 3, q: "What's in the mystery box ❓?", scene: [{img: "bus", cap: "I missed the bus"}, {box: 1}, {note: "late", cap: "I'm late"}], o: ["so", "because", "but", "and", "or"], a: 0, say: "I missed the bus, so I'm late.", why: "La 2e partie est le résultat (la conséquence) → so."},
    {lv: 3, scene: [{note: "late"}, {img: "overslept"}, {img: "bus"}], o: ["I'm late because I overslept and I missed the bus.", "I'm late so I overslept and I missed the bus.", "I'm late because I overslept but I missed the bus.", "I'm late because I oversleep and I miss the bus.", "I overslept and I missed the bus because I'm late."], a: 0, why: "Billet puis deux images → because + deux causes reliées par and."}
  ]
};
