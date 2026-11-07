/* DÒKÒ themes. One object per theme. Each question:
   q    the question
   img  (optional) a picture shown with the question (file name in assets/doko/pics/, without .png)
   o    5 choices (A to E), so that every box of the board can be used
   a    index of the right choice (0 = A)
   why  the short explanation shown at the correction
   pic  (optional) a picture shown with the explanation (same folder as img)
   To add a theme: copy a block, change id / title / questions. */
window.DOKO_THEMES = [
  {
    id: "late-absent-words", title: "Late and absent · Words", kind: "Vocabulary", level: "5e · 4e", emoji: "⏰",
    q: [
      {q: "What's wrong?", img: "sorethroat", o: ["I have a headache.", "I have a sore throat.", "I have a toothache.", "I broke my leg.", "I have the flu."], a: 1, why: "throat = la gorge → a sore throat = mal à la gorge"},
      {q: "What's wrong?", img: "toothache", o: ["I have a cold.", "I'm sick.", "I have a headache.", "I have a toothache.", "I have a sore throat."], a: 3, why: "tooth 🦷 = une dent → a toothache = mal aux dents"},
      {q: "What happened?", img: "brokeleg", o: ["I missed the bus.", "I broke my leg.", "I overslept.", "My car broke down.", "I went to the dentist."], a: 1, why: "leg 🦵 = la jambe → I broke my leg = je me suis cassé la jambe"},
      {q: "Why are you late?", img: "bus", o: ["My car broke down.", "I overslept.", "I was with the nurse.", "I went to the dentist.", "I missed the bus."], a: 4, why: "to miss = rater → I missed the bus = j'ai raté le bus 🚌"},
      {q: "Why are you late?", img: "overslept", o: ["I went to the dentist.", "I have the flu.", "I overslept.", "I'm cold.", "I missed the bus."], a: 2, why: "over + slept = trop dormi 😴 → je ne me suis pas réveillé"},
      {q: "Why are you late?", img: "car", o: ["My car broke down.", "I missed the bus.", "I broke my leg.", "I overslept.", "I was with the nurse."], a: 0, why: "to break down = tomber en panne 🚗"},
      {q: "What's wrong?", img: "flu", o: ["I have a headache.", "I'm cold.", "I have a toothache.", "I have the flu.", "I broke my leg."], a: 3, why: "the flu = la grippe 🤒 · a fever = de la fièvre"},
      {q: "I have a ___ .", img: "headache", o: ["toothache", "sore throat", "headache", "flu", "cold"], a: 2, why: "head = la tête → a headache = mal à la tête"},
      {q: "Where were you?", img: "nursesign", o: ["I was at the bus stop.", "I was at the dentist.", "I was in bed.", "I was with the nurse.", "I was with the head teacher."], a: 3, why: "the nurse = l'infirmière → l'infirmerie ➕"},
      {q: "I went to the ___ .", img: "dentist", o: ["nurse", "bus stop", "head teacher", "toilets", "dentist"], a: 4, why: "the dentist 🦷 = le dentiste"},
      {q: "A late slip is…", o: ["un billet de retard", "un mot d'absence", "une retenue", "un rendez-vous", "un bulletin"], a: 0, why: "late ⏰ = en retard · a slip = un petit papier → le billet de retard", pic: "school"},
      {q: "An absence note is…", o: ["un billet de retard", "une retenue", "un mot d'absence", "un rendez-vous", "une signature"], a: 2, why: "absence + note (un mot) → le mot d'absence, signé par les parents ✍️", pic: "signature"},
      {q: "A detention is…", o: ["une absence", "une excuse", "un retard", "une retenue", "une infirmière"], a: 3, why: "a detention = une retenue (une colle) : tu restes au collège après les cours"},
      {q: "A doctor's appointment is…", o: ["une ordonnance", "un rendez-vous chez le médecin", "une infirmière", "un mot d'absence", "une maladie"], a: 1, why: "an appointment 📅 = un rendez-vous"},
      {q: "“I'm late” means…", o: ["je suis en avance", "je suis absent", "je suis malade", "je suis fatigué", "je suis en retard"], a: 4, why: "late ⏰ = en retard · absent = absent"},
      {q: "The bus stop is…", o: ["la gare", "le parking", "l'arrêt de bus", "le chauffeur", "le collège"], a: 2, why: "to stop = s'arrêter → the bus stop 🚏 = l'arrêt de bus", pic: "bus"}
    ]
  }
];
