/* DÒKÒ themes. One object per theme; each question: q (question), o (2 to 5 choices, A to E), a (index of the right choice, 0 = A),
   why (the explanation shown at the correction), fr (optional French help for the explanation).
   To add a theme: copy a block, change id / title / questions. */
window.DOKO_THEMES = [
  {
    id: "late-and-absent", title: "Late and absent", kind: "Grammar", level: "5e · 4e", emoji: "⏰",
    q: [
      {q: "What is the past simple of “go”?", o: ["goed", "went", "gone", "goes"], a: 1, why: "“Go” is irregular: go → went.", fr: "Verbe irrégulier : go → went."},
      {q: "I missed the bus, ___ I'm late.", o: ["because", "but", "so"], a: 2, why: "“So” gives the consequence: I missed the bus → I'm late.", fr: "So introduit la conséquence."},
      {q: "I'm late ___ I overslept.", o: ["so", "because", "and"], a: 1, why: "“Because” gives the cause: why am I late? I overslept.", fr: "Because introduit la cause."},
      {q: "You arrive late at school. Which note do you need?", o: ["an absence note", "a late slip", "a permission note"], a: 1, why: "A late slip is for a student who arrives late.", fr: "Le late slip, c'est le billet de retard."},
      {q: "How do you say the -ed of “waited”?", o: ["/t/", "/d/", "/ɪd/"], a: 2, why: "After the sound /t/ or /d/, -ed is /ɪd/: wai-ted, one more syllable.", fr: "Après /t/ ou /d/, on entend /ɪd/ : une syllabe en plus."},
      {q: "How do you say the -ed of “missed”?", o: ["/t/", "/d/", "/ɪd/"], a: 0, why: "After a voiceless sound like /s/, -ed is /t/: /mɪst/.", fr: "Après un son sourd comme /s/, -ed se dit /t/."},
      {q: "Where ___ you yesterday?", o: ["was", "were", "did", "are"], a: 1, why: "With “you”, the past of “be” is “were”.", fr: "Au prétérit, be donne was / were : avec you, were."},
      {q: "I ___ come to school on Monday.", o: ["didn't", "don't", "wasn't", "haven't"], a: 0, why: "Negative past simple: didn't + base verb (come).", fr: "Négation au prétérit : didn't + base verbale."},
      {q: "“Why are you late?” Does the voice go up or down?", o: ["It goes up ↗", "It goes down ↘"], a: 1, why: "Wh- questions (why, where, what…): the voice goes down ↘.", fr: "Question en Wh- : la voix descend."},
      {q: "“Have you got your late slip?” Does the voice go up or down?", o: ["It goes up ↗", "It goes down ↘"], a: 0, why: "Yes / no questions: the voice goes up ↗.", fr: "Question fermée (oui / non) : la voix monte."},
      {q: "The bus was late, ___ the students got a detention.", o: ["because", "so", "but", "or"], a: 1, why: "The detention is the consequence: so.", fr: "La retenue est la conséquence : so."},
      {q: "4e · Oh no! I ___ my exercise book!", o: ["has forgotten", "have forgotten", "forgetted", "am forget"], a: 1, why: "To say the problem now (the result), use have + past participle: I've forgotten.", fr: "Constat : have + participe passé."},
      {q: "4e · You were absent yesterday, ___?", o: ["weren't you", "didn't you", "wasn't you", "aren't you"], a: 0, why: "Question tag: same verb (were), negative: weren't you?", fr: "Question tag : on reprend le verbe, à la forme négative."}
    ]
  },
  {
    id: "british-schools", title: "British schools", kind: "Culture", level: "5e · 4e", emoji: "🇬🇧",
    q: [
      {q: "In the UK, most secondary school students wear…", o: ["a uniform", "a costume", "pyjamas"], a: 0, why: "Most British schools have a school uniform: a blazer, a tie, a jumper…", fr: "La plupart des écoles britanniques ont un uniforme."},
      {q: "What is a “detention”?", o: ["a school holiday", "a punishment: you stay at school after lessons", "a football match", "a school trip"], a: 1, why: "In a detention, you stay at school after lessons, or at lunchtime.", fr: "Une detention, c'est une retenue (une colle)."},
      {q: "In England, the first year of secondary school (like the 6e) is called…", o: ["Year 7", "Grade 1", "Form 9"], a: 0, why: "Year 7 is the first year of secondary school, at 11.", fr: "Year 7 correspond à la 6e."},
      {q: "The “head teacher” is…", o: ["the English teacher", "the school's principal", "the school nurse"], a: 1, why: "The head teacher runs the school, like a principal.", fr: "Le head teacher, c'est le chef d'établissement."},
      {q: "Blame the bus! Where is Woodbridge High School?", o: ["Manchester", "Cardiff", "London", "Edinburgh"], a: 2, why: "Woodbridge High School is in Woodford Green, in north-east London.", fr: "Le collège de l'article est à Londres."},
      {q: "What does TfL mean?", o: ["Teachers for Learning", "Transport for London", "Time for Lunch"], a: 1, why: "TfL (Transport for London) runs the buses and the Underground in London.", fr: "TfL gère les transports de Londres."},
      {q: "At 16, students in England take important exams called…", o: ["the bac", "GCSEs", "A-levels first", "the brevet"], a: 1, why: "GCSEs are the exams at 16 in England, Wales and Northern Ireland.", fr: "Les GCSEs, c'est un peu comme le brevet."},
      {q: "The British school year has…", o: ["two terms", "three terms", "four terms"], a: 1, why: "Three terms: autumn, spring and summer.", fr: "Trois trimestres : automne, printemps, été."}
    ]
  }
];
