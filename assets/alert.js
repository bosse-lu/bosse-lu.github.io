/* Teacher's notice: a red banner at the top of the pages that load this script.
   To remove it, set MSG to "" (or delete the <script src="…alert.js"> lines). */
(function () {
  const MSG = `<b>Suite à la grève du 5 novembre</b>, je mets en place la continuité pédagogique : les activités <span style="white-space:nowrap">« Fill in the note »</span> et <span style="white-space:nowrap">« Le son -ed »</span> sont débloquées et accessibles.<span class="sig">M. BOSSE</span>`;
  if (!MSG || window.__siteAlert) return; window.__siteAlert = true;
  const st = document.createElement("style");
  st.textContent = `
  .site-alert{box-sizing:border-box;background:#b3261e;color:#fff;font:400 1rem/1.5 "Atkinson Hyperlegible",Verdana,system-ui,sans-serif;padding:12px 16px;text-align:center;border-bottom:3px solid #7a1712}
  .site-alert p{margin:0 auto;max-width:860px}
  .site-alert .ico{margin-right:6px}
  .site-alert .sig{display:block;font-weight:700;margin-top:4px;letter-spacing:.03em}`;
  document.head.appendChild(st);
  const put = () => {
    const d = document.createElement("div"); d.className = "site-alert"; d.setAttribute("role", "note"); d.lang = "fr";
    d.innerHTML = `<p><span class="ico" aria-hidden="true">📢</span>${MSG}</p>`;
    document.body.prepend(d);
  };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", put) : put();
})();
