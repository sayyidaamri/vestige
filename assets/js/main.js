/* Vestige — global behaviour (vanilla JS, no dependencies) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  window.VS = { $, $$, clamp, RM, store };

  /* ---------- header: slide to the left once scrolled ---------- */
  const hdr = $("#hdr");
  const onScrollHdr = () => hdr && hdr.classList.toggle("is-scrolled", scrollY > 5);
  addEventListener("scroll", onScrollHdr, { passive: true }); onScrollHdr();

  /* ---------- Learn dropdown (hover on desktop, click everywhere, keyboard) ---------- */
  $$(".has-dd").forEach((li) => {
    const btn = $("button", li), dd = $(".dd", li);
    let t;
    const set = (o) => { dd.classList.toggle("open", o); btn.setAttribute("aria-expanded", o); };
    const fine = matchMedia("(hover: hover) and (min-width: 768px)");
    li.addEventListener("mouseenter", () => { if (fine.matches) { clearTimeout(t); set(true); } });
    li.addEventListener("mouseleave", () => { if (fine.matches) t = setTimeout(() => set(false), 120); });
    btn.addEventListener("click", () => set(!dd.classList.contains("open")));
    btn.addEventListener("keydown", (e) => { if (e.key === "ArrowDown") { e.preventDefault(); set(true); $("a", dd)?.focus(); } });
    dd.addEventListener("keydown", (e) => {
      const links = $$("a", dd), i = links.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); links[(i + 1) % links.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
      if (e.key === "Escape") { set(false); btn.focus(); }
    });
    li.addEventListener("focusout", (e) => { if (!li.contains(e.relatedTarget)) set(false); });
    document.addEventListener("click", (e) => { if (!li.contains(e.target)) set(false); });
  });

  /* ---------- sticky product CTA: starts at the bottom of the first screen, scrolls up, then sticks ---------- */
  const scta = $("#scta");
  if (scta) {
    const mob = matchMedia("(max-width: 767px)");
    const upd = () => {
      if (mob.matches) { scta.style.setProperty("--ym", scrollY > innerHeight * .6 ? "0px" : "140%"); return; }
      const h = scta.offsetHeight || 82;
      const start = Math.max(600, innerHeight) - h - 20;
      scta.style.setProperty("--y", Math.max(16, start - scrollY) + "px");
    };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    if (document.body.dataset.page === "product") scta.hidden = true;
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal]").forEach((el, i) => { el.style.transitionDelay = (el.dataset.delay || 0) + "ms"; io.observe(el); });

  /* ---------- pills timeline: scrambled label swap + masked gap around the label ---------- */
  const CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function scramble(el, to, dur = 900) {
    const from = el.textContent; const L = Math.max(from.length, to.length); const t0 = performance.now();
    const step = (now) => {
      const p = clamp((now - t0) / dur); let s = "";
      for (let i = 0; i < L; i++) {
        const settle = i / L * .7 + .3;
        if (p >= settle) s += to[i] ?? "";
        else if (to[i] === " " || from[i] === " ") s += " ";
        else s += CH[(Math.random() * 26) | 0];
      }
      el.textContent = s.replace(/\s+$/, "") || to;
      if (p < 1) requestAnimationFrame(step); else el.textContent = to;
    };
    requestAnimationFrame(step);
  }
  $$("[data-ptl]").forEach((root) => {
    const labels = JSON.parse(root.dataset.ptl); let i = +root.dataset.start || 0;
    const lab = $(".ptl-label", root), dot = $(".dot", lab), txt = $(".ptl-text", lab), strip = $(".ptl-strip", root);
    const mask = () => {
      const r = lab.getBoundingClientRect(), rr = root.getBoundingClientRect();
      const a = (r.left - rr.left - 4) / rr.width * 100, b = (r.right - rr.left + 4) / rr.width * 100;
      strip.style.webkitMaskImage = strip.style.maskImage = `linear-gradient(to right,#000 ${a}%,transparent ${a}%,transparent ${b}%,#000 ${b}%)`;
    };
    mask(); addEventListener("resize", mask); document.fonts?.ready.then(mask);
    if (RM) return;
    setInterval(() => {
      i = (i + 1) % labels.length; const n = labels[i];
      dot.style.background = n.c;
      // measure target width first so the pill animates its width
      const w0 = lab.offsetWidth; const tmp = txt.textContent; txt.textContent = n.t; const w1 = lab.offsetWidth; txt.textContent = tmp;
      lab.style.width = w0 + "px"; requestAnimationFrame(() => { lab.style.width = w1 + "px"; });
      scramble(txt, n.t.toUpperCase() === n.t ? n.t : n.t, 900);
      setTimeout(() => { lab.style.width = ""; mask(); }, 950);
      setTimeout(mask, 320);
    }, 4200);
  });

  /* ---------- accordions ---------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".acc-btn"); if (!b) return;
    const acc = b.closest(".acc"); const open = !acc.classList.contains("open");
    acc.classList.toggle("open", open); b.setAttribute("aria-expanded", open);
  });

  /* ---------- cards carousel ---------- */
  $$("[data-carousel]").forEach((sec) => {
    const items = $$(".ccar-item", sec), prev = $("[data-prev]", sec), next = $("[data-next]", sec), track = $(".ccar-track", sec);
    let a = 0;
    const layout = () => {
      if (innerWidth < 768) { items.forEach((it) => { it.style.transform = ""; it.style.opacity = ""; }); return; }
      const W = track.clientWidth; const first = Math.min(W * .32, 460);
      const left = (W + 16) / 12 * 1; // column 2 start
      const gap = 410 * (W / 1392);
      items.forEach((it, i) => {
        const r = i - a;
        it.classList.toggle("is-active", r === 0);
        let x, y = 0, s = 1, o = 1;
        if (r < 0) { x = left - 520; o = 0; }
        else if (r === 0) { x = left; }
        else { x = left + 507 * (W / 1392) + (r - 1) * gap; y = 180; s = .76; o = r > 3 ? 0 : 1; }
        it.style.transform = `translate(${x}px, ${y}px) scale(${s})`; it.style.opacity = o;
        it.setAttribute("aria-hidden", r !== 0);
      });
      prev.disabled = a === 0; next.disabled = a === items.length - 1;
    };
    prev?.addEventListener("click", () => { a = Math.max(0, a - 1); layout(); });
    next?.addEventListener("click", () => { a = Math.min(items.length - 1, a + 1); layout(); });
    items.forEach((it, i) => it.addEventListener("click", () => { if (i !== a && innerWidth >= 768) { a = i; layout(); } }));
    // swipe
    let sx = null;
    track.addEventListener("pointerdown", (e) => { sx = e.clientX; });
    addEventListener("pointerup", (e) => { if (sx == null) return; const d = e.clientX - sx; sx = null; if (Math.abs(d) > 50 && innerWidth >= 768) { a = clamp(a + (d < 0 ? 1 : -1), 0, items.length - 1); layout(); } });
    sec.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") next.click(); if (e.key === "ArrowLeft") prev.click(); });
    addEventListener("resize", layout); layout();
  });

  /* ---------- modals ---------- */
  let lastFocus;
  const openModal = (m) => {
    lastFocus = document.activeElement; m.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => m.classList.add("open")));
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => $("input, button:not(.modal-x), a", $(".modal-box", m))?.focus(), 60);
  };
  const closeModal = (m) => {
    m.classList.remove("open"); document.documentElement.style.overflow = "";
    setTimeout(() => { m.hidden = true; }, 400); lastFocus?.focus?.();
    m.dispatchEvent(new Event("closed"));
  };
  window.VS.openModal = openModal; window.VS.closeModal = closeModal;
  $$(".modal").forEach((m) => {
    m.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(m); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.classList.contains("open")) closeModal(m); });
    m.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { const f = $$("a[href],button:not([disabled]),input,textarea", m).filter((x) => x.offsetParent); const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
    });
  });
  window.VS.dialog = (t, p) => { const d = $("#dialog"); $("#dlg-h", d).textContent = t; $(".dlg-p", d).textContent = p; openModal(d); };
  const toastEl = $("#toast"); let tt;
  window.VS.toast = (msg) => { toastEl.textContent = msg; toastEl.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("show"), 2600); };

  /* newsletter popup: shows once after 6s (or on exit intent), remembered for 7 days */
  const nl = $("#nl-modal");
  if (nl && !["cart"].includes(document.body.dataset.page)) {
    const force = new URLSearchParams(location.search).has("popup");
    const seen = store.get("vs_nl", 0); const fresh = force || (Date.now() - seen > 7 * 864e5 && !store.get("vs_nl_done", false));
    let shown = false;
    const ex = (e) => { if (!e.relatedTarget && e.clientY < 5) show(); };
    const show = () => { if (shown) return; shown = true; document.removeEventListener("mouseout", ex); store.set("vs_nl", Date.now()); openModal(nl); };
    if (fresh) { setTimeout(show, 6000); document.addEventListener("mouseout", ex); }
    const f = $("form", nl), em = $("#nl-email"), err = $(".err-msg", nl);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) { em.classList.add("err"); err.textContent = "Please enter a valid email address."; em.focus(); return; }
      em.classList.remove("err"); err.textContent = ""; store.set("vs_nl_done", true);
      $('[data-step="form"]', nl).hidden = true; $('[data-step="done"]', nl).hidden = false; $('[data-step="done"] a', nl).focus();
    });
    em.addEventListener("input", () => { em.classList.remove("err"); err.textContent = ""; });
  }

  /* ---------- cart (localStorage) ---------- */
  const cart = {
    get: () => store.get("vs_cart", []),
    set(c) { store.set("vs_cart", c); cart.badge(); document.dispatchEvent(new Event("cart")); },
    add(item) { const c = cart.get(); const ex = c.find((x) => x.id === item.id); if (ex) ex.qty += 1; else c.push({ ...item, qty: 1 }); cart.set(c); },
    count: () => cart.get().reduce((a, b) => a + b.qty, 0),
    badge() { $$("[data-cart-count]").forEach((el) => { const n = cart.count(); el.textContent = n ? `(${n})` : ""; }); },
  };
  window.VS.cart = cart; cart.badge();

  /* ---------- lazy videos: load when near the viewport, pause when off-screen ---------- */
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src && v.dataset.src && v.dataset.lazy !== "manual") v.src = v.dataset.src; if (v.dataset.lazy !== "manual" || v.classList.contains("on")) v.play?.().catch(() => {}); }
    else v.pause?.();
  }), { rootMargin: "200px" });
  $$("video[data-src]").forEach((v) => vio.observe(v));

  /* ---------- generic form validation helper ---------- */
  window.VS.validate = (form) => {
    let ok = true;
    $$("[data-req]", form).forEach((inp) => {
      const fld = inp.closest(".fld, .chk"); let bad = false;
      if (inp.type === "checkbox") bad = !inp.checked;
      else if (inp.type === "email") bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inp.value.trim());
      else bad = !inp.value.trim();
      fld.classList.toggle("bad", bad); const m = $(".msg", fld); if (m) m.textContent = bad ? (inp.dataset.msg || "This field is required.") : "";
      if (bad && ok) { inp.focus(); ok = false; }
    });
    return ok;
  };
  document.addEventListener("input", (e) => { const f = e.target.closest(".fld.bad, .chk.bad"); if (f) { f.classList.remove("bad"); const m = $(".msg", f); if (m) m.textContent = ""; } });
})();
