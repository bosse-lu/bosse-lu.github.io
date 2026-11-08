/* DÒKÒ · Grande section: numbers. The questions are made at random (gen), read aloud in French.
   Level 1 → 3 (easy → difficult). Pictures are emoji, so nothing to download. */
(function () {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const OBJ = [["🍎", "pommes"], ["🐟", "poissons"], ["⭐", "étoiles"], ["🐞", "coccinelles"], ["🚗", "voitures"], ["🎈", "ballons"], ["🦋", "papillons"], ["🍌", "bananes"], ["🐶", "chiens"], ["🌸", "fleurs"], ["🐢", "tortues"], ["⚽", "ballons de foot"]];
  const WORD = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"];
  // 5 different numbers between lo and hi, with the answer, close to it
  function opts(ans, lo, hi) {
    const near = shuffle([1, -1, 2, -2, 3, -3, 4, -4, 5, -5].map(d => ans + d).filter(n => n >= lo && n <= hi));
    const o = shuffle([ans].concat(near.slice(0, 4)));
    return {o: o.map(String), a: o.indexOf(ans)};
  }
  // n pictures, in rows of 5 (easier to count)
  const grp = (e, n, gone) => { let h = ""; for (let r = 0; r < n; r += 5) { h += '<div class="row5">'; for (let k = r; k < Math.min(n, r + 5); k++) h += `<span${gone && k >= n - gone ? ' class="gone"' : ""}>${e}</span>`; h += "</div>"; } return `<div class="grp">${h}</div>`; };
  const counted = (e, n) => `<div class="vis count">${Array.from({length: n}, (_, k) => `<span>${e}<b>${k + 1}</b></span>`).join("")}</div>`;
  const DOTS = {1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9]};
  const dice = n => `<div class="dice">${Array.from({length: 9}, (_, k) => DOTS[n].includes(k + 1) ? "<i></i>" : "<span></span>").join("")}</div>`;

  const count = (lo, hi) => { const [e, w] = OBJ[R(0, OBJ.length - 1)], n = R(lo, hi);
    return Object.assign({q: `Combien y a-t-il de ${w} ?`, html: grp(e, n), why: `Il y a ${n} ${w}.`, whyHtml: counted(e, n)}, opts(n, 1, 10)); };
  const nombre = (lo, hi) => { const n = R(lo, hi);
    return Object.assign({q: `Où est le nombre ${WORD[n]} ?`, html: '<div class="bignum">👂</div>', why: `Voici le nombre ${WORD[n]} : ${n}.`}, opts(n, 0, 10)); };
  const de = () => { const n = R(1, 6);
    return Object.assign({q: "Combien de points sur le dé ?", html: dice(n), why: `Il y a ${n} points sur le dé.`}, opts(n, 1, 10)); };
  const apres = () => { const n = R(1, 9);
    return Object.assign({q: `Quel nombre vient après ${n} ?`, html: `<div class="line">${n > 1 ? `<span>${n - 1}</span>` : ""}<span>${n}</span><span class="q">?</span></div>`, why: `Après ${n}, il y a ${n + 1}.`}, opts(n + 1, 1, 10)); };
  const avant = () => { const n = R(2, 10);
    return Object.assign({q: `Quel nombre vient avant ${n} ?`, html: `<div class="line"><span class="q">?</span><span>${n}</span>${n < 10 ? `<span>${n + 1}</span>` : ""}</div>`, why: `Avant ${n}, il y a ${n - 1}.`}, opts(n - 1, 0, 10)); };
  const grand = () => { const o = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5), m = Math.max(...o);
    return {q: "Montre le plus grand nombre.", html: '<div class="bignum">🐘</div>', o: o.map(String), a: o.indexOf(m), why: `${m} est le plus grand nombre.`}; };
  // a + b = s, with s between lo and hi (a ≥ 2, so that "2 pommes" is plural)
  const plus = (lo, hi) => { const [e, w] = OBJ[R(0, OBJ.length - 1)], s = R(lo, hi), a = R(2, s - 1), b = s - a;
    return Object.assign({q: `${a} ${w} et encore ${b}. Combien ça fait en tout ?`, html: `<div class="calc">${grp(e, a)}<span>+</span>${grp(e, b)}<span>=</span><span>?</span></div>`, why: `${a} et ${b}, ça fait ${s}.`, whyHtml: counted(e, s)}, opts(s, 1, 10)); };
  const moins = (lo, hi) => { const t = R(lo, hi), b = R(1, t - 1), r = t - b, k = R(0, 1);
    const [e, txt] = k ? ["🎈", `J'ai ${t} ballons. ${b} s'envole${b > 1 ? "nt" : ""}. Combien en reste-t-il ?`] : ["🍬", `J'ai ${t} bonbons. J'en mange ${b}. Combien en reste-t-il ?`];
    return Object.assign({q: txt, html: grp(e, t, b), why: `${t} moins ${b}, il en reste ${r}.`, whyHtml: counted(e, r)}, opts(r, 0, 10)); };

  window.DOKO_GS = [
    {id: "gs-nombres", title: "Les nombres", kind: "Compter", level: "Grande section", emoji: "🔢", time: 30,
      gen: lv => lv === 1 ? [() => count(2, 5), () => nombre(1, 5), de][R(0, 2)]()
               : lv === 2 ? [() => count(6, 10), apres, avant, grand][R(0, 3)]()
               : [() => count(7, 10), () => nombre(6, 10), apres, avant][R(0, 3)]()},
    {id: "gs-calculs", title: "Les calculs", kind: "Ajouter, enlever", level: "Grande section", emoji: "➕", time: 30,
      gen: lv => lv === 1 ? [() => plus(3, 5), () => moins(3, 5)][R(0, 1)]()
               : lv === 2 ? [() => plus(5, 7), () => moins(5, 7)][R(0, 1)]()
               : [() => plus(7, 10), () => moins(7, 10)][R(0, 1)]()}
  ];
})();
