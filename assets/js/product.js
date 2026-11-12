/* Product page + shared explorers: variants, add to cart, gallery lightbox, element explorer, reviews */
(() => {
  const { $, $$, cart, openModal, toast } = window.VS;

  /* variants (radio cards that expand) */
  const form = $("[data-variants]");
  if (form) {
    const sel = (v) => $$(".var", form).forEach((c) => { const on = c.dataset.v === v; c.classList.toggle("on", on); $("input", c).checked = on; });
    form.addEventListener("change", (e) => sel(e.target.value));
    $$(".var", form).forEach((c) => c.addEventListener("click", (e) => { if (!e.target.closest("button")) sel(c.dataset.v); }));
    $$("[data-add]", form).forEach((b) => b.addEventListener("click", () => {
      const sub = b.dataset.add === "sub";
      cart.add({ id: sub ? "vestige-sub" : "vestige-one", name: "Vestige™ Exposure Test", variant: sub ? "Quarterly tracking · every 3 months" : "One-time purchase", price: sub ? 239 : 299, img: "assets/img/kit.svg" });
      const t = b.textContent; b.classList.add("added"); b.textContent = "Added — view cart →";
      toast("Added to your cart");
      b.onclick = () => (location.href = "cart.html");
      setTimeout(() => { b.classList.remove("added"); b.textContent = t; b.onclick = null; }, 4000);
    }));
  }

  /* gallery lightbox */
  const gal = $("[data-gallery]"), lb = $("#lightbox");
  if (gal && lb) {
    const items = $$(".g", gal); let i = 0;
    const show = () => { const g = items[i]; const box = $(".lb-img", lb); box.innerHTML = ""; const img = $("img", g).cloneNode(); img.loading = "eager"; box.append(img); const sc = $(".r-score", g); if (sc) { box.style.position = "relative"; box.append(sc.cloneNode(true)); } $(".lb-count", lb).textContent = `${i + 1} / ${items.length}`; };
    items.forEach((g, k) => g.addEventListener("click", () => { i = k; show(); openModal(lb); }));
    $$("[data-lb]", lb).forEach((b) => b.addEventListener("click", () => { i = (i + +b.dataset.lb + items.length) % items.length; show(); }));
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") $('[data-lb="1"]', lb).click(); if (e.key === "ArrowLeft") $('[data-lb="-1"]', lb).click(); });
  }

  /* explorers: hover/click a name → swap image + description */
  $$("[data-explorer]").forEach((ex) => {
    const btns = $$(".ex-btn", ex), imgs = $$(".ex-media img", ex), desc = $(".ex-desc", ex), list = $(".ex-list", ex);
    const descs = window.VS_ELEMENTS;
    const set = (k) => {
      btns.forEach((b, j) => b.classList.toggle("on", j === k)); imgs.forEach((im, j) => im.classList.toggle("on", j === k));
      const b = btns[k]; desc.textContent = b.dataset.desc || (descs && descs[k]) || desc.textContent;
      list.style.setProperty("--bar-y", (b.offsetTop - list.querySelector("ol").scrollTop + b.offsetHeight / 2 - 20) + "px");
      const ol = $("ol", ex); if (innerWidth >= 768 && ol.scrollHeight > ol.clientHeight) { const t = b.parentElement.offsetTop - ol.clientHeight / 2 + b.offsetHeight / 2; ol.scrollTo({ top: t, behavior: "smooth" }); setTimeout(() => list.style.setProperty("--bar-y", (b.parentElement.offsetTop - ol.scrollTop + b.offsetHeight / 2 - 20) + "px"), 450); }
    };
    btns.forEach((b, k) => { b.addEventListener("mouseenter", () => matchMedia("(hover:hover)").matches && set(k)); b.addEventListener("click", () => set(k)); b.addEventListener("focus", () => set(k)); });
    set(0);
  });

  /* reviews: filters, sort, show more, helpful votes, write */
  const rvList = $(".rv-list");
  if (rvList) {
    const all = $$(".rv", rvList); let shown = 5, filter = "all";
    const render = () => {
      let vis = all.filter((r) => filter === "all" || (filter === "media" ? r.dataset.media === "1" : r.dataset.ver === "1"));
      all.forEach((r) => (r.hidden = true)); vis.slice(0, shown).forEach((r) => (r.hidden = false));
      $("[data-rv-more]").hidden = shown >= vis.length;
      $("[data-rv-count]").textContent = filter === "all" ? $("[data-rv-count]").dataset.total : `${vis.length} reviews`;
    };
    $("[data-rv-count]").dataset.total = $("[data-rv-count]").textContent;
    $("[data-rv-more]").addEventListener("click", () => { shown += 5; render(); });
    $("[data-rv-filter]").addEventListener("click", () => { const f = $(".rv-filters"); f.hidden = !f.hidden; });
    $$(".rv-chip").forEach((c) => c.addEventListener("click", () => { $$(".rv-chip").forEach((x) => x.classList.toggle("on", x === c)); filter = c.dataset.f; render(); }));
    $("[data-rv-sort]").addEventListener("change", (e) => {
      const v = e.target.value; const sorted = [...all].sort((a, b) => v === "media" ? b.dataset.media - a.dataset.media : a.dataset.i - b.dataset.i);
      sorted.forEach((r) => rvList.append(r)); all.splice(0, all.length, ...sorted); render();
    });
    rvList.addEventListener("click", (e) => { const b = e.target.closest("[data-vote]"); if (!b || b.classList.contains("voted")) return; b.classList.add("voted"); const s = $("span", b); s.textContent = +s.textContent + 1; });
    $("[data-rv-write]").addEventListener("click", () => window.VS.dialog("Thanks for wanting to share", "Reviews open once your results are delivered. We'll email you a link to write yours."));
    render();
  }
})();
