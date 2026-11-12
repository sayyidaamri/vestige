/* Journal: filter articles by topic card or element tile (multi-select elements, single topic) */
(() => {
  const { $, $$ } = window.VS;
  const list = $("[data-jlist]"); if (!list || !$(".jtopics")) return;
  const rows = $$(".jrow", list), tiles = $$(".jel-tile"), topics = $$(".jtopic"), allBtn = $(".jel-all"), empty = $(".jempty"), n = $("[data-n]");
  let els = new Set(), topic = "";
  const apply = () => {
    let c = 0;
    rows.forEach((r) => {
      const re = r.dataset.els ? r.dataset.els.split(",") : [];
      const ok = (!els.size || re.some((e) => els.has(e))) && (!topic || r.dataset.topic === topic);
      r.classList.toggle("hide", !ok); if (ok) c++;
    });
    n.textContent = c; empty.hidden = c > 0;
    allBtn.classList.toggle("off", els.size > 0 || !!topic);
    tiles.forEach((t) => { const on = els.has(t.dataset.el); t.classList.toggle("on", on); t.setAttribute("aria-pressed", on); });
    topics.forEach((t) => { const on = t.dataset.topic === topic; t.classList.toggle("on", on); t.setAttribute("aria-pressed", on); });
  };
  tiles.forEach((t) => t.addEventListener("click", () => { const e = t.dataset.el; els.has(e) ? els.delete(e) : els.add(e); apply(); }));
  topics.forEach((t) => t.addEventListener("click", () => { topic = topic === t.dataset.topic ? "" : t.dataset.topic; apply(); }));
  $$("[data-all]").forEach((b) => b.addEventListener("click", () => { els.clear(); topic = ""; apply(); }));
  apply();
})();
