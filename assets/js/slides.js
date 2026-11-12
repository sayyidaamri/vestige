/* Hero slides (story / science): pinned background, slides crossfade with blur as you scroll,
   background blurs after the first slide. Also: number count-up, oval parallax, fullscreen video. */
(() => {
  const { $, $$, clamp, RM } = window.VS;
  const map = (p, a, b) => clamp((p - a) / (b - a));

  $$("[data-hs]").forEach((sec) => {
    const slides = $$(".hs-slide", sec), blur = $(".hs-blur", sec), v = $("video", sec);
    if (v && !v.src) { v.src = v.dataset.src; v.play().catch(() => {}); }
    const n = slides.length;
    const tick = () => {
      const r = sec.getBoundingClientRect(); const p = clamp(-r.top / (sec.offsetHeight - innerHeight));
      const seg = 1 / n;
      blur.style.opacity = map(p, seg * .3, seg * .8);
      slides.forEach((s, i) => {
        const a = i * seg, b = (i + 1) * seg;
        const fin = i === 0 ? 1 : map(p, a - seg * .15, a + seg * .15);
        const fout = i === n - 1 ? 0 : map(p, b - seg * .4, b - seg * .1);
        const q = Math.min(fin, 1 - fout);
        s.style.opacity = q; s.style.filter = q < 1 ? `blur(${(1 - q) * 14}px)` : "";
        s.style.transform = `translateY(${(fout * -30 + (1 - fin) * 30).toFixed(1)}px)`;
        s.classList.toggle("vis", q > 0.01);
        if (q > .6) $$("[data-count]", s).forEach(count);
      });
    };
    addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true }); addEventListener("resize", tick); tick();
  });

  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const to = +el.dataset.count, suf = el.dataset.suffix || ""; const t0 = performance.now();
    const step = (t) => { const q = clamp((t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))) + (q === 1 ? suf : ""); if (q < 1) requestAnimationFrame(step); };
    RM ? (el.textContent = to + suf) : requestAnimationFrame(step);
  }
  const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !e.target.closest("[data-hs]")) count(e.target); }), { threshold: .6 });
  $$("[data-count]").forEach((el) => cio.observe(el));

  /* parallax zoom on the oval step images */
  const par = $$("[data-par]");
  if (par.length && !RM) {
    const pt = () => par.forEach((el) => { const r = el.getBoundingClientRect(); const q = clamp(1 - (r.top + r.height / 2) / (innerHeight + r.height)); el.style.setProperty("--s", (1.18 - q * .14).toFixed(3)); });
    addEventListener("scroll", () => requestAnimationFrame(pt), { passive: true }); pt();
  }
})();
