/* Home: pinned video hero (words blur out, background blurs, "why" copy lights up word by word)
   + how-it-works step sync. Shared by other pages that reuse .hiw. */
(() => {
  const { $, $$, clamp, RM } = window.VS;
  const map = (p, a, b) => clamp((p - a) / (b - a));

  /* ----- hero ----- */
  const hh = $("#hh");
  if (hh) {
    const vids = $$(".hh-media video", hh);
    let vi = 0;
    const load = (v) => { if (!v.src) { v.src = v.dataset.src; v.load(); } };
    load(vids[0]); vids[0].play().catch(() => {});
    load(vids[1]);
    if (!RM) setInterval(() => {
      if (hh.getBoundingClientRect().bottom < 0) return;
      const cur = vids[vi]; vi = (vi + 1) % vids.length; const nx = vids[vi];
      load(nx); load(vids[(vi + 1) % vids.length]);
      nx.currentTime = 0; nx.play().catch(() => {}); nx.classList.add("on");
      setTimeout(() => { cur.classList.remove("on"); setTimeout(() => cur.pause(), 1500); }, 50);
    }, 5600);

    const words = $$(".hh-title .w", hh), btn = $(".hh-copy .btn", hh), line = $(".hh-line", hh), bottom = $(".hh-bottom", hh);
    const blur = $(".hh-blur", hh), pill = $(".hh-why-pill", hh), whyG = $(".hh-why .grid", hh), whyW = $$(".hh-why-txt .w", hh);
    const fade = (el, o, b = 0, y = 0) => { el.style.opacity = o; el.style.filter = b ? `blur(${b}px)` : ""; el.style.transform = y ? `translateY(${y}px)` : ""; };
    const tick = () => {
      const r = hh.getBoundingClientRect(); const total = hh.offsetHeight - innerHeight;
      const p = clamp(-r.top / total);
      words.forEach((w, i) => { const q = map(p, .015 + i * .016, .09 + i * .016); fade(w, 1 - q, q * 14); });
      const q2 = map(p, .04, .18); fade(btn, 1 - q2, q2 * 10); fade(line, 1 - map(p, .02, .14), map(p, .02, .14) * 12); fade(bottom, 1 - map(p, .02, .12));
      blur.style.setProperty("--blur", map(p, .0, .26)); blur.style.opacity = map(p, .0, .26);
      const q3 = map(p, .24, .32); pill.style.opacity = q3;
      whyG.style.opacity = q3; whyG.style.transform = `translateY(${(1 - q3) * 40}px)`; whyG.style.filter = q3 < 1 ? `blur(${(1 - q3) * 10}px)` : "";
      const lit = Math.round(map(p, .32, .88) * whyW.length);
      whyW.forEach((w, i) => w.classList.toggle("on", i < lit));
      $(".hh-intro", hh).style.pointerEvents = p > .2 ? "none" : "";
    };
    if (RM) { whyW.forEach((w) => w.classList.add("on")); }
    addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true }); addEventListener("resize", tick); tick();
  }

  /* ----- how it works: swap the sticky visual to the step in view ----- */
  $$(".hiw").forEach((sec) => {
    const steps = $$(".hiw-step", sec), vis = $$(".hiw-vis", sec);
    const upd = () => {
      const mid = innerHeight * .45; let a = 0;
      steps.forEach((s, i) => { if (s.getBoundingClientRect().top < mid) a = i; });
      vis.forEach((v, i) => v.classList.toggle("on", i === a));
    };
    addEventListener("scroll", () => requestAnimationFrame(upd), { passive: true }); upd();
  });
})();
