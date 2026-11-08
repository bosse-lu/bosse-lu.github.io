/* DÒKÒ · CM1: general knowledge. "Calcul mental" is made at random; the other packs are written questions
   (5 choices, a = index of the right one, lv 1 → 3). */
(function () {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // the answer + 4 likely mistakes (all different, positive)
  function opts(ans, wrongs) {
    const set = []; [...wrongs, ans + 1, ans - 1, ans + 10, ans - 10, ans + 2, ans - 2].forEach(n => { if (n >= 0 && n !== ans && !set.includes(n)) set.push(n); });
    const o = shuffle([ans].concat(set.slice(0, 4)));
    return {o: o.map(n => n.toLocaleString("fr-FR")), a: o.indexOf(ans)};
  }
  const sw = n => { const s = String(n); return s.length > 1 ? +s.split("").reverse().join("") : n + 1; };
  const table = (lo, hi) => { const a = R(lo, hi), b = R(2, 10), p = a * b;
    return Object.assign({q: `${a} × ${b} = ?`, why: `${a} × ${b} = ${p} (table de ${a}).`}, opts(p, [a * (b + 1), a * (b - 1), (a + 1) * b, a + b])); };
  const add = () => { const a = R(15, 79), b = R(12, 59), s = a + b;
    return Object.assign({q: `${a} + ${b} = ?`, why: `${a} + ${b} = ${s}. Pense aux retenues !`}, opts(s, [s - 10, s + 10, sw(s)])); };
  const sub = () => { const a = R(120, 950), b = R(15, 99), d = a - b;
    return Object.assign({q: `${a} − ${b} = ?`, why: `${a} − ${b} = ${d}. Vérifie : ${d} + ${b} = ${a}.`}, opts(d, [d + 10, d - 10, a - b + 20])); };
  const half = () => { const n = 2 * R(12, 99), k = R(0, 1);
    return k ? Object.assign({q: `La moitié de ${n} = ?`, why: `La moitié de ${n}, c'est ${n} ÷ 2 = ${n / 2}.`}, opts(n / 2, [n * 2, n / 2 + 5, n - 2]))
             : Object.assign({q: `Le double de ${n / 2} = ?`, why: `Le double de ${n / 2}, c'est ${n / 2} × 2 = ${n}.`}, opts(n, [n / 2 + 2, n + 10, n / 4 * 2 + 1])); };
  const mul2 = () => { const a = R(12, 49), b = R(3, 9), p = a * b;
    return Object.assign({q: `${a} × ${b} = ?`, why: `${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b}) = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${p}.`}, opts(p, [p + b, p - b, p + 10])); };
  const div = () => { const b = R(3, 9), q = R(3, 10), n = b * q;
    return Object.assign({q: `${n} ÷ ${b} = ?`, why: `${n} ÷ ${b} = ${q}, car ${b} × ${q} = ${n}.`}, opts(q, [q + 1, q - 1, b])); };
  const x10 = () => { const n = R(3, 99), m = [10, 100][R(0, 1)], p = n * m;
    return Object.assign({q: `${n} × ${m} = ?`, why: `× ${m} : on ajoute ${m === 10 ? "un zéro" : "deux zéros"} → ${p.toLocaleString("fr-FR")}.`}, opts(p, [m === 10 ? n * 100 : n * 10, n + m, p * 10])); };
  const quart = () => { const n = 4 * R(5, 30);
    return Object.assign({q: `Le quart de ${n} = ?`, why: `Le quart, c'est diviser par 4 : ${n} ÷ 4 = ${n / 4}.`}, opts(n / 4, [n / 2, n / 4 + 4, n * 4])); };

  window.DOKO_CM1 = [
    {id: "cm1-calcul", title: "Calcul mental", kind: "Maths", level: "CM1", emoji: "🧮",
      gen: lv => lv === 1 ? [() => table(2, 5), add][R(0, 1)]() : lv === 2 ? [() => table(6, 9), sub, half][R(0, 2)]() : [mul2, div, x10, quart][R(0, 3)]()},
    {id: "cm1-francais", title: "Français", kind: "Grammaire, conjugaison, orthographe", level: "CM1", emoji: "📖", q: [
      {lv: 1, q: "Quel est le verbe ? « Le chat dort sur le canapé. »", o: ["dort", "chat", "canapé", "sur", "le"], a: 0, why: "Le verbe dit ce que fait le sujet : le chat dort (verbe dormir)."},
      {lv: 1, q: "Quel mot est un adjectif ? « une très grande maison »", o: ["une", "très", "grande", "maison", "la"], a: 2, why: "L'adjectif précise le nom : une maison grande."},
      {lv: 1, q: "Au pluriel, « un cheval » devient…", o: ["des chevals", "des chevaux", "des chevauxs", "des chevales", "des chevaus"], a: 1, why: "Les noms en -al font leur pluriel en -aux (sauf bal, carnaval, festival…)."},
      {lv: 1, q: "Présent : Nous ___ à l'école. (aller)", o: ["allons", "allez", "vont", "vais", "allont"], a: 0, why: "Aller au présent : je vais, tu vas, il va, nous allons, vous allez, ils vont."},
      {lv: 1, q: "Quel est le féminin de « un acteur » ?", o: ["une acteuse", "une actrice", "une acteure", "une actrise", "une actreuse"], a: 1, why: "-teur → -trice : un acteur, une actrice."},
      {lv: 2, q: "Complète : Il ___ un vélo rouge.", o: ["a", "à", "as", "ont", "est"], a: 0, why: "On peut dire « il avait un vélo » → a, verbe avoir, sans accent."},
      {lv: 2, q: "Quelle phrase est correcte ?", o: ["Ils son partis.", "Ils sont partis.", "Ils sons partis.", "Il sont partis.", "Ils sont partie."], a: 1, why: "sont = verbe être (on peut dire « ils étaient partis »)."},
      {lv: 2, q: "Futur : Demain, tu ___ ton travail. (finir)", o: ["finiras", "finira", "finis", "finissais", "finirai"], a: 0, why: "Au futur, avec tu : -ras → tu finiras."},
      {lv: 2, q: "Imparfait : Autrefois, nous ___ à la campagne. (habiter)", o: ["habitions", "habitons", "habiterons", "habitaient", "habitiez"], a: 0, why: "Imparfait avec nous : -ions → nous habitions."},
      {lv: 2, q: "Quel est le sujet ? « Dans la forêt, les loups chassent. »", o: ["les loups", "la forêt", "chassent", "dans", "la"], a: 0, why: "Qui est-ce qui chasse ? Les loups → c'est le sujet."},
      {lv: 3, q: "Passé composé : Elles ___ au cinéma. (aller)", o: ["sont allées", "ont allé", "sont allé", "sont allés", "ont allées"], a: 0, why: "Aller se conjugue avec être : le participe passé s'accorde avec le sujet → elles sont allées."},
      {lv: 3, q: "Quelle est la nature du mot « rapidement » ?", o: ["un adverbe", "un adjectif", "un nom", "un verbe", "un déterminant"], a: 0, why: "Rapidement est un adverbe : il précise le verbe (il court rapidement)."},
      {lv: 3, q: "Quel mot est mal écrit ?", o: ["des hiboux", "des cailloux", "des bijous", "des genoux", "des choux"], a: 2, why: "Bijou, caillou, chou, genou, hibou, joujou, pou prennent un x au pluriel : des bijoux."},
      {lv: 3, q: "« Léa mange une pomme. » Quel groupe complète le verbe ?", o: ["une pomme", "Léa", "mange", "Léa mange", "une"], a: 0, why: "Léa mange quoi ? Une pomme : c'est le complément du verbe."},
      {lv: 3, q: "Imparfait : Hier soir, ils ___ contents. (être)", o: ["étaient", "était", "sont", "seront", "étions"], a: 0, why: "Être à l'imparfait : j'étais, tu étais, il était, nous étions, vous étiez, ils étaient."}
    ]},
    {id: "cm1-sciences", title: "Sciences", kind: "Vivant, matière, univers", level: "CM1", emoji: "🔬", q: [
      {lv: 1, q: "L'eau pure gèle à…", o: ["0 °C", "10 °C", "100 °C", "−10 °C", "50 °C"], a: 0, why: "À 0 °C, l'eau liquide devient solide : la glace."},
      {lv: 1, q: "Quel organe permet de respirer ?", o: ["les poumons", "l'estomac", "le cœur", "le foie", "les reins"], a: 0, why: "L'air entre dans les poumons, qui prennent l'oxygène."},
      {lv: 1, q: "Sur quelle planète vivons-nous ?", o: ["Mars", "la Terre", "Vénus", "Jupiter", "Saturne"], a: 1, why: "La Terre est la 3e planète à partir du Soleil."},
      {lv: 1, q: "Un animal qui mange seulement des plantes est…", o: ["herbivore", "carnivore", "omnivore", "insectivore", "piscivore"], a: 0, why: "Herbivore : il mange des végétaux (la vache, le lapin…)."},
      {lv: 1, q: "Combien de pattes a un insecte ?", o: ["6", "8", "4", "10", "2"], a: 0, why: "Les insectes ont 6 pattes. L'araignée en a 8 : ce n'est pas un insecte."},
      {lv: 2, q: "L'eau qui bout se transforme en…", o: ["vapeur d'eau", "glace", "neige", "sel", "sable"], a: 0, why: "À 100 °C, l'eau bout et devient un gaz : la vapeur d'eau."},
      {lv: 2, q: "Quel organe fait circuler le sang dans le corps ?", o: ["le cœur", "les poumons", "le cerveau", "l'estomac", "les muscles"], a: 0, why: "Le cœur est un muscle qui pompe le sang."},
      {lv: 2, q: "Chaîne alimentaire : l'herbe → le lapin → …", o: ["le renard", "la carotte", "le soleil", "l'eau", "la pierre"], a: 0, why: "Le renard mange le lapin, qui mange l'herbe."},
      {lv: 2, q: "La Terre tourne autour…", o: ["du Soleil", "de la Lune", "de Mars", "de Jupiter", "de l'étoile Polaire"], a: 0, why: "La Terre fait le tour du Soleil en un an."},
      {lv: 2, q: "Pour qu'une ampoule s'allume, le circuit doit être…", o: ["fermé", "ouvert", "coupé", "mouillé", "cassé"], a: 0, why: "Le courant ne passe que si le circuit est fermé (une boucle complète)."},
      {lv: 3, q: "Combien de temps met la Terre pour tourner sur elle-même ?", o: ["24 heures", "365 jours", "1 semaine", "12 heures", "1 mois"], a: 0, why: "Un tour sur elle-même en 24 h : c'est l'alternance du jour et de la nuit."},
      {lv: 3, q: "Quel matériau conduit l'électricité ?", o: ["le cuivre", "le plastique", "le bois", "le verre", "le caoutchouc"], a: 0, why: "Les métaux comme le cuivre conduisent l'électricité ; le plastique est un isolant."},
      {lv: 3, q: "Le sel versé dans l'eau…", o: ["se dissout", "flotte", "devient de la glace", "s'évapore aussitôt", "change l'eau en huile"], a: 0, why: "Le sel se dissout : on ne le voit plus, mais l'eau est salée."},
      {lv: 3, q: "Quelle planète est la plus proche du Soleil ?", o: ["Mercure", "Vénus", "la Terre", "Mars", "Neptune"], a: 0, why: "Dans l'ordre : Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus, Neptune."},
      {lv: 3, q: "Les plantes vertes fabriquent leur matière grâce à…", o: ["la lumière du soleil", "la nuit", "le sable", "la neige", "la lune"], a: 0, why: "Avec la lumière, l'eau, l'air et les sels minéraux, la plante fabrique sa matière."}
    ]},
    {id: "cm1-histgeo", title: "Histoire-géographie", kind: "France, Guyane, monde", level: "CM1", emoji: "🗺️", q: [
      {lv: 1, q: "Quelle est la capitale de la France ?", o: ["Paris", "Lyon", "Marseille", "Cayenne", "Bordeaux"], a: 0, why: "Paris est la capitale de la France."},
      {lv: 1, q: "Où voit-on des peintures de la Préhistoire ?", o: ["dans la grotte de Lascaux", "sur la tour Eiffel", "au château de Versailles", "sur l'Arc de triomphe", "dans une gare"], a: 0, why: "La grotte de Lascaux (Dordogne) est ornée de peintures d'animaux préhistoriques."},
      {lv: 1, q: "Quel chef gaulois a combattu Jules César ?", o: ["Vercingétorix", "Astérix", "Clovis", "Charlemagne", "Napoléon"], a: 0, why: "Vercingétorix a uni des peuples gaulois contre César. Astérix est un personnage de BD !"},
      {lv: 1, q: "Quelle est la préfecture de la Guyane ?", o: ["Cayenne", "Kourou", "Saint-Laurent-du-Maroni", "Fort-de-France", "Paris"], a: 0, why: "Cayenne est la préfecture (le chef-lieu) de la Guyane."},
      {lv: 1, q: "Quels sont les 4 points cardinaux ?", o: ["nord, sud, est, ouest", "haut, bas, gauche, droite", "nord, sud, gauche, droite", "est, ouest, haut, bas", "devant, derrière, est, ouest"], a: 0, why: "Nord, sud, est, ouest : ils servent à s'orienter sur une carte."},
      {lv: 2, q: "Sur quel continent se trouve la Guyane ?", o: ["l'Amérique du Sud", "l'Afrique", "l'Europe", "l'Asie", "l'Océanie"], a: 0, why: "La Guyane est en Amérique du Sud, entre le Suriname et le Brésil."},
      {lv: 2, q: "Quel fleuve sépare la Guyane du Suriname ?", o: ["le Maroni", "l'Oyapock", "la Seine", "la Loire", "l'Amazone"], a: 0, why: "Le Maroni à l'ouest (Suriname) ; l'Oyapock à l'est (Brésil)."},
      {lv: 2, q: "Charlemagne est couronné empereur en…", o: ["800", "1515", "1789", "52 av. J.-C.", "1492"], a: 0, why: "Charlemagne est couronné empereur à Rome en l'an 800."},
      {lv: 2, q: "Au Moyen Âge, le seigneur vit dans…", o: ["un château fort", "un gratte-ciel", "une grotte", "une villa romaine", "un immeuble"], a: 0, why: "Le château fort protège le seigneur et les paysans en cas d'attaque."},
      {lv: 2, q: "Quel est le plus long fleuve qui coule entièrement en France ?", o: ["la Loire", "la Seine", "le Rhône", "la Garonne", "le Maroni"], a: 0, why: "La Loire mesure environ 1 000 km."},
      {lv: 3, q: "En quelle année les Gaulois sont-ils vaincus à Alésia ?", o: ["52 av. J.-C.", "800", "1515", "476", "1789"], a: 0, why: "En 52 av. J.-C., Vercingétorix se rend à Jules César à Alésia."},
      {lv: 3, q: "Quel roi des Francs est baptisé à Reims, vers l'an 500 ?", o: ["Clovis", "Charlemagne", "Louis XIV", "Hugues Capet", "Vercingétorix"], a: 0, why: "Clovis, roi des Francs, est baptisé à Reims vers l'an 500."},
      {lv: 3, q: "Quel est le plus haut sommet de France ?", o: ["le mont Blanc", "le puy de Dôme", "le Mont-Saint-Michel", "la montagne de Kaw", "le Vignemale"], a: 0, why: "Le mont Blanc, dans les Alpes, mesure environ 4 800 m."},
      {lv: 3, q: "Que lance-t-on depuis Kourou, en Guyane ?", o: ["des fusées", "des bateaux", "des trains", "des sous-marins", "des montgolfières"], a: 0, why: "Le Centre spatial guyanais, à Kourou, lance les fusées européennes (Ariane)."},
      {lv: 3, q: "Hugues Capet devient roi des Francs en…", o: ["987", "800", "1515", "1789", "52 av. J.-C."], a: 0, why: "En 987, Hugues Capet devient roi : c'est le début des Capétiens."}
    ]},
    {id: "cm1-anglais", title: "Anglais", kind: "English", level: "CM1", emoji: "🇬🇧", q: [
      {lv: 1, q: "Comment dit-on « rouge » en anglais ?", o: ["red", "blue", "green", "yellow", "black"], a: 0, why: "red = rouge · blue = bleu · green = vert · yellow = jaune"},
      {lv: 1, q: "« Hello! » veut dire…", o: ["Bonjour !", "Au revoir !", "Merci !", "Pardon !", "Bonne nuit !"], a: 0, why: "Hello = bonjour · Goodbye = au revoir · Thank you = merci"},
      {lv: 1, q: "Comment dit-on « chat » en anglais ?", o: ["cat", "dog", "bird", "fish", "mouse"], a: 0, why: "cat = chat · dog = chien · bird = oiseau"},
      {lv: 1, q: "« Seven » = …", o: ["7", "6", "11", "17", "70"], a: 0, why: "seven = 7 · seventeen = 17 · seventy = 70"},
      {lv: 2, q: "Comment dit-on « mercredi » en anglais ?", o: ["Wednesday", "Monday", "Tuesday", "Thursday", "Friday"], a: 0, why: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday"},
      {lv: 2, q: "« How old are you? » On te demande…", o: ["ton âge", "ton nom", "ta couleur préférée", "ta ville", "l'heure"], a: 0, why: "How old are you? → I'm ten (j'ai 10 ans)."},
      {lv: 2, q: "Réponds : « What's your name? »", o: ["My name is Léo.", "I'm ten.", "I'm fine.", "I like pizza.", "It's blue."], a: 0, why: "What's your name? = Comment t'appelles-tu ?"},
      {lv: 2, q: "Le contraire de « big » est…", o: ["small", "tall", "long", "happy", "old"], a: 0, why: "big = grand, gros · small = petit"},
      {lv: 3, q: "Complète : « I ___ a dog. »", o: ["have got", "has got", "am", "are", "is"], a: 0, why: "I have got · he / she has got"},
      {lv: 3, q: "Complète : « She ___ ten years old. »", o: ["is", "am", "are", "be", "has"], a: 0, why: "En anglais, on dit « elle EST 10 ans » : she is ten."},
      {lv: 3, q: "Quel mois vient après « March » ?", o: ["April", "May", "February", "June", "January"], a: 0, why: "January, February, March, April, May, June…"},
      {lv: 3, q: "« Can you swim? » La bonne réponse :", o: ["Yes, I can.", "Yes, I do.", "Yes, I am.", "Yes, I swim can.", "Yes, I have."], a: 0, why: "On répond avec le même mot : Can you…? → Yes, I can. / No, I can't."},
      {lv: 3, q: "Comment dit-on « j'aime les bananes » ?", o: ["I like bananas.", "I likes bananas.", "I am bananas.", "I liking bananas.", "Me like bananas."], a: 0, why: "I like + nom au pluriel : I like bananas."}
    ]}
  ];
})();
