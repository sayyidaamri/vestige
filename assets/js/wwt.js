/* What we test: pinned intro → oval mask opens onto the gradient → three element groups, each revealed through a growing oval window */
(() => {
  const { $, $$, clamp, RM } = window.VS;
  const sec = $("#wwt"); if (!sec) return;
  const map = (p, a, b) => clamp((p - a) / (b - a));
  const mask = $(".oval-mask", sec), intro = $(".wwt-intro-c", sec), slides = $$(".wwt-slide", sec);

  /* vertical auto carousel of element pills */
  const track = $(".vcar-track", sec), items = $$(".vcar-item", track); const n = items.length / 3; let k = n + 2;
  const h = () => items[0].offsetHeight;
  const go = (anim = true) => {
    track.style.transition = anim ? "" : "none";
    track.style.transform = `translateY(${-(k - 1) * h()}px)`;
    items.forEach((it, i) => it.classList.toggle("on", i === k));
  };
  go(false);
  if (!RM) setInterval(() => {
    k++; go();
    if (k >= 2 * n + 2) setTimeout(() => { k -= n; go(false); }, 1050);
  }, 3000);

  /* tabs inside each slide (click, hover, arrow keys) */
  slides.forEach((s) => {
    const tabs = $$(".wwt-tab", s), panels = $$(".wwt-panel", s);
    const set = (i, focus) => { tabs.forEach((t, j) => { t.setAttribute("aria-selected", i === j); t.tabIndex = i === j ? 0 : -1; }); panels.forEach((p, j) => p.classList.toggle("on", i === j)); if (focus) tabs[i].focus(); };
    tabs.forEach((t, i) => { t.addEventListener("click", () => set(i)); t.addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && set(i)); t.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") set((i + 1) % tabs.length, 1); if (e.key === "ArrowLeft") set((i - 1 + tabs.length) % tabs.length, 1); }); });
  });

  const content = slides.map((s) => ({ s, pill: $(".pill", s), tabs: $$(".wwt-tab", s), panels: $(".wwt-panels", s) }));
  const show = (c, q) => {
    const all = [c.pill, ...c.tabs, c.panels];
    all.forEach((el, i) => { const d = clamp(q * (all.length * .35 + 1) - i * .35); el.style.opacity = d; el.style.filter = d < 1 ? `blur(${(1 - d) * 12}px)` : ""; });
    c.s.style.pointerEvents = q > .9 ? "auto" : "none";
  };
  const R = [[.09, .15, .36, .40], [.46, .52, .70, .74], [.80, .86, 2, 3]];
  const tick = () => {
    const r = sec.getBoundingClientRect(); const p = clamp(-r.top / (sec.offsetHeight - innerHeight));
    const o = map(p, 0, .1);
    mask.style.setProperty("--oval", 1 + o * o * 8);
    mask.style.opacity = 1 - map(p, .07, .1);
    intro.style.opacity = 1 - map(p, .01, .06); intro.style.filter = `blur(${map(p, .01, .06) * 12}px)`;
    $(".wwt-intro", sec).style.visibility = p > .1 ? "hidden" : "";
    content.forEach((c, i) => {
      const [a, b, x, y] = R[i];
      const q = Math.min(map(p, a, b), 1 - map(p, x, y));
      show(c, q);
      if (i === 0) { c.s.style.opacity = 1; c.s.classList.add("vis"); }
      else { const w = map(p, R[i][0] - .08, R[i][0] + .02); c.s.style.opacity = w > 0 ? 1 : 0; c.s.classList.toggle("vis", w > 0); c.s.style.setProperty("--oval", w * w * 7); }
    });
  };
  if (RM) { sec.style.height = "auto"; }
  addEventListener("scroll", () => requestAnimationFrame(tick), { passive: true }); addEventListener("resize", tick); tick();
})();
