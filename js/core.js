/* =========================================================
   PromptArcade — Core (state, helpers, modal, toast, router)
   ========================================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Persistent store ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("pa:" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("pa:" + k, JSON.stringify(v)); } catch {} },
  };

  const state = {
    credits: store.get("credits", 1420),
    user: store.get("user", null),
    liked: new Set(store.get("liked", [])),
    saved: new Set(store.get("saved", [])),
    security: store.get("security", { pin: null, pattern: null, bio: false, securePw: null }),
    tx: store.get("tx", PA.TX),
    timelines: store.get("timelines", []),
    owned: new Set(store.get("owned", [])),
    following: new Set(store.get("following", [])),
    settings: store.get("settings", { push: true, email: false, autoplay: true, hd: true, lowLatency: false, spectate: true, npcMemory: true }),
    promoClaimed: store.get("promoClaimed", false),
    stats: store.get("stats", { minutes: 1284, worlds: 37, forks: 6, injections: 52 }),
  };
  const save = (...keys) => keys.forEach((k) => {
    const v = state[k];
    store.set(k, v instanceof Set ? [...v] : v);
  });

  /* ---------- Formatters ---------- */
  const k = (n) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 1 : 1).replace(/\.0$/, "") + "k" : String(n));
  const num = (n) => Number(n).toLocaleString("en-US");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const now = () => {
    const d = new Date(), p = (x) => String(x).padStart(2, "0");
    return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  };
  const initials = (h = "?") => h.replace(/^@/, "").slice(0, 2).toUpperCase();
  const hue = (s = "") => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const avatar = (h, cls = "") => `<span class="avatar ${cls}" style="background:linear-gradient(135deg,hsl(${hue(h)} 70% 55%),hsl(${(hue(h) + 60) % 360} 70% 40%))">${initials(h)}</span>`;
  const gem = '<span class="gem"></span>';

  /* ---------- Media w/ fallback ---------- */
  function media(id, { live = false, cls = "", eager = false, style = "" } = {}) {
    const src = PA.IMG[id];
    const fb = PA.FALLBACK_ART[id];
    const game = PA.GAMES.find((g) => g.id === id);
    const bg = (fb && fb.bg) || (game && PA.GENRE_FALLBACK[game.genre]) || "";
    const st = (bg ? `--fallback:${bg};` : "") + style;
    return `<div class="media ${live ? "live" : ""} ${cls}"${st ? ` style="${st}"` : ""}>${
      src ? `<img src="${src}" alt="" ${eager ? "" : 'loading="lazy"'} onerror="this.classList.add('broken')">` : ""
    }${fb ? `<span class="fb-emoji">${fb.emoji}</span>` : ""}</div>`;
  }

  /* ---------- Logo (SVG recreation of the brand mark) ---------- */
  const logoMark = `
  <svg class="logo-mark" viewBox="0 0 120 70" aria-hidden="true">
    <g stroke-linecap="round">
      <line x1="10" y1="16" x2="52" y2="12" stroke="#fff" stroke-width="2.2"/>
      <line x1="2" y1="24" x2="52" y2="20" stroke="#22e4f5" stroke-width="1.8"/>
      <line x1="16" y1="30" x2="52" y2="28" stroke="#fff" stroke-width="1.4" opacity=".8"/>
      <line x1="6" y1="42" x2="52" y2="40" stroke="#fff" stroke-width="2"/>
      <line x1="14" y1="49" x2="52" y2="48" stroke="#22e4f5" stroke-width="1.6"/>
      <line x1="0" y1="58" x2="52" y2="56" stroke="#fff" stroke-width="2.4"/>
      <line x1="24" y1="64" x2="56" y2="62" stroke="#22e4f5" stroke-width="1.6"/>
    </g>
    <g fill="#fff"><rect x="36" y="22" width="3" height="3"/><rect x="42" y="33" width="2.5" height="2.5"/><rect x="30" y="36" width="2" height="2" fill="#22e4f5"/><rect x="44" y="18" width="2" height="2" fill="#22e4f5"/><rect x="38" y="52" width="2.5" height="2.5"/></g>
    <path d="M52 8 L66 4 L66 64 L52 60 Z" fill="#fff"/>
    <rect x="71" y="5" width="22" height="58" fill="none" stroke="#22e4f5" stroke-width="4"/>
    <line x1="66" y1="64" x2="104" y2="64" stroke="#22e4f5" stroke-width="3"/>
  </svg>`;
  const logoHTML = `${logoMark}<span class="logo-word"><b>Prompt</b><i>Arcade</i></span>`;
  $$("[data-logo]").forEach((el) => (el.innerHTML = logoHTML));

  /* ---------- Toast ---------- */
  function toast(msg, type = "ok") {
    const t = document.createElement("div");
    t.className = `toast ${type}`;
    t.textContent = msg;
    $("#toastRoot").appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 2600);
  }

  /* ---------- Modal ---------- */
  let modalStack = [];
  function modal(html, { cls = "", onClose, closable = true } = {}) {
    const back = document.createElement("div");
    back.className = "modal-back";
    back.innerHTML = `<div class="modal ${cls}" role="dialog" aria-modal="true">${closable ? '<button class="modal-close" aria-label="닫기">×</button>' : ""}${html}</div>`;
    $("#modalRoot").appendChild(back);
    document.body.classList.add("no-scroll");
    const m = { el: back.firstElementChild, back, close };
    function close() {
      back.remove();
      modalStack = modalStack.filter((x) => x !== m);
      if (!modalStack.length) document.body.classList.remove("no-scroll");
      onClose && onClose();
    }
    if (closable) {
      back.addEventListener("mousedown", (e) => { if (e.target === back) close(); });
      back.querySelector(".modal-close").onclick = close;
    }
    modalStack.push(m);
    const first = m.el.querySelector("input,button:not(.modal-close)");
    first && setTimeout(() => first.focus(), 50);
    return m;
  }
  /* replace content of an existing modal (multi-step flows) */
  function swap(m, html, cls) {
    const closeBtn = m.el.querySelector(".modal-close");
    m.el.innerHTML = html;
    if (closeBtn) m.el.prepend(closeBtn);
    if (cls !== undefined) m.el.className = `modal ${cls}`;
    m.el.style.animation = "none"; m.el.offsetHeight; m.el.style.animation = "";
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalStack.length) {
      const top = modalStack[modalStack.length - 1];
      if (top.el.querySelector(".modal-close")) top.close();
    }
  });

  /* ---------- Credits ---------- */
  function renderCredits() {
    $("#creditValue").textContent = num(state.credits);
  }
  function spend(amount, title, sub = "", icon = "🎮", kind = "use") {
    if (state.credits < amount) {
      toast(`크레딧이 부족합니다 (필요 ${amount} Cr)`, "warn");
      setTimeout(() => (location.hash = "#/pricing"), 600);
      return false;
    }
    state.credits -= amount;
    state.tx.unshift({ id: "t" + Date.now(), kind, title, sub, amt: -amount, date: now(), icon });
    afterCredit();
    return true;
  }
  function earn(amount, title, sub = "", icon = "＋") {
    state.credits += amount;
    state.tx.unshift({ id: "t" + Date.now(), kind: "in", title, sub, amt: +amount, date: now(), icon });
    afterCredit();
  }
  function afterCredit() {
    save("credits", "tx");
    renderCredits();
    const p = $("#creditPill");
    p.classList.remove("bump"); p.offsetWidth; p.classList.add("bump");
  }

  /* ---------- Auth slot ---------- */
  function renderAuth() {
    const slot = $("#authSlot");
    if (!state.user) {
      slot.innerHTML = `<button class="btn-login" data-action="login"><span class="t">Log in</span><span class="avatar"><svg viewBox="0 0 24 24" width="18" height="18" fill="#c9cfda"><circle cx="12" cy="9" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></span></button>`;
    } else {
      const u = state.user;
      slot.innerHTML = `
        <div class="user-menu">
          <button class="user-btn" data-action="toggle-menu">${avatar(u.handle)}<span class="t">@${esc(u.handle)}</span></button>
          <div class="dropdown">
            <a href="#/more/profile">내 정보</a>
            <a href="#/wallet">내 지갑</a>
            <a href="#/creator/${esc(u.handle)}">크리에이터 페이지</a>
            <a href="#/remix">내 세계선</a>
            <a href="#/more/security">인증 / 보안</a>
            <hr/>
            <button data-action="logout">로그아웃</button>
          </div>
        </div>`;
    }
  }

  /* ---------- Router ---------- */
  const routes = [];
  let cleanups = [];
  const route = (pattern, view, opts = {}) => routes.push({ re: new RegExp("^" + pattern.replace(/:(\w+)/g, "([^/?]+)") + "/?$"), view, ...opts });
  const onCleanup = (fn) => cleanups.push(fn);

  function parseHash() {
    const raw = location.hash.slice(1) || "/";
    const [pathRaw, qs] = raw.split("?");
    const path = pathRaw.split("#")[0] || "/";
    return { path, query: Object.fromEntries(new URLSearchParams(qs || "")) };
  }

  function render() {
    cleanups.forEach((fn) => { try { fn(); } catch {} });
    cleanups = [];
    const { path, query } = parseHash();
    let match = null, r;
    for (r of routes) { match = path.match(r.re); if (match) break; }
    if (!match) { r = routes[0]; match = ["/"]; }
    const app = $("#app");
    app.innerHTML = `<div class="view">${r.view(...match.slice(1).map(decodeURIComponent), query)}</div>`;
    r.mount && r.mount(app.firstElementChild, ...match.slice(1).map(decodeURIComponent), query);

    // nav state
    const sect = path.split("/")[1] || "home";
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === sect || (sect === "game" && a.dataset.nav === "explore")));
    $$("[data-tab]").forEach((a) => a.classList.toggle("active", a.dataset.tab === sect || (sect === "game" && a.dataset.tab === "explore") || (sect === "wallet" && a.dataset.tab === "more")));
    $("#trialBand").hidden = !(sect === "home" && !store.get("bandClosed", false));
    $$(".user-menu.open").forEach((m) => m.classList.remove("open"));
    if (!r.keepScroll) window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  /* ---------- Global delegated actions ---------- */
  const actions = {};
  const action = (name, fn) => (actions[name] = fn);
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) {
      if (!e.target.closest(".user-menu")) $$(".user-menu.open").forEach((m) => m.classList.remove("open"));
      return;
    }
    const fn = actions[el.dataset.action];
    if (fn) { e.preventDefault(); fn(el, e); }
  });
  action("toggle-menu", (el) => el.closest(".user-menu").classList.toggle("open"));
  action("close-band", () => { store.set("bandClosed", true); $("#trialBand").hidden = true; });

  window.addEventListener("scroll", () => $("#header").classList.toggle("scrolled", scrollY > 8), { passive: true });

  $("#headerSearch").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = e.target.querySelector("input").value.trim();
    location.hash = `#/explore${q ? "?q=" + encodeURIComponent(q) : ""}`;
  });

  Object.assign(PA, {
    $, $$, store, state, save, k, num, esc, now, avatar, gem, media, logoHTML,
    toast, modal, swap, spend, earn, renderCredits, renderAuth, route, render, onCleanup, action, parseHash,
  });
})();
