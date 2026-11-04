/* "Je suis un autre élève": for shared computers. Any button with data-reset-btn opens a short confirmation;
   on yes, everything this site saved on the device (progress, answers, class code, settings) is erased
   and the page reloads blank for the next learner. Works for buttons added later too (event delegation). */
(function () {
  if (window.SiteReset) return;
  const st = document.createElement("style");
  st.textContent = `
  .reset-btn,.cl-box .reset-btn{font:inherit;font-size:.88rem;font-weight:700;border:1px dashed var(--line,#d9ddea);background:none;color:var(--muted,#5b6380);border-radius:10px;padding:6px 12px;cursor:pointer}
  .reset-btn:hover,.cl-box .reset-btn:hover{border-style:solid;color:var(--ink,#1b2340)}
  .reset-btn:focus-visible,.reset-ask button:focus-visible{outline:3px solid var(--accent,#2f4fd8);outline-offset:2px}
  .reset-ask{display:inline-flex;flex-wrap:wrap;align-items:center;gap:8px;background:var(--card,#fff);color:var(--ink,#1b2340);border:2px solid #c2412d;border-radius:12px;padding:10px 12px;font-size:.9rem;text-align:left;max-width:100%}
  .reset-ask p{margin:0;flex:1 1 220px}
  .reset-ask button{font:inherit;font-weight:700;border-radius:9px;padding:6px 12px;cursor:pointer;border:1px solid #c2412d}
  .reset-ask .yes{background:#c2412d;color:#fff}
  .reset-ask .no{background:none;color:inherit;border-color:var(--line,#d9ddea)}
  .reset-done{position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:90;background:#1f8a55;color:#fff;font:700 .95rem/1.4 "Atkinson Hyperlegible",Verdana,sans-serif;border-radius:12px;padding:10px 16px;box-shadow:0 6px 20px rgba(0,0,0,.25);max-width:calc(100% - 32px);text-align:center}`;
  document.head.appendChild(st);

  const label = '<span aria-hidden="true">👤</span> I am another student';
  const html = () => `<button type="button" class="reset-btn" data-reset-btn>${label}</button>`;

  function wipe() {
    try { localStorage.clear(); } catch (e) {}
    try { sessionStorage.clear(); sessionStorage.setItem("site-reset-done", "1"); } catch (e) {}
    location.reload();
  }
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-reset-btn]");
    if (b) {
      e.preventDefault();
      const ask = document.createElement("span"); ask.className = "reset-ask"; ask.setAttribute("role", "alertdialog"); ask.setAttribute("aria-label", "Effacer le travail sur cet appareil");
      ask.innerHTML = `<p><b>Delete all the work on this device?</b> Progress, answers and class code: the next student starts from zero. Copy your answers on your worksheet first.<span class="cg-fr" lang="fr" style="display:block;font-style:italic;font-size:.86em">Effacer tout le travail fait sur cet appareil ? Le prochain élève repart de zéro.</span></p>
        <button type="button" class="yes">Yes, delete</button><button type="button" class="no">Cancel</button>`;
      b.replaceWith(ask);
      ask.querySelector(".no").addEventListener("click", () => { const nb = document.createElement("span"); nb.innerHTML = html(); const btn = nb.firstChild; ask.replaceWith(btn); btn.focus(); });
      ask.querySelector(".yes").addEventListener("click", wipe);
      ask.querySelector(".no").focus();
    }
  });
  function toast() {
    let flag = null; try { flag = sessionStorage.getItem("site-reset-done"); sessionStorage.removeItem("site-reset-done"); } catch (e) {}
    if (!flag) return;
    const t = document.createElement("div"); t.className = "reset-done"; t.setAttribute("role", "status");
    t.textContent = "Done: the device is ready for a new student.";
    document.body.appendChild(t); setTimeout(() => t.remove(), 5000);
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", toast) : toast();
  window.SiteReset = {html};
})();
