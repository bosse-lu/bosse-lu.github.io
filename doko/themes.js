/* DÒKÒ themes. One object per theme. Each question:
   q    the question
   img  (optional) a picture shown with the question (file name in assets/img/excuses/, without .png)
   o    2 to 5 choices (A to E)
   a    index of the right choice (0 = A)
   why  the short explanation shown at the correction
   pic  (optional) a picture shown with the explanation (same folder as img)
   To add a theme: copy a block, change id / title / questions. */
window.DOKO_THEMES = [
  {
    id: "late-absent-words", title: "Late and absent · Words", kind: "Vocabulary", level: "5e · 4e", emoji: "⏰",
    q: [
      {q: "What's wrong?", img: "sorethroat", o: ["I have a headache.", "I have a sore throat.", "I have a toothache.", "I broke my leg."], a: 1, why: "throat = la gorge → a sore throat = mal à la gorge"},
      {q: "What's wrong?", img: "toothache", o: ["I have a cold.", "I'm sick.", "I have a toothache."], a: 2, why: "tooth 🦷 = une dent → a toothache = mal aux dents"},
      {q: "What happened?", img: "brokeleg", o: ["I broke my leg.", "I missed the bus.", "I overslept."], a: 0, why: "leg 🦵 = la jambe → I broke my leg = je me suis cassé la jambe"},
      {q: "Why are you late?", img: "bus", o: ["My car broke down.", "I missed the bus.", "I was with the nurse."], a: 1, why: "to miss = rater → I missed the bus = j'ai raté le bus 🚌"},
      {q: "Why are you late?", img: "overslept", o: ["I went to the dentist.", "I have the flu.", "I overslept.", "I'm cold."], a: 2, why: "over + slept = trop dormi 😴 → je ne me suis pas réveillé"},
      {q: "Why are you late?", img: "car", o: ["My car broke down.", "I missed the bus.", "I broke my leg."], a: 0, why: "to break down = tomber en panne 🚗"},
      {q: "What's wrong?", img: "flu", o: ["I have a headache.", "I have the flu.", "I'm cold."], a: 1, why: "the flu = la grippe 🤒 · a fever = de la fièvre"},
      {q: "I have a ___ .", img: "headache", o: ["toothache", "sore throat", "headache", "flu"], a: 2, why: "head = la tête → a headache = mal à la tête"},
      {q: "Where were you?", img: "nursesign", o: ["I was at the bus stop.", "I was with the nurse.", "I was at the dentist."], a: 1, why: "the nurse = l'infirmière → l'infirmerie ➕"},
      {q: "I went to the ___ .", img: "dentist", o: ["nurse", "bus stop", "dentist"], a: 2, why: "the dentist 🦷 = le dentiste"},
      {q: "A late slip is…", o: ["un billet de retard", "un mot d'absence", "une retenue"], a: 0, why: "late ⏰ = en retard · a slip = un petit papier → le billet de retard", pic: "school"},
      {q: "An absence note is…", o: ["un billet de retard", "un mot d'absence", "un rendez-vous"], a: 1, why: "absence + note (un mot) → le mot d'absence, signé par les parents ✍️", pic: "signature"},
      {q: "A detention is…", o: ["une absence", "une retenue", "une excuse"], a: 1, why: "a detention = une retenue (une colle) : tu restes au collège après les cours"},
      {q: "A doctor's appointment is…", o: ["un rendez-vous chez le médecin", "une ordonnance", "une infirmière"], a: 0, why: "an appointment 📅 = un rendez-vous"},
      {q: "“I'm late” means…", o: ["je suis en avance", "je suis absent", "je suis en retard"], a: 2, why: "late ⏰ = en retard · absent = absent"},
      {q: "The bus stop is…", o: ["la gare", "l'arrêt de bus", "le parking"], a: 1, why: "to stop = s'arrêter → the bus stop 🚏 = l'arrêt de bus", pic: "bus"}
    ]
  }
];
