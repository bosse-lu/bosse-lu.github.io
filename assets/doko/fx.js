/* DÒKÒ background: the elements drawn in code (no images).
   Fire = embers rising, Water = bubbles, Earth = grains of sand, Wood = falling leaves, Wind = gusts.
   DokoFX.set("fire" | "water" | "earth" | "wood") makes one element stronger. */
(function () {
  const cv = document.getElementById("fx"); if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d"), still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, dpr = 1, parts = [], focus = null, last = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); build();
  }
  function make(kind, anywhere) {
    const p = {kind, t: rnd(0, 100)};
    if (kind === "fire") Object.assign(p, {x: rnd(0, W), y: anywhere ? rnd(0, H) : H + 10, r: rnd(1.2, 3.2), vy: rnd(-55, -25), vx: rnd(-8, 8), hue: rnd(12, 45)});
    if (kind === "water") Object.assign(p, {x: rnd(0, W), y: anywhere ? rnd(0, H) : H + 20, r: rnd(3, 10), vy: rnd(-26, -12), vx: 0});
    if (kind === "earth") Object.assign(p, {x: anywhere ? rnd(0, W) : -10, y: rnd(H * .3, H), r: rnd(.8, 2.2), vy: rnd(-3, 3), vx: rnd(8, 22), hue: rnd(30, 45)});
    if (kind === "wood") Object.assign(p, {x: rnd(0, W), y: anywhere ? rnd(0, H) : -20, r: rnd(5, 9), vy: rnd(14, 30), vx: rnd(-6, 10), rot: rnd(0, 6.28), vr: rnd(-1.5, 1.5), hue: rnd(95, 135)});
    if (kind === "wind") Object.assign(p, {x: anywhere ? rnd(-W, W) : -rnd(200, 600), y: rnd(0, H), len: rnd(120, 260), vx: rnd(160, 260), amp: rnd(6, 16)});
    return p;
  }
  function build() {
    const k = Math.max(.45, Math.min(1, W * H / (1280 * 800)));
    const n = el => Math.round((focus ? (focus === el ? 34 : 7) : 14) * k);
    parts = [];
    ["fire", "water", "earth", "wood"].forEach(el => { for (let i = 0; i < n(el); i++) parts.push(make(el, true)); });
    for (let i = 0; i < Math.round(4 * k); i++) parts.push(make("wind", true));
  }
  function draw(p) {
    if (p.kind === "fire") {
      const a = .45 + .4 * Math.sin(p.t * 9), g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
      g.addColorStop(0, `hsla(${p.hue},100%,65%,${a})`); g.addColorStop(1, `hsla(${p.hue},100%,50%,0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.28); ctx.fill();
    } else if (p.kind === "water") {
      ctx.strokeStyle = "rgba(140,190,255,.45)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.stroke();
      ctx.fillStyle = "rgba(200,230,255,.5)"; ctx.beginPath(); ctx.arc(p.x - p.r * .35, p.y - p.r * .35, p.r * .22, 0, 6.28); ctx.fill();
    } else if (p.kind === "earth") {
      ctx.fillStyle = `hsla(${p.hue},70%,55%,.55)`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
    } else if (p.kind === "wood") {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = `hsla(${p.hue},60%,42%,.6)`;
      ctx.beginPath(); ctx.ellipse(0, 0, p.r, p.r * .45, 0, 0, 6.28); ctx.fill();
      ctx.strokeStyle = "rgba(20,50,20,.5)"; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(-p.r, 0); ctx.lineTo(p.r, 0); ctx.stroke(); ctx.restore();
    } else {
      const g = ctx.createLinearGradient(p.x - p.len, 0, p.x, 0); g.addColorStop(0, "rgba(220,230,255,0)"); g.addColorStop(1, "rgba(220,230,255,.22)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.beginPath();
      for (let i = 0; i <= 12; i++) { const x = p.x - p.len + p.len * i / 12, y = p.y + Math.sin(i / 2 + p.t * 2) * p.amp; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
    }
  }
  function step(dt) {
    parts.forEach((p, i) => {
      p.t += dt;
      if (p.kind === "water") p.x += Math.sin(p.t * 2) * 12 * dt;
      if (p.kind === "wood") { p.rot += p.vr * dt; p.x += Math.sin(p.t * 1.5) * 20 * dt; }
      if (p.kind === "earth") p.y += Math.sin(p.t) * 4 * dt;
      p.x += (p.vx || 0) * dt; p.y += (p.vy || 0) * dt;
      const out = p.y < -40 || p.y > H + 40 || p.x > W + (p.len || 40) + 20 || p.x < -700;
      if (out) parts[i] = make(p.kind, false);
    });
  }
  function frame(ts) {
    const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    ctx.clearRect(0, 0, W, H); step(dt); parts.forEach(draw);
    if (!document.hidden) requestAnimationFrame(frame);
  }
  window.DokoFX = {set(el) { if (el === focus) return; focus = el; build(); if (still) { ctx.clearRect(0, 0, W, H); parts.forEach(draw); } }};
  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !still) { last = performance.now(); requestAnimationFrame(frame); } });
  resize();
  if (still) parts.forEach(draw); else requestAnimationFrame(frame);
})();
