/* Contact form, cart page and account (demo — nothing is sent anywhere) */
(() => {
  const { $, $$, validate, cart, dialog } = window.VS;
  const money = (n) => "$" + n.toFixed(2);

  /* contact */
  const cf = $("[data-contact]");
  if (cf) {
    const btn = $("button[type=submit]", cf);
    const refresh = () => { const ready = $$("[data-req]", cf).every((i) => (i.type === "checkbox" ? i.checked : i.value.trim())); btn.className = "btn " + (ready ? "btn--green" : "btn--grey"); };
    cf.addEventListener("input", refresh); cf.addEventListener("change", refresh);
    cf.addEventListener("submit", (e) => {
      e.preventDefault(); if (!validate(cf)) return;
      btn.disabled = true; btn.textContent = "Sending…";
      setTimeout(() => { cf.innerHTML = `<div class="form-ok"><h2 class="h3">Thanks, your message is in.</h2><p>Our team replies within one business day. (Demo: nothing was actually sent.)</p></div>`; }, 700);
    });
  }

  /* cart */
  const box = $("[data-cart]");
  if (box) {
    const render = () => {
      const items = cart.get(); const sub = items.reduce((a, b) => a + b.price * b.qty, 0);
      $("[data-empty]", box).hidden = items.length > 0; $("[data-items]", box).hidden = !items.length;
      $("[data-sub-row]", box).hidden = $("[data-ship-row]", box).hidden = !items.length;
      $("[data-items]", box).innerHTML = items.map((it, i) => `<div class="ci"><div class="ci-img"><img src="${it.img}" alt=""></div><div><h3>${it.name}</h3><p class="v">${it.variant}</p><div class="qty"><button type="button" data-q="-1" data-i="${i}" aria-label="Decrease quantity">−</button><span>${it.qty}</span><button type="button" data-q="1" data-i="${i}" aria-label="Increase quantity">+</button></div><button class="rm" type="button" data-rm="${i}">Remove</button></div><p class="p">${money(it.price * it.qty)}</p></div>`).join("");
      $("[data-sub]", box).textContent = money(sub); $("[data-total]", box).textContent = money(sub);
      const co = $("[data-checkout]", box); co.disabled = !items.length; co.className = "btn " + (items.length ? "btn--green" : "btn--grey");
    };
    box.addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]"); const items = cart.get();
      if (q) { const it = items[+q.dataset.i]; it.qty = Math.max(1, Math.min(9, it.qty + +q.dataset.q)); cart.set(items); render(); }
      if (rm) { items.splice(+rm.dataset.rm, 1); cart.set(items); render(); }
    });
    $("[data-checkout]", box).addEventListener("click", () => dialog("Checkout is a demo", "This static build has no payment provider connected. Hook your store's checkout up here."));
    render();
  }

  /* account */
  const auth = $("[data-auth]");
  if (auth) {
    const go = (v) => $$("[data-view]", auth).forEach((x) => (x.hidden = x.dataset.view !== v));
    auth.addEventListener("click", (e) => { const g = e.target.closest("[data-go]"); if (g) go(g.dataset.go); });
    $$("[data-login]", auth).forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); if (validate(f)) go("done"); }));
  }

  /* sample report link */
  $$("[data-sample]").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); dialog("Sample report", "Add your own sample report PDF here — this demo build doesn't include one."); }));
})();
