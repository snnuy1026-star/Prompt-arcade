/* =========================================================
   PromptArcade — Views (pages)
   Sitemap (Miro wireframe + IA):
   Home ─┬─ Explore (card grid) ─ Game detail ─ Play session
         ├─ Remix (fork graph)
         ├─ Market (asset store)
         ├─ Pricing ($3 / $9 / $23) ─ Checkout
         ├─ Support (search + FAQ)
         ├─ Creator profile
         ├─ Wallet (home-wallet: 알림 · 사용내역 · 보내기 · 입출금 · 플레이 통계)
         ├─ News (소식)
         └─ More (더보기: 내 정보 · 인증/보안 · 연동 앱 · 고객센터 · 설정 · 공지 · 버전)
   ========================================================= */
(() => {
  const { $, $$, state, save, store, k, num, esc, avatar, gem, media, route, onCleanup, action, toast, modal, swap, spend, earn, requireAuth, quickAuth, render } = PA;
  const G = (id) => PA.GAMES.find((g) => g.id === id);

  /* ---------- shared partials ---------- */
  const heart = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.7 5 21 8.3 19.5 11.8 17.5 16.4 12 21 12 21z"/></svg>';
  const playTri = '<svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>';
  const forkIco = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7M12 12v5"/></svg>';
  const bookmarkIco = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12v18l-6-4-6 4z"/></svg>';

  function gameCard(g) {
    return `
    <article class="game-card" data-genre="${esc(g.genre)}">
      <a href="#/game/${g.id}" aria-label="${esc(g.title)}">${media(g.id, { live: g.live })}</a>
      <div class="gc-top">${g.live ? '<span class="badge live">LIVE</span>' : "<span></span>"}<span class="viewers">👁 ${g.viewers}</span></div>
      <div class="gc-overlay" style="height:calc(100% - 92px)">
        <span class="genre-line">${esc(g.genre)} · ${g.cost} Cr / session</span>
        <div class="row">
          <button class="btn btn-primary" data-action="play" data-id="${g.id}">Play</button>
          <button class="icon-btn ${state.saved.has(g.id) ? "on" : ""}" data-action="save" data-id="${g.id}" aria-label="저장">${bookmarkIco}</button>
          <button class="icon-btn" data-action="fork" data-id="${g.id}" aria-label="포크">${forkIco}</button>
        </div>
      </div>
      <div class="gc-body">
        <a href="#/game/${g.id}" class="gc-title">${esc(g.title)}</a>
        <div class="gc-meta">
          <a href="#/creator/${g.creator}" style="display:flex;align-items:center;gap:8px">${avatar(g.creator)}@${g.creator}</a>
          <span class="badge ${g.badge === "AI" ? "ai" : "pro"}">${g.badge}</span>
          <span class="stats"><span>${heart} ${k(g.likes + (state.liked.has(g.id) ? 1 : 0))}</span><span>${playTri} ${k(g.plays)}</span></span>
        </div>
      </div>
    </article>`;
  }

  const footer = () => `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div><div data-logo="sm" class="logo">${PA.logoHTML}</div><p style="margin-top:14px;max-width:280px">모든 플레이어가 서로 다른 엔딩과 세계를 만나는 무한 생성형 아케이드.</p></div>
          <div><h5>Play</h5><ul><li><a href="#/explore">Explore</a></li><li><a href="#/remix">Remix</a></li><li><a href="#/news">News</a></li></ul></div>
          <div><h5>Create</h5><ul><li><a href="#/market">Market</a></li><li><a href="#/pricing">Pricing</a></li><li><a href="#/pricing#b2b">Indie Launchpad (SDK)</a></li></ul></div>
          <div><h5>Support</h5><ul><li><a href="#/support">고객센터</a></li><li><a href="#" data-action="policy" data-kind="terms">이용약관</a></li><li><a href="#" data-action="policy" data-kind="privacy">개인정보 처리방침</a></li></ul></div>
          <div><h5>Account</h5><ul><li><a href="#/wallet">Wallet</a></li><li><a href="#/more">더보기</a></li><li><a href="#" data-action="tutorial">튜토리얼 다시보기</a></li></ul></div>
        </div>
        <div class="footer-bottom"><span>© 2026 PromptArcade. The Infinite Canvas.</span><span>v2.6.0 · WebGPU</span></div>
      </div>
    </footer>`;

  /* ---------- shared card actions ---------- */
  action("save", (el) => {
    const id = el.dataset.id;
    state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id);
    save("saved");
    el.classList.toggle("on", state.saved.has(id));
    toast(state.saved.has(id) ? "보관함에 저장했어요" : "보관함에서 제거했어요");
  });
  action("like", (el) => {
    const id = el.dataset.id;
    state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
    save("liked");
    el.classList.toggle("on", state.liked.has(id));
  });
  action("fork", (el) => forkModal(el.dataset.id));

  function forkModal(id, fromLabel) {
    requireAuth(() => {
      const g = G(id) || PA.GAMES[0];
      const m = modal(`
        <h3>${forkIco} 세계선 포크</h3>
        <p class="lead"><b style="color:#fff">${esc(fromLabel || g.title)}</b>의 현재 World State를 복제해 나만의 브랜치를 만듭니다.</p>
        <form class="stack">
          <div><label class="field-label">브랜치 이름</label><input class="input" name="name" value="${esc(g.title)} — ${esc(state.user.handle)}'s cut" /></div>
          <div><label class="field-label">리믹스 프롬프트 (변경할 규칙)</label><textarea class="input" name="p" rows="3" style="resize:vertical;font-family:var(--mono);font-size:13px" placeholder="예: 모든 NPC가 고양이로 변하고, 비 대신 눈이 내린다"></textarea></div>
          <div class="card" style="padding:12px 14px;font-size:13px" ><div class="row-between"><span class="muted">포크 비용</span><span class="price">${gem}10 Cr</span></div><div class="row-between" style="margin-top:6px"><span class="muted">원작자 로열티</span><span>@${g.creator} · 수익의 30%</span></div></div>
          <label class="check"><input type="checkbox" name="pub" checked /> 다른 플레이어의 포크 허용</label>
          <button class="btn btn-primary btn-block btn-lg">포크 생성</button>
        </form>`);
      m.el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        if (!spend(10, `포크 — ${g.title}`, "World State 복제", "⑂")) return;
        const name = e.target.name.value.trim() || g.title + " fork";
        state.timelines.unshift({ id: "tl" + Date.now(), name, from: g.id, prompt: e.target.p.value, date: PA.now(), pub: e.target.pub.checked, plays: 0 });
        state.stats.forks++; save("timelines", "stats");
        swap(m, `<div style="text-align:center"><div style="font-size:56px">⑂</div><h3>포크 완료!</h3><p class="lead">“${esc(name)}” 브랜치가 생성되었습니다.</p><div style="display:flex;gap:10px"><a class="btn btn-ghost" style="flex:1" href="#/remix" data-close>내 세계선 보기</a><button class="btn btn-primary" style="flex:1" data-action="play" data-id="${g.id}">바로 플레이</button></div></div>`);
        $$("a,button", m.el).forEach((b) => b.addEventListener("click", () => m.close()));
      };
    });
  }

  /* =========================================================
     HOME (Landing)
     ========================================================= */
  route("/", () => {
    const trending = [...PA.GAMES].sort((a, b) => b.viewers - a.viewers).slice(0, 8);
    return `
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <h1 class="h1"><span class="cyan">Infinite Games</span>Created by AI<br/>For you.</h1>
          <p class="hero-sub">Endless worlds generated in real-time, instantly in your browser. 모든 플레이어가 서로 다른 엔딩과 세계를 만납니다.</p>
          <div class="hero-ctas">
            <button class="btn btn-primary btn-lg" data-action="get-started">Get Started</button>
            <button class="play-instant" data-action="play" data-id="neon-drift-city"><span class="tri"></span>Play Instantly (3s)</button>
          </div>
          <div class="hero-meta">
            <div><b data-count="12840">0</b><span>Live sessions</span></div>
            <div><b data-count="96300">0</b><span>Worlds forked</span></div>
            <div><b>3s</b><span>Avg. boot time</span></div>
          </div>
        </div>
        <div style="position:relative">
          <div class="live-card">
            <div class="live-card-inner">
              <div class="live-card-top"><span class="live-dot">Live Session #0492</span><button class="btn btn-ghost btn-sm" data-action="fork" data-id="neon-drift-city">${forkIco} Fork</button></div>
              <div style="position:relative">
                ${media("hero", { live: true, eager: true })}
                <div class="live-hud">
                  <div class="live-hud-top"><span class="hud-chip">@kairo · Neon Drift City</span><span class="hud-chip">👁 342</span></div>
                  <div class="inject-feed" id="heroFeed"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="timeline-chip">
            <div class="t-label">TIMELINE · branch/rain-runner</div>
            <div class="t-title">세계선 #0492 — 7 events · 3 forks</div>
            <div class="branch-mini"><span></span><i></i><span></span><i></i><span class="p"></span><i></i><span class="k"></span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="padding-top:20px">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Core Features</p><h2 class="h2">스팀과는 다른, 살아있는 게임</h2></div></div>
        <div class="carousel" id="featCarousel">
          <button class="icon-btn carousel-nav prev" data-c="-1" aria-label="이전">‹</button>
          <div class="carousel-track">
            ${PA.CORE_FEATURES.map((f) => `
              <div class="slide">
                <div class="slide-copy">
                  <span class="feature-icon">${f.icon}</span>
                  <p class="eyebrow" style="margin:0">${f.kr}</p>
                  <h3 class="h2">${f.title}</h3>
                  <p>${f.desc}</p>
                  <ul>${f.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
                </div>
                <div class="slide-visual">${media(f.img, { live: true })}</div>
              </div>`).join("")}
          </div>
          <button class="icon-btn carousel-nav next" data-c="1" aria-label="다음">›</button>
          <div class="carousel-dots">${PA.CORE_FEATURES.map((_, i) => `<button data-dot="${i}" class="${i ? "" : "active"}" aria-label="${i + 1}번 슬라이드"></button>`).join("")}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container journey">
        <div class="video-box" data-action="play" data-id="orbit-salvage">
          ${media("orbit-salvage", { live: true })}
          <span class="play-circle"></span>
          <span class="badge live" style="position:absolute;left:16px;top:16px;z-index:2">LIVE DEMO</span>
        </div>
        <div>
          <p class="eyebrow">User Journey</p>
          <h2 class="h2" style="margin-bottom:20px">탐색부터 공유까지, 단 4단계</h2>
          <div class="steps" id="steps">
            ${PA.JOURNEY.map((s, i) => `<div class="step ${i ? "" : "active"}" data-step="${i}"><span class="step-num">${s.n}</span><div><h4>${s.t}</h4><p>${s.d}</p></div></div>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Trending Now</p><h2 class="h2">지금 가장 많이 플레이되는 세계</h2></div><a href="#/explore" class="btn btn-ghost btn-sm">전체 보기 →</a></div>
        <div class="game-grid">${trending.map(gameCard).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container split-2">
        <div class="panel">
          <div class="panel-title"><span>📰 소식 <span class="badge hot">BREAKING</span></span><a href="#/news" class="link">더보기</a></div>
          <div class="news-list">${PA.NEWS.slice(0, 5).map((n) => `<a href="#/news?id=${n.id}" class="news-row"><span class="badge ${n.hot ? "new" : ""}">${n.cat}</span><span class="title">${esc(n.title)}</span><span class="date">${n.date.slice(5)}</span></a>`).join("")}</div>
        </div>
        <div class="panel">
          <div class="panel-title"><span>◈ 스토어 Featured</span><a href="#/market" class="link">마켓 가기</a></div>
          <div style="display:grid;gap:10px">${PA.ASSETS.slice(0, 4).map((a) => `
            <a href="#/market?item=${a.id}" class="fork-item" style="grid-template-columns:52px 1fr auto">
              <div class="asset-icon" style="height:52px;font-size:24px;background:${a.bg}">${a.icon}</div>
              <div><b>${esc(a.name)}</b><small>${a.type} · @${a.by}</small></div>
              <span class="price">${gem}${num(a.price)}</span>
            </a>`).join("")}</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><div><p class="eyebrow">Why PromptArcade</p><h2 class="h2">플레이어, 관전자, 크리에이터 모두를 위해</h2></div></div>
        <div class="feature-grid">
          <div class="feature"><div class="feature-icon">💠</div><h4>Compute Credit</h4><p>쓴 만큼만. 매월 무료 쿼터 제공, 고해상도·초저지연은 프리미엄 플랜으로.</p></div>
          <div class="feature"><div class="feature-icon">👑</div><h4>Creator Royalty</h4><p>내 시드가 포크될 때마다 컴퓨팅 수익의 일부가 자동 정산됩니다.</p></div>
          <div class="feature"><div class="feature-icon">🎙️</div><h4>Audience Bits</h4><p>관전자는 토큰으로 스트리머 세션에 보스와 날씨를 주입합니다.</p></div>
          <div class="feature"><div class="feature-icon">🧰</div><h4>Indie Launchpad</h4><p>서버 인프라, 실시간 AI API, 통합 빌링을 SDK Pass 하나로.</p></div>
        </div>
        <div class="cta-final">
          <p class="eyebrow">30-day risk-free</p>
          <h2 class="h2">지금, 당신만의 세계선을 시작하세요</h2>
          <p>가입 즉시 500 Cr 지급. 다운로드도, 설치도 필요 없습니다.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button class="btn btn-primary btn-lg" data-action="get-started">Get Started — Free</button><a href="#/pricing" class="btn btn-ghost btn-lg">요금제 보기</a></div>
        </div>
      </div>
    </section>
    ${footer()}`;
  }, {
    mount(app) {
      // count-up
      $$("[data-count]", app).forEach((el) => {
        const to = +el.dataset.count, t0 = performance.now();
        const step = (t) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = num(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
      // hero live injection feed
      const feed = $("#heroFeed", app);
      const evs = [["neo_fan", "⛈ Thunderstorm 주입"], ["byte", "👾 Boss: Chrome Hydra 소환"], ["luna", "🌙 Blood Moon 이벤트"], ["ghost88", "🚓 Corp Patrol 출동"], ["mika", "🎁 Supply Drop 투하"]];
      let i = 0;
      const push = () => {
        const [u, e] = evs[i++ % evs.length];
        const d = document.createElement("div"); d.className = "inject-item"; d.innerHTML = `<b>@${u}</b> ${e}`;
        feed.appendChild(d); if (feed.children.length > 3) feed.firstElementChild.remove();
      };
      push(); const t1 = setInterval(push, 2600); onCleanup(() => clearInterval(t1));
      // carousel
      const car = $("#featCarousel", app), slides = $$(".slide", car), dots = $$("[data-dot]", car);
      let cur = 0;
      const go = (n) => { cur = (n + slides.length) % slides.length; slides.forEach((s) => (s.style.transform = `translateX(-${cur * 100}%)`)); dots.forEach((d, j) => d.classList.toggle("active", j === cur)); };
      $$("[data-c]", car).forEach((b) => (b.onclick = () => { go(cur + +b.dataset.c); restart(); }));
      dots.forEach((d) => (d.onclick = () => { go(+d.dataset.dot); restart(); }));
      let t2; const restart = () => { clearInterval(t2); t2 = setInterval(() => go(cur + 1), 5500); };
      restart(); onCleanup(() => clearInterval(t2));
      // steps
      const steps = $$("[data-step]", app); let si = 0;
      const setStep = (n) => { si = n; steps.forEach((s, j) => s.classList.toggle("active", j === n)); };
      steps.forEach((s) => s.addEventListener("mouseenter", () => setStep(+s.dataset.step)));
      const t3 = setInterval(() => setStep((si + 1) % steps.length), 3500); onCleanup(() => clearInterval(t3));
    },
  });

  /* =========================================================
     EXPLORE
     ========================================================= */
  route("/explore", (q) => `
    <div class="container">
      <div class="filter-row">
        <select class="sort-select" id="sort" aria-label="정렬">
          <option value="trending">Trending</option><option value="new">Newest</option><option value="plays">Most Played</option><option value="rating">Top Rated</option>
        </select>
        <div class="genre-tabs" id="genres">${PA.GENRES.map((g) => `<button class="chip ${g === (q.g || "All") ? "active" : ""}" data-g="${esc(g)}">${esc(g)}</button>`).join("")}</div>
        <button class="btn btn-ghost btn-sm" id="filtersBtn"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg> Filters</button>
      </div>
      <div id="exploreInfo" class="muted" style="font-size:14px;margin:-6px 0 16px"></div>
      <div class="game-grid" id="grid"></div>
      <div class="load-more"><button class="btn btn-ghost" id="more">더 많은 세계 불러오기</button></div>
    </div>${footer()}`, {
    mount(app, q) {
      let genre = q.g || "All", sort = "trending", query = (q.q || "").toLowerCase(), liveOnly = false, maxCost = 50, extra = 0;
      const searchInput = $("#headerSearch input"); searchInput.value = q.q || "";
      const draw = () => {
        let list = PA.GAMES.filter((g) => (genre === "All" || g.genre === genre || g.tags.includes(genre)) && (!liveOnly || g.live) && g.cost <= maxCost && (!query || (g.title + g.creator + g.genre + g.tags.join(" ") + g.prompt).toLowerCase().includes(query)));
        const by = { trending: (a, b) => b.viewers - a.viewers, new: (a, b) => b.version.localeCompare(a.version) * -1 || a.plays - b.plays, plays: (a, b) => b.plays - a.plays, rating: (a, b) => b.rating - a.rating }[sort];
        list.sort(by);
        // "load more" generates remixed variants to simulate infinite generation
        const variants = [];
        for (let i = 0; i < extra; i++) list.forEach((g, j) => variants.push({ ...g, title: g.title + [" — Remix", ": Echoes", " II", ": Overdrive"][i % 4], creator: ["voxel", "nova", "tidal", "glitch_art", "synthia"][(i + j) % 5], viewers: Math.max(8, Math.round(g.viewers / (i + 2))), plays: Math.round(g.plays / (i + 2)), likes: Math.round(g.likes / (i + 2)) }));
        const all = list.concat(variants);
        $("#grid", app).innerHTML = all.length ? all.map(gameCard).join("") : `<div class="empty" style="grid-column:1/-1"><div style="font-size:48px">🌀</div><p>“${esc(query)}”에 해당하는 세계가 아직 없어요.</p><button class="btn btn-primary" style="margin-top:16px" data-action="get-started">프롬프트로 새 세계 만들기</button></div>`;
        $("#exploreInfo", app).innerHTML = `${query ? `“<b style="color:#fff">${esc(query)}</b>” 검색 결과 · ` : ""}${all.length}개의 세계 · <span class="live-dot">${all.filter((g) => g.live).reduce((s, g) => s + g.viewers, 0).toLocaleString()}명이 지금 플레이 중</span>`;
      };
      $$("[data-g]", app).forEach((b) => (b.onclick = () => { genre = b.dataset.g; $$("[data-g]", app).forEach((x) => x.classList.toggle("active", x === b)); extra = 0; draw(); }));
      $("#sort", app).onchange = (e) => { sort = e.target.value; draw(); };
      $("#more", app).onclick = (e) => {
        e.target.textContent = "새로운 세계를 생성하는 중…"; e.target.disabled = true;
        setTimeout(() => { extra = Math.min(extra + 1, 4); draw(); e.target.disabled = extra >= 4; e.target.textContent = extra >= 4 ? "모든 세계를 불러왔어요" : "더 많은 세계 불러오기"; }, 700);
      };
      $("#filtersBtn", app).onclick = () => {
        const m = modal(`
          <h3>Filters</h3><p class="lead">세계를 원하는 조건으로 좁혀보세요.</p>
          <div class="stack">
            <label class="list-item" style="border:0;padding:0;cursor:default"><span>라이브 세션만 보기<small>지금 플레이 중인 세계</small></span><span class="switch"><input type="checkbox" id="fLive" ${liveOnly ? "checked" : ""}/><span></span></span></label>
            <div><label class="field-label">최대 세션 비용: <b id="fCostV" style="color:#fff">${maxCost} Cr</b></label><input type="range" min="5" max="50" step="5" value="${maxCost}" id="fCost" style="width:100%;accent-color:var(--cyan)"/></div>
            <div style="display:flex;gap:10px"><button class="btn btn-ghost" style="flex:1" id="fReset">초기화</button><button class="btn btn-primary" style="flex:2" id="fApply">적용</button></div>
          </div>`);
        const c = m.el.querySelector("#fCost"); c.oninput = () => (m.el.querySelector("#fCostV").textContent = c.value + " Cr");
        m.el.querySelector("#fReset").onclick = () => { liveOnly = false; maxCost = 50; m.close(); draw(); };
        m.el.querySelector("#fApply").onclick = () => { liveOnly = m.el.querySelector("#fLive").checked; maxCost = +c.value; m.close(); draw(); };
      };
      draw();
      onCleanup(() => (searchInput.value = ""));
    },
  });

  /* =========================================================
     GAME DETAIL
     ========================================================= */
  route("/game/:id", (id) => {
    const g = G(id) || PA.GAMES[0];
    const shots = [g.id, ...PA.GAMES.filter((x) => x.genre === g.genre && x.id !== g.id).map((x) => x.id), "hero", "turbo-mirage", "phantom-carnival"].slice(0, 5);
    const forks = PA.FORKS.filter((f) => f.from === g.id);
    const remixes = (forks.length ? forks : PA.GAMES.filter((x) => x.id !== g.id).slice(0, 4).map((x) => ({ title: x.title + " Remix", by: x.creator, img: x.id, plays: Math.round(x.plays / 4) }))).slice(0, 4);
    return `
    <div class="container">
      <nav class="breadcrumb"><a href="#/explore">Explore</a><span>/</span><a href="#/explore?g=${encodeURIComponent(g.genre)}">${esc(g.genre)}</a><span>/</span><span>${esc(g.title)}</span></nav>
      <div class="detail-grid">
        <div>
          <div class="player-frame">
            <div class="player-top"><span class="live-dot">Live Session #0${(g.viewers * 7) % 900 + 100}</span><button class="btn btn-ghost btn-sm" data-action="fork" data-id="${g.id}">${forkIco} Fork</button></div>
            <div id="mainShot">${media(g.id, { live: true, eager: true })}</div>
          </div>
          <div class="thumbs">${shots.map((s, i) => `<button class="${i ? "" : "active"}" data-shot="${s}">${media(s)}</button>`).join("")}</div>
        </div>
        <div>
          <h1 class="detail-title">${esc(g.title)}</h1>
          <p class="detail-by">Generated by AI · Prompt by <a href="#/creator/${g.creator}">@${g.creator}</a></p>
          <div class="tag-row">${g.tags.map((t) => `<a class="chip" href="#/explore?g=${encodeURIComponent(t)}">${esc(t)}</a>`).join("")}</div>
          <div class="rating"><span class="star">★</span><b>${g.rating}</b><span class="muted">·</span><span>${k(g.plays)} plays</span><span class="muted">·</span><span class="live-dot">${g.viewers} live</span></div>
          <div class="cta-row">
            <button class="btn btn-primary btn-lg" data-action="play" data-id="${g.id}">Play Now</button>
            <button class="btn btn-outline btn-lg" data-action="fork" data-id="${g.id}">Remix this World</button>
            <span class="cost">${gem} ${g.cost} Cr / session</span>
          </div>
          <p class="muted" style="margin-top:18px;font-size:15px">${esc(g.desc)}</p>
          <div class="prompt-card">
            <div class="row-between"><b>Original Prompt</b><button class="btn btn-text btn-sm" id="copyPrompt">복사</button></div>
            <pre>${esc(g.prompt)}</pre>
            <div class="stat-pills"><span class="stat-pill">Gen time<b>${g.gen}s</b></span><span class="stat-pill">Forks<b>${g.forks}</b></span><span class="stat-pill">Version<b>${g.version}</b></span></div>
          </div>
          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="icon-btn ${state.liked.has(g.id) ? "on" : ""}" data-action="like" data-id="${g.id}" aria-label="좋아요">${heart}</button>
            <button class="icon-btn ${state.saved.has(g.id) ? "on" : ""}" data-action="save" data-id="${g.id}" aria-label="저장">${bookmarkIco}</button>
            <button class="btn btn-ghost btn-sm" id="shareBtn">공유하기</button>
          </div>
        </div>
      </div>

      ${g.npcs.length ? `
      <section class="section" style="padding-top:56px">
        <div class="section-head"><div><p class="eyebrow">Persistent Neural NPCs</p><h2 class="h2" style="font-size:24px">이 세계에 살고 있는 NPC</h2></div><span class="muted" style="font-size:13px">오프라인 중에도 관계가 변합니다</span></div>
        <div class="npc-row">${g.npcs.map((n) => `
          <div class="npc"><div class="npc-head"><span class="avatar md" style="background:var(--surface-3);font-size:22px">${n.emoji}</span><div><b>${n.name}</b><div class="muted" style="font-size:12px">${n.role}</div></div><span class="npc-status" style="margin-left:auto">● online</span></div>
          <p>현재 감정: <b style="color:var(--pink)">${n.mood}</b></p><div class="row-between" style="font-size:12px;margin-top:8px" ><span class="muted">플레이어 신뢰도</span><span>${n.trust}%</span></div><div class="meter"><i style="width:${n.trust}%"></i></div></div>`).join("")}
        </div>
      </section>` : ""}

      <section class="section" style="padding-top:48px">
        <div class="section-head"><h2 class="h2" style="font-size:24px">Remixes of this world</h2><a href="#/remix" class="link">Fork graph 보기 →</a></div>
        <div class="remix-row">${remixes.map((r) => `
          <a href="#/remix" class="remix-card">${media(r.img)}<div><b>${esc(r.title)}</b><span>@${r.by}</span><span>${k(r.plays)} plays</span></div></a>`).join("")}
        </div>
      </section>
    </div>${footer()}`;
  }, {
    mount(app, id) {
      const g = G(id) || PA.GAMES[0];
      $$("[data-shot]", app).forEach((b) => (b.onclick = () => {
        $$("[data-shot]", app).forEach((x) => x.classList.toggle("active", x === b));
        $("#mainShot", app).innerHTML = media(b.dataset.shot, { live: true });
      }));
      $("#copyPrompt", app).onclick = () => { navigator.clipboard && navigator.clipboard.writeText(g.prompt); toast("프롬프트를 복사했어요"); };
      $("#shareBtn", app).onclick = () => { navigator.clipboard && navigator.clipboard.writeText(location.href); toast("링크가 복사되었습니다"); };
    },
  });

  /* =========================================================
     PLAY SESSION (Dynamic interaction + Live Prompt Injection + NPC)
     ========================================================= */
  route("/play/:id", (id) => {
    const g = G(id) || PA.GAMES[0];
    const npcs = g.npcs.length ? g.npcs : PA.GAMES[0].npcs;
    return `
    <div class="container">
      <div class="play-wrap">
        <div>
          <div class="row-between" style="margin-bottom:12px;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:12px"><a href="#/game/${g.id}" class="icon-btn" aria-label="뒤로">‹</a><div><b style="font-size:18px">${esc(g.title)}</b><div class="muted" style="font-size:12px;font-family:var(--mono)">session · seoul-2 · 21ms · WebGPU</div></div></div>
            <div style="display:flex;gap:8px"><span class="chip"><span class="live-dot">LIVE</span>&nbsp;<span id="viewerCount">${g.viewers}</span> watching</span><span class="chip" id="sessCost">${gem} 0 Cr</span><button class="btn btn-danger btn-sm" id="endBtn">세션 종료</button></div>
          </div>
          <div class="stage" id="stage">
            ${media(g.id === "neon-drift-city" ? "hero" : g.id, { eager: true })}
            <div class="stage-tint" id="tint"></div>
            <div class="stage-weather" id="weather"></div>
            <div class="stage-hud">
              <div class="row">
                <div class="hp"><span class="hud-chip">HP 86 / 100</span><div class="bar"><i id="hpBar" style="width:86%"></i></div></div>
                <div style="display:flex;gap:6px;flex-direction:column;align-items:flex-end"><span class="hud-chip" id="clock">00:00</span><span class="hud-chip" id="worldState">World seed #A7F3 · Calm</span></div>
              </div>
              <div class="dialogue" id="dialogue"><div class="who"><span>${npcs[0].emoji} ${npcs[0].name}</span><em>${npcs[0].mood}</em></div><p id="dlgText">…또 왔군. 지난번에 네가 골목에 남긴 흔적, 아직 다들 기억하고 있어.</p></div>
            </div>
          </div>
          <form class="input-bar" id="actForm">
            <div class="field"><span class="muted" style="font-family:var(--mono);font-size:13px">&gt;</span><input id="actInput" placeholder="무엇을 할까요? 예: 네온 간판 뒤 비밀 통로를 찾는다" autocomplete="off" /><button type="button" class="icon-btn mic" id="micBtn" aria-label="음성 입력">🎙</button></div>
            <button class="btn btn-primary">Act</button>
          </form>
          <div class="timeline-bar">
            <span class="muted" style="font-size:12px;font-family:var(--mono);white-space:nowrap">TIMELINE</span>
            <div class="tl-track" id="tlTrack"><span class="tl-node" data-tip="Session start"></span></div>
            <button class="btn btn-ghost btn-sm" data-action="fork" data-id="${g.id}">${forkIco} Fork</button>
            <button class="btn btn-outline btn-sm" id="publishBtn">세계선 발행</button>
          </div>
        </div>
        <aside class="side">
          <div class="tabs"><button class="active" data-tab2="chat">Live Chat</button><button data-tab2="inject">⚡ Inject</button><button data-tab2="npc">🧠 NPC</button></div>
          <div class="side-body" id="sideBody"></div>
          <div class="side-foot" id="sideFoot"></div>
        </aside>
      </div>
    </div>`;
  }, {
    mount(app, id) {
      const g = G(id) || PA.GAMES[0];
      const npcs = (g.npcs.length ? g.npcs : PA.GAMES[0].npcs).map((n) => ({ ...n, log: [] }));
      let tab = "chat", spent = 0, secs = 0, npcSel = 0, events = [];
      const chat = [{ sys: true, t: `${g.title} 세션에 오신 것을 환영합니다. 관전자들이 지켜보고 있어요.` }];
      if (spend(g.cost, `${g.title} 세션`, "GPU 추론 · 세션 시작", "🎮")) { spent += g.cost; }
      const stage = $("#stage", app), body = $("#sideBody", app), foot = $("#sideFoot", app);
      const costEl = $("#sessCost", app);
      const addCost = (n) => { spent += n; costEl.innerHTML = `${gem} ${spent} Cr`; };
      addCost(0);

      const clock = setInterval(() => {
        secs++;
        $("#clock", app).textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
        if (secs % 3 === 0) $("#viewerCount", app).textContent = g.viewers + Math.round(Math.sin(secs / 7) * 12 + secs / 10);
      }, 1000);
      onCleanup(() => clearInterval(clock));

      const tlNode = (tip, inj) => { const n = document.createElement("span"); n.className = "tl-node" + (inj ? " inj" : ""); n.dataset.tip = tip; $("#tlTrack", app).appendChild(n); events.push(tip); if ($("#tlTrack", app).children.length > 14) $("#tlTrack", app).children[1].remove(); };
      const say = (who, mood, text) => {
        $("#dialogue", app).innerHTML = `<div class="who"><span>${who}</span><em>${mood}</em></div><p>${esc(text)}</p>`;
      };
      const banner = (txt) => { const b = document.createElement("div"); b.className = "event-banner"; b.textContent = txt; stage.appendChild(b); setTimeout(() => b.remove(), 3300); };
      const setWorld = (s) => ($("#worldState", app).textContent = `World seed #A7F3 · ${s}`);

      /* ---- Injection effects ---- */
      const INJ = [
        { k: "boss", t: "👾 Spawn Boss", c: 40, d: "보스 몬스터 소환" },
        { k: "rain", t: "🌧 Acid Rain", c: 15, d: "산성비 날씨" },
        { k: "storm", t: "⛈ Thunderstorm", c: 20, d: "번개 폭풍" },
        { k: "moon", t: "🌕 Blood Moon", c: 25, d: "붉은 달 이벤트" },
        { k: "drop", t: "🎁 Supply Drop", c: 10, d: "보급품 투하" },
        { k: "clear", t: "☀ Clear Sky", c: 5, d: "효과 초기화" },
      ];
      function applyInjection(kind, by, custom) {
        const weather = $("#weather", app), tint = $("#tint", app);
        const label = custom ? `✨ ${custom}` : INJ.find((x) => x.k === kind).t;
        if (kind === "boss") { $$(".boss", stage).forEach((x) => x.remove()); const b = document.createElement("div"); b.className = "boss"; b.textContent = ["👾", "🐉", "🦑", "🤖"][Math.floor(Math.random() * 4)]; stage.appendChild(b); setWorld("Boss Encounter"); const hp = $("#hpBar", app); hp.style.width = "62%"; }
        if (kind === "rain") { weather.className = "stage-weather rain"; setWorld("Acid Rain"); }
        if (kind === "storm") { weather.className = "stage-weather rain storm"; setWorld("Thunderstorm"); }
        if (kind === "moon") { tint.style.background = "rgba(255,40,60,.35)"; setWorld("Blood Moon"); }
        if (kind === "drop") { setWorld("Supply Drop"); $("#hpBar", app).style.width = "100%"; }
        if (kind === "clear") { weather.className = "stage-weather"; tint.style.background = "transparent"; $$(".boss", stage).forEach((x) => x.remove()); setWorld("Calm"); }
        if (kind === "custom") { tint.style.background = `hsla(${Math.random() * 360},80%,50%,.25)`; setWorld("Mutated"); }
        banner(`${label} — by @${by}`);
        tlNode(`${label} (@${by})`, true);
        chat.push({ inject: true, u: by, t: `${label} 를 주입했습니다` });
        state.stats.injections++; save("stats");
        if (tab === "chat") drawSide();
      }

      /* ---- spectator chat sim ---- */
      const chatTimer = setInterval(() => {
        const [u, t] = PA.CHAT_POOL[Math.floor(Math.random() * PA.CHAT_POOL.length)];
        chat.push({ u, t });
        if (Math.random() < 0.12) { const inj = INJ[Math.floor(Math.random() * 4)]; applyInjection(inj.k, u); return; }
        if (tab === "chat") drawSide();
      }, 2400);
      onCleanup(() => clearInterval(chatTimer));

      function drawSide() {
        if (tab === "chat") {
          body.innerHTML = chat.slice(-60).map((m) => m.sys ? `<div class="chat-msg sys">${esc(m.t)}</div>` : `<div class="chat-msg ${m.inject ? "inject" : ""}"><b>${m.inject ? "⚡ " : ""}${esc(m.u)}</b>${esc(m.t)}</div>`).join("");
          body.scrollTop = body.scrollHeight;
          foot.innerHTML = `<form class="mini-input" id="chatForm"><input placeholder="채팅 보내기…" /><button class="btn btn-primary btn-sm">전송</button></form>`;
          $("#chatForm", foot).onsubmit = (e) => { e.preventDefault(); const v = e.target.querySelector("input").value.trim(); if (!v) return; chat.push({ u: state.user ? state.user.handle : "guest", t: v }); drawSide(); };
        }
        if (tab === "inject") {
          body.innerHTML = `
            <p class="muted" style="font-size:12px">관전자 마이크로 트랜잭션 — Audience Action Bits로 세션에 실시간 이벤트를 주입합니다.</p>
            <div class="inject-grid">${INJ.map((x) => `<button class="inject-btn" data-inj="${x.k}">${x.t}<small>${x.d} · ${x.c} Cr</small></button>`).join("")}</div>
            <div class="panel" style="padding:14px"><div style="font-size:13px;font-weight:600;margin-bottom:8px">커스텀 프롬프트 인젝션 · 30 Cr</div><form class="mini-input" id="customInj"><input placeholder="예: 거대한 고래가 하늘을 헤엄친다" /><button class="btn btn-primary btn-sm">주입</button></form><p class="muted" style="font-size:11px;margin-top:8px">유해 프롬프트는 자동 필터링됩니다.</p></div>
            <div style="font-size:12px" class="muted">최근 인젝션</div>
            ${events.filter((e) => e.includes("@")).slice(-5).reverse().map((e) => `<div class="chat-msg inject">${esc(e)}</div>`).join("") || '<div class="chat-msg sys">아직 주입된 이벤트가 없어요</div>'}`;
          foot.innerHTML = `<div class="row-between" style="font-size:13px"><span class="muted">보유 크레딧</span><span class="price">${gem}${num(state.credits)}</span></div>`;
          $$("[data-inj]", body).forEach((b) => (b.onclick = () => {
            const x = INJ.find((i) => i.k === b.dataset.inj);
            if (!spend(x.c, `Prompt Injection — ${x.t}`, g.title, "⚡")) return;
            addCost(x.c); applyInjection(x.k, state.user ? state.user.handle : "guest"); tab = "inject"; drawSide();
          }));
          $("#customInj", body).onsubmit = (e) => {
            e.preventDefault(); const v = e.target.querySelector("input").value.trim(); if (!v) return;
            if (/kill|죽|폭력|nsfw/i.test(v)) return toast("커뮤니티 가이드라인에 의해 차단된 프롬프트입니다", "warn");
            if (!spend(30, "Custom Prompt Injection", v.slice(0, 24), "⚡")) return;
            addCost(30); applyInjection("custom", state.user ? state.user.handle : "guest", v); drawSide();
          };
        }
        if (tab === "npc") {
          const n = npcs[npcSel];
          body.innerHTML = `
            <div style="display:flex;gap:6px;flex-wrap:wrap">${npcs.map((x, i) => `<button class="chip ${i === npcSel ? "active" : ""}" data-npc="${i}">${x.emoji} ${x.name}</button>`).join("")}</div>
            <div class="panel" style="padding:12px"><div class="row-between" style="font-size:12px"><span>${n.role} · 감정 <b style="color:var(--pink)">${n.mood}</b></span><span>신뢰 ${n.trust}%</span></div><div class="meter"><i style="width:${n.trust}%"></i></div></div>
            ${n.log.map((m) => `<div class="npc-msg ${m.me ? "me" : ""}">${m.me ? "" : `<span class="avatar" style="background:var(--surface-3)">${n.emoji}</span>`}<div><div class="bubble">${esc(m.t)}</div>${m.emo ? `<div class="emotion">emotion: ${m.emo}</div>` : ""}</div></div>`).join("") || `<div class="chat-msg sys">${n.name}에게 말을 걸어보세요. 응답은 실시간 감정 추론 모델로 생성됩니다.</div>`}`;
          body.scrollTop = body.scrollHeight;
          foot.innerHTML = `<form class="mini-input" id="npcForm"><input placeholder="${n.name}에게 말하기…" /><button class="btn btn-primary btn-sm">전송</button></form>`;
          $$("[data-npc]", body).forEach((b) => (b.onclick = () => { npcSel = +b.dataset.npc; drawSide(); }));
          $("#npcForm", foot).onsubmit = (e) => {
            e.preventDefault(); const v = e.target.querySelector("input").value.trim(); if (!v) return;
            n.log.push({ me: true, t: v }); drawSide();
            const ty = document.createElement("div"); ty.className = "npc-msg"; ty.innerHTML = `<span class="avatar" style="background:var(--surface-3)">${n.emoji}</span><div class="bubble typing"><span></span><span></span><span></span></div>`; body.appendChild(ty); body.scrollTop = body.scrollHeight;
            setTimeout(() => {
              const r = npcReply(n, v);
              n.trust = Math.max(0, Math.min(100, n.trust + r.d)); n.mood = r.mood;
              n.log.push({ t: r.t, emo: `${r.mood} (${r.d >= 0 ? "+" : ""}${r.d} trust)` });
              say(`${n.emoji} ${n.name}`, r.mood, r.t);
              tlNode(`${n.name}: ${r.mood}`);
              if (tab === "npc") drawSide();
            }, 900 + Math.random() * 700);
          };
        }
      }
      $$("[data-tab2]", app).forEach((b) => (b.onclick = () => { tab = b.dataset.tab2; $$("[data-tab2]", app).forEach((x) => x.classList.toggle("active", x === b)); drawSide(); }));
      drawSide();

      /* ---- player action (dynamic interaction) ---- */
      const CONSEQ = [
        ["세계가 재구성됩니다", "골목의 구조가 바뀌고 새로운 통로가 생성되었습니다."],
        ["NPC 세력 변화", "정보상 세력이 당신의 행동을 눈치챘습니다. 평판 +8."],
        ["새 퀘스트 생성", "‘사라진 데이터 칩’ 퀘스트가 즉석에서 생성되었습니다."],
        ["룰 변이", "이 구역에서는 이제 중력이 30% 약해집니다."],
        ["기억 저장", "주변 NPC들이 이 순간을 장기 기억에 기록했습니다."],
      ];
      $("#actForm", app).onsubmit = (e) => {
        e.preventDefault();
        const inp = $("#actInput", app), v = inp.value.trim(); if (!v) return;
        inp.value = "";
        say("🌐 WORLD", "generating…", `“${v}” — 세계가 당신의 행동을 해석하는 중…`);
        setTimeout(() => {
          const [h, d] = CONSEQ[Math.floor(Math.random() * CONSEQ.length)];
          say("🌐 WORLD", h, d);
          banner(h);
          tlNode(`You: ${v.slice(0, 24)}`);
          addCost(1); state.credits = Math.max(0, state.credits - 1); save("credits"); PA.renderCredits();
        }, 900);
      };
      const mic = $("#micBtn", app);
      mic.onclick = () => {
        if (mic.classList.contains("rec")) return;
        mic.classList.add("rec"); toast("음성 인식 중… (데모)");
        setTimeout(() => { mic.classList.remove("rec"); $("#actInput", app).value = "옥상으로 올라가서 도시 전체를 내려다본다"; $("#actInput", app).focus(); }, 1800);
      };

      /* ---- publish & end ---- */
      const publish = () => requireAuth(() => quickAuth(() => {
        const link = `https://promptarcade.gg/t/${g.id.slice(0, 4)}-${Date.now().toString(36)}`;
        const m = modal(`
          <h3>세계선(Timeline) 발행</h3><p class="lead">이 세션의 World State를 고유 링크로 발행합니다.</p>
          <div class="stack">
            <div><label class="field-label">제목</label><input class="input" id="tlName" value="${esc(g.title)} — ${esc(state.user.handle)}의 세계선" /></div>
            <div class="seg" id="vis" style="margin:0"><button class="active" data-v="public">공개</button><button data-v="link">링크 공유</button><button data-v="private">비공개</button></div>
            <label class="check"><input type="checkbox" id="allowFork" checked /> 포크 허용 (원작자 로열티 자동 정산)</label>
            <div class="card" style="padding:12px;font-size:13px"><b>${events.length}</b>개의 이벤트 · ${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")} 플레이</div>
            <button class="btn btn-primary btn-block btn-lg" id="doPub">발행하기</button>
          </div>`);
        let vis = "public";
        $$("[data-v]", m.el).forEach((b) => (b.onclick = () => { vis = b.dataset.v; $$("[data-v]", m.el).forEach((x) => x.classList.toggle("active", x === b)); }));
        $("#doPub", m.el).onclick = () => {
          const name = $("#tlName", m.el).value;
          state.timelines.unshift({ id: "tl" + Date.now(), name, from: g.id, date: PA.now(), pub: $("#allowFork", m.el).checked, vis, events: events.length, link, plays: 0 });
          save("timelines");
          swap(m, `<div style="text-align:center"><div style="font-size:56px">🌐</div><h3>발행 완료!</h3><p class="lead">커뮤니티에 공유해보세요.</p><div class="mini-input"><input class="input" value="${link}" readonly /><button class="btn btn-primary btn-sm" id="cp">복사</button></div><a href="#/remix" class="btn btn-ghost btn-block" style="margin-top:14px" id="go">내 세계선 보기</a></div>`);
          $("#cp", m.el).onclick = () => { navigator.clipboard && navigator.clipboard.writeText(link); toast("링크 복사 완료"); };
          $("#go", m.el).onclick = () => m.close();
        };
      }, "세계선 발행 인증"));
      $("#publishBtn", app).onclick = publish;
      $("#endBtn", app).onclick = () => {
        state.stats.minutes += Math.max(1, Math.round(secs / 60)); state.stats.worlds++; save("stats");
        const m = modal(`
          <h3>세션 요약</h3><p class="lead">${esc(g.title)} · 이 세계선은 오직 당신만의 것입니다.</p>
          <div class="stat-grid" style="margin-bottom:18px">
            <div class="stat-box"><span>플레이 시간</span><b>${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}</b></div>
            <div class="stat-box"><span>사용 크레딧</span><b>${spent} Cr</b></div>
            <div class="stat-box"><span>세계 이벤트</span><b>${events.length}</b></div>
            <div class="stat-box"><span>NPC 대화</span><b>${npcs.reduce((s, n) => s + n.log.filter((l) => l.me).length, 0)}</b></div>
          </div>
          <div style="display:flex;gap:10px"><a href="#/explore" class="btn btn-ghost" style="flex:1" id="ex">나가기</a><button class="btn btn-primary" style="flex:1" id="pb">세계선 발행</button></div>`);
        $("#ex", m.el).onclick = () => m.close();
        $("#pb", m.el).onclick = () => { m.close(); publish(); };
      };
    },
  });

  function npcReply(n, text) {
    const t = text.toLowerCase();
    const pos = /(고마|도와|친구|선물|미안|좋아|help|thank|gift|friend)/.test(t);
    const neg = /(죽|싫|바보|위협|훔|kill|hate|steal|threat)/.test(t);
    const ask = /(\?|어디|누구|뭐|왜|비밀|where|who|what|why|secret)/.test(t);
    if (neg) return { mood: "Hostile", d: -12, t: [`그 말, 똑똑히 기억해두지. ${n.name}의 사람들은 잊지 않아.`, "선을 넘는군. 다음엔 이렇게 친절하지 않을 거야.", "흥, 협박이라면 상대를 잘못 골랐어."][Math.floor(Math.random() * 3)] };
    if (pos) return { mood: "Warm", d: +9, t: ["…의외군. 좋아, 네 편이 되어주지. 이번만이야.", "고맙다. 이 빚은 꼭 갚겠어. 내 사람들에게도 말해둘게.", "네가 떠난 동안 다들 네 얘기를 하더라. 좋은 쪽으로."][Math.floor(Math.random() * 3)] };
    if (ask) return { mood: "Curious", d: +3, t: ["궁금한 게 많군. 동쪽 시장의 세 번째 간판 뒤를 찾아봐.", "그건 쉽게 알려줄 수 없어. 하지만 네가 어제 한 선택이 실마리야.", "비밀이라… 다른 NPC들과 얘기해보면 조각이 맞춰질 거다."][Math.floor(Math.random() * 3)] };
    return { mood: ["Thoughtful", "Amused", "Suspicious"][Math.floor(Math.random() * 3)], d: Math.round(Math.random() * 4 - 1), t: [`“${text.slice(0, 20)}”… 흥미롭군. 지난번 네 행동과는 다른데?`, "그렇게 말하는 플레이어는 네가 처음이야. 기록해두지.", "세계가 조금 바뀐 것 같지 않아? 다 너 때문이야."][Math.floor(Math.random() * 3)] };
  }

  /* =========================================================
     REMIX (Fork graph)
     ========================================================= */
  const GRAPH = [
    { id: "root", label: "Genesis v1.0", by: "kairo", x: 60, y: 160, img: "neon-drift-city", plays: 4200, change: "Initial prompt seed", c: "#22e4f5" },
    { id: "m2", p: "root", label: "v1.1 Weather AI", by: "kairo", x: 210, y: 160, img: "hero", plays: 3100, change: "+ Dynamic weather tied to city mood", c: "#22e4f5" },
    { id: "m3", p: "m2", label: "v1.2 Factions", by: "kairo", x: 380, y: 160, img: "neon-drift-city", plays: 5300, change: "+ NPC faction system", c: "#22e4f5" },
    { id: "m4", p: "m3", label: "v1.3 Current", by: "kairo", x: 560, y: 160, img: "hero", plays: 12400, change: "+ Rooftop districts, + Neural NPC memory", c: "#22e4f5" },
    { id: "f2", p: "m2", label: "Rain Runner", by: "cyberdev", x: 380, y: 60, img: "hero", plays: 1800, change: "+ Parkour rules\n- Vehicles", c: "#a96bff" },
    { id: "f2b", p: "f2", label: "Rooftop Runner", by: "skyline", x: 560, y: 40, img: "neon-drift-city", plays: 640, change: "+ Wall-run combos", c: "#ff4fd8" },
    { id: "f1", p: "m3", label: "Neon Drift 2099", by: "voxel", x: 560, y: 270, img: "neon-drift-city", plays: 3200, change: "+ Acid rain weather\n+ Corporate faction", c: "#a96bff" },
    { id: "f1b", p: "f1", label: "2099: Corp Wars", by: "nova", x: 740, y: 290, img: "iron-titans", plays: 910, change: "+ Mech patrols\n+ Territory control", c: "#ff4fd8" },
    { id: "f3", p: "m4", label: "Synth Alley", by: "synthia", x: 740, y: 110, img: "turbo-mirage", plays: 950, change: "+ Rhythm combat", c: "#a96bff" },
    { id: "f4", p: "m4", label: "Cyber District", by: "glitch_art", x: 740, y: 200, img: "phantom-carnival", plays: 2100, change: "+ Night market economy", c: "#a96bff" },
  ];
  route("/remix", () => {
    const edges = GRAPH.filter((n) => n.p).map((n) => {
      const p = GRAPH.find((x) => x.id === n.p);
      const mx = (p.x + n.x) / 2;
      return `<path d="M${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${n.y}, ${n.x} ${n.y}" fill="none" stroke="${n.c}" stroke-width="2.5" opacity=".7"/>`;
    }).join("");
    const nodes = GRAPH.map((n) => `<g class="graph-node" data-node="${n.id}" tabindex="0"><circle cx="${n.x}" cy="${n.y}" r="16" fill="${n.c}" opacity=".15"/><circle class="dot" cx="${n.x}" cy="${n.y}" r="7" fill="${n.c}"/><text x="${n.x}" y="${n.y - 22}" text-anchor="middle">${esc(n.label)}</text><text class="sub" x="${n.x}" y="${n.y + 30}" text-anchor="middle">@${n.by}</text></g>`).join("");
    return `
    <div class="container">
      <div class="page-head"><p class="eyebrow">Fork &amp; Remix</p><h1 class="h2">세계선(Timeline)은 브랜치처럼 갈라집니다</h1><p>깃허브의 브랜치 개념처럼, 플레이 중 만들어진 World State를 포크해 이어받거나 변형하세요. 원작자에게는 로열티가 자동 정산됩니다.</p></div>
      <div class="remix-layout">
        <div>
          <div class="graph-wrap">
            <div class="row-between" style="margin-bottom:10px"><b>Neon Drift City · fork graph</b><span class="muted" style="font-size:12px"><span style="color:var(--cyan)">●</span> main &nbsp;<span style="color:var(--purple)">●</span> fork &nbsp;<span style="color:var(--pink)">●</span> sub-fork</span></div>
            <svg viewBox="0 0 800 330">${edges}${nodes}</svg>
          </div>
          <div class="section-head" style="margin-top:36px"><h2 class="h3">내 세계선</h2>${state.user ? "" : '<button class="btn btn-ghost btn-sm" data-action="login">로그인하고 보기</button>'}</div>
          <div class="fork-list">${state.user && state.timelines.length ? state.timelines.map((t) => `
            <div class="fork-item">${media(t.from)}<div><b>${esc(t.name)}</b><small>${t.date} · ${t.vis || "public"} · ${t.pub ? "fork 허용" : "fork 비허용"}${t.events ? ` · ${t.events} events` : ""}</small></div><button class="btn btn-ghost btn-sm" data-action="play" data-id="${t.from}">이어하기</button></div>`).join("")
            : `<div class="panel muted" style="text-align:center;font-size:14px">아직 발행하거나 포크한 세계선이 없어요. <a class="link" href="#/explore">세계를 탐색</a>하고 첫 포크를 만들어보세요.</div>`}
          </div>
        </div>
        <aside>
          <div class="panel" id="nodePanel" style="position:sticky;top:calc(var(--header-h) + 20px)"></div>
        </aside>
      </div>
      <section class="section" style="padding-top:48px">
        <div class="section-head"><h2 class="h3">Trending forks</h2></div>
        <div class="remix-row">${PA.FORKS.map((f) => `<a class="remix-card" href="#/game/${f.from}">${media(f.img)}<div><b>${esc(f.title)}</b><span>@${f.by} · from ${esc(G(f.from).title)}</span><span>${k(f.plays)} plays</span></div></a>`).join("")}</div>
      </section>
    </div>${footer()}`;
  }, {
    mount(app) {
      const panel = $("#nodePanel", app);
      const show = (id) => {
        const n = GRAPH.find((x) => x.id === id);
        $$("[data-node] .dot", app).forEach((d) => d.setAttribute("r", d.parentNode.dataset.node === id ? 10 : 7));
        panel.innerHTML = `
          ${media(n.img, { live: true, style: "aspect-ratio:16/10;border-radius:10px;margin-bottom:14px" })}
          <div class="row-between"><b style="font-size:18px">${esc(n.label)}</b><span class="badge" style="background:${n.c}22;color:${n.c}">${n.id.startsWith("m") || n.id === "root" ? "main" : "fork"}</span></div>
          <p class="muted" style="font-size:13px;margin:4px 0 14px">@${n.by} · ${k(n.plays)} plays</p>
          <div class="diff">${n.change.split("\n").map((l) => `<div class="${l.startsWith("+") ? "add" : l.startsWith("-") ? "del" : "ctx"}">${esc(l)}</div>`).join("")}</div>
          <div style="display:flex;gap:8px;margin-top:14px"><button class="btn btn-primary" style="flex:1" data-action="play" data-id="neon-drift-city">Play</button><button class="btn btn-outline" style="flex:1" id="forkNode">${forkIco} Fork</button></div>`;
        $("#forkNode", panel).onclick = () => forkModal("neon-drift-city", n.label);
      };
      $$("[data-node]", app).forEach((g) => { g.onclick = () => show(g.dataset.node); g.onkeydown = (e) => e.key === "Enter" && show(g.dataset.node); });
      show("m4");
    },
  });

  /* =========================================================
     MARKET
     ========================================================= */
  route("/market", () => `
    <div class="container">
      <div class="page-head"><p class="eyebrow">AI Logic &amp; Asset Marketplace</p><h1 class="h2">게임 전용 AI 모델, 시드, 셰이더를 직거래하세요</h1></div>
      <div class="market-hero">
        <div class="market-banner">
          <span class="badge hot" style="align-self:flex-start;margin-bottom:12px">FEATURED</span>
          <h2 class="h2">NPC-Emotion 7B</h2>
          <p class="muted" style="margin:8px 0 18px;max-width:420px">실시간 감정 추론에 특화된 NPC 대화 모델. 2,140개의 월드에서 사용 중.</p>
          <div style="display:flex;gap:10px"><button class="btn btn-primary" data-asset="a1">${gem} 1,200 Cr 구매</button><button class="btn btn-ghost" data-asset="a1">자세히</button></div>
        </div>
        <div class="royalty-box">
          <b>크리에이터 리믹스 수수료 구조</b>
          <p class="muted" style="font-size:13px;margin-top:4px">포크된 세계에서 발생한 컴퓨팅 수익 배분</p>
          <div class="royalty-bar"><i style="width:30%"></i><i style="width:52%"></i><i style="width:18%"></i></div>
          <div class="legend"><span style="--c:var(--cyan)">원작자 로열티 30%</span><span style="--c:var(--purple)">리믹서(포크 제작자) 52%</span><span style="--c:#3a4458">플랫폼 수수료 18% (15~20%)</span></div>
          <a href="#/pricing#b2b" class="btn btn-ghost btn-sm" style="margin-top:16px">인디 개발자 SDK Pass →</a>
        </div>
      </div>
      <div class="filter-row" style="position:static;padding-top:0">
        <div class="genre-tabs" style="margin:0" id="mcats">${["All", "AI Model", "Prompt Seed", "Shader", "Logic Template"].map((c, i) => `<button class="chip ${i ? "" : "active"}" data-c="${c}">${c}</button>`).join("")}</div>
        <select class="sort-select" id="msort" style="margin-left:auto"><option value="sales">Best Selling</option><option value="rating">Top Rated</option><option value="low">Price: Low</option><option value="high">Price: High</option></select>
      </div>
      <div class="asset-grid" id="assets"></div>
    </div>${footer()}`, {
    mount(app, q) {
      let cat = "All", sort = "sales";
      const draw = () => {
        const list = PA.ASSETS.filter((a) => cat === "All" || a.type === cat).sort({ sales: (a, b) => b.sales - a.sales, rating: (a, b) => b.rating - a.rating, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price }[sort]);
        $("#assets", app).innerHTML = list.map((a) => `
          <div class="asset" data-asset="${a.id}" tabindex="0">
            <div class="asset-icon" style="background:${a.bg}"><span class="badge type">${a.type}</span>${a.icon}</div>
            <h4>${esc(a.name)}</h4><p>${esc(a.desc)}</p>
            <div class="asset-foot"><span class="muted">@${a.by} · ★ ${a.rating}</span>${state.owned.has(a.id) ? '<span class="badge ai">OWNED</span>' : `<span class="price">${gem}${num(a.price)}</span>`}</div>
          </div>`).join("");
      };
      $$("[data-c]", app).forEach((b) => (b.onclick = () => { cat = b.dataset.c; $$("[data-c]", app).forEach((x) => x.classList.toggle("active", x === b)); draw(); }));
      $("#msort", app).onchange = (e) => { sort = e.target.value; draw(); };
      app.addEventListener("click", (e) => { const el = e.target.closest("[data-asset]"); if (el) assetModal(el.dataset.asset, draw); });
      draw();
      if (q.item) assetModal(q.item, draw);
    },
  });
  function assetModal(id, redraw) {
    const a = PA.ASSETS.find((x) => x.id === id); if (!a) return;
    const owned = state.owned.has(id);
    const m = modal(`
      <div class="asset-icon" style="background:${a.bg};height:160px;font-size:64px;margin-bottom:18px"><span class="badge type">${a.type}</span>${a.icon}</div>
      <h3>${esc(a.name)}</h3>
      <p class="lead">${esc(a.desc)}</p>
      <div class="card" style="padding:6px 16px;margin-bottom:18px">
        <div class="summary-row"><span class="muted">크리에이터</span><a href="#/creator/${a.by}" class="link">@${a.by}</a></div>
        <div class="summary-row"><span class="muted">평점 · 판매</span><span>★ ${a.rating} · ${num(a.sales)}</span></div>
        <div class="summary-row"><span class="muted">라이선스</span><span>개인 + 상업적 리믹스</span></div>
        <div class="summary-row total"><span>가격</span><span class="price">${gem}${num(a.price)} Cr</span></div>
      </div>
      <button class="btn btn-primary btn-block btn-lg" id="buy" ${owned ? "disabled" : ""}>${owned ? "보유 중" : "구매하기"}</button>`, { cls: "wide" });
    $("#buy", m.el).onclick = () => requireAuth(() => quickAuth(() => {
      if (!spend(a.price, `마켓 구매 — ${a.name}`, a.type, "◈", "out")) return;
      state.owned.add(id); save("owned");
      swap(m, `<div style="text-align:center"><div style="font-size:56px">${a.icon}</div><h3>구매 완료</h3><p class="lead">${esc(a.name)}이(가) 내 라이브러리에 추가되었습니다. 원작자 @${a.by}에게 수익이 정산됩니다.</p><button class="btn btn-primary btn-block" id="ok">확인</button></div>`, "modal wide");
      $("#ok", m.el).onclick = () => { m.close(); redraw && redraw(); };
    }, "구매 인증"));
  }

  /* =========================================================
     PRICING  →  CHECKOUT
     ========================================================= */
  route("/pricing", () => `
    <div class="container">
      <div class="page-head" style="text-align:center;padding-top:56px">
        <p class="eyebrow">Compute Credit Model</p>
        <h1 class="h2">쓴 만큼만, 상상한 만큼 무한하게</h1>
        <p style="margin-inline:auto">모든 유저에게 매월 300 Cr 무료 쿼터 제공. 고해상도·초저지연 세션은 프리미엄 플랜으로.</p>
        <div class="toggle-period" id="period"><button class="active" data-p="m">월간</button><button data-p="y">연간 <span class="cyan">-20%</span></button></div>
      </div>
      <div class="plans" id="plans"></div>

      <section class="section" style="padding-top:60px">
        <div class="section-head"><h2 class="h3">추가 크레딧 &amp; Audience Bits</h2></div>
        <div class="extra-grid">
          ${[["💠", "Credit Pack S", 300, 3], ["💎", "Credit Pack L", 1500, 12], ["🎙️", "Audience Bits ×500", 500, 5]].map(([i, n, c, p]) => `
            <div class="panel"><div class="row-between"><span style="font-size:28px">${i}</span><span class="badge ai">+${num(c)} Cr</span></div><h4 style="margin:12px 0 4px">${n}</h4><p class="muted" style="font-size:13px;margin-bottom:14px">${i === "🎙️" ? "관전자 프롬프트 인젝션 전용 토큰" : "만료 없는 컴퓨팅 크레딧"}</p><button class="btn btn-ghost btn-block" data-pack="${c}" data-price="${p}" data-name="${n}">$${p} 구매</button></div>`).join("")}
        </div>
      </section>

      <section class="section" id="b2b" style="padding-top:60px">
        <div class="market-banner" style="min-height:auto;display:grid;grid-template-columns:1.4fr 1fr;gap:24px;align-items:center">
          <div><span class="badge hot">B2B</span><h2 class="h2" style="margin:10px 0">Indie AI Game Launchpad</h2><p class="muted">중소형 인디 팀을 위한 서버 인프라, 실시간 AI API 백엔드, 통합 빌링 시스템. SDK Pass 하나로 출시까지.</p></div>
          <div style="display:grid;gap:8px;font-size:14px"><span>✓ WebGPU 스트리밍 인프라</span><span>✓ LLM · 이미지 생성 API 통합</span><span>✓ 크레딧 빌링 & 로열티 정산</span><a class="btn btn-primary" href="#/support" style="margin-top:8px">SDK Pass 문의하기</a></div>
        </div>
      </section>

      <section class="section" style="padding-top:60px">
        <div class="section-head"><h2 class="h3">플레이어와 크리에이터의 이야기</h2></div>
        <div class="testis">${PA.TESTIMONIALS.map((t) => `<div class="testi"><p>“${esc(t.q)}”</p><div class="who">${avatar(t.n)}<div><b>${esc(t.n)}</b>${esc(t.r)}</div></div></div>`).join("")}</div>
      </section>
    </div>${footer()}`, {
    mount(app) {
      let yearly = false;
      const draw = () => {
        $("#plans", app).innerHTML = PA.PLANS.map((p) => {
          const price = yearly ? (p.price * 0.8).toFixed(1).replace(/\.0$/, "") : p.price;
          return `<div class="plan ${p.featured ? "featured" : ""}">${p.featured ? '<span class="ribbon">MOST POPULAR</span>' : ""}
            <div><h3 class="h3">${p.name}</h3><p class="muted" style="font-size:14px;margin-top:4px">${p.desc}</p></div>
            <div class="plan-price">$${price}<small> / 월${yearly ? " (연 결제)" : ""}</small></div>
            <ul>${p.feats.map((f) => `<li>${f}</li>`).join("")}${p.off.map((f) => `<li class="off">${f}</li>`).join("")}</ul>
            <a href="#/checkout/${p.id}${yearly ? "?y=1" : ""}" class="btn ${p.featured ? "btn-primary" : "btn-ghost"} btn-block btn-lg">${p.name} 시작하기</a></div>`;
        }).join("");
      };
      $$("[data-p]", app).forEach((b) => (b.onclick = () => { yearly = b.dataset.p === "y"; $$("[data-p]", app).forEach((x) => x.classList.toggle("active", x === b)); draw(); }));
      $$("[data-pack]", app).forEach((b) => (b.onclick = () => requireAuth(() => quickAuth(() => { earn(+b.dataset.pack, b.dataset.name, `$${b.dataset.price} 결제`, "💠"); toast(`${num(+b.dataset.pack)} Cr 충전 완료`); }, "결제 인증"))));
      draw();
      if (location.hash.includes("#b2b")) setTimeout(() => $("#b2b", app).scrollIntoView({ behavior: "smooth" }), 100);
    },
  });

  route("/checkout/:plan", (pid, q) => {
    const p = PA.PLANS.find((x) => x.id === pid) || PA.PLANS[1];
    const y = q.y === "1";
    const monthly = y ? +(p.price * 0.8).toFixed(2) : p.price;
    const total = y ? +(monthly * 12).toFixed(2) : monthly;
    return `
    <div class="container">
      <nav class="breadcrumb"><a href="#/pricing">Pricing</a><span>/</span><span>Checkout</span></nav>
      <div class="checkout">
        <form class="panel" id="payForm" novalidate>
          <h2 class="h3" style="margin-bottom:18px">결제 정보</h2>
          <div class="form-grid">
            <div><label class="field-label">이름</label><input class="input" name="name" value="${esc(state.user ? state.user.name : "")}" /><div class="err-text"></div></div>
            <div><label class="field-label">이메일</label><input class="input" name="email" type="email" value="${esc(state.user ? state.user.email : "")}" /><div class="err-text"></div></div>
            <div class="full"><label class="field-label">결제 수단</label><div class="pay-methods"><label><input type="radio" name="pm" value="card" checked /><span>💳 카드</span></label><label><input type="radio" name="pm" value="toss" /><span>Toss Pay</span></label><label><input type="radio" name="pm" value="paypal" /><span>PayPal</span></label></div></div>
            <div class="full" data-card><label class="field-label">카드 번호</label><input class="input" name="card" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="19" /><div class="err-text"></div></div>
            <div data-card><label class="field-label">유효기간</label><input class="input" name="exp" placeholder="MM/YY" maxlength="5" /><div class="err-text"></div></div>
            <div data-card><label class="field-label">CVC</label><input class="input" name="cvc" inputmode="numeric" placeholder="123" maxlength="4" /><div class="err-text"></div></div>
            <div class="full"><label class="check"><input type="checkbox" name="agree" /> 정기결제 및 <a href="#" class="link" data-action="policy" data-kind="terms">서비스 정책</a>에 동의합니다. 언제든 해지할 수 있습니다.</label><div class="err-text"></div></div>
          </div>
          <button class="btn btn-primary btn-block btn-lg" style="margin-top:18px">$${total} 결제하기</button>
        </form>
        <aside class="panel" style="align-self:start">
          <span class="badge ai">${p.name.toUpperCase()}</span>
          <h3 class="h3" style="margin:10px 0 4px">${p.name} 플랜 · ${y ? "연간" : "월간"}</h3>
          <p class="muted" style="font-size:13px;margin-bottom:12px">${p.desc}</p>
          <div class="summary-row"><span>월 요금</span><span>$${monthly}</span></div>
          <div class="summary-row"><span>매월 지급 크레딧</span><span class="price">${gem}${num(p.credits)} Cr</span></div>
          ${y ? `<div class="summary-row"><span>연간 할인</span><span style="color:var(--green)">-20%</span></div>` : ""}
          <div class="summary-row"><span>30일 Risk-free</span><span style="color:var(--green)">언제든 환불</span></div>
          <div class="summary-row total"><span>오늘 결제</span><span>$${total}</span></div>
        </aside>
      </div>
    </div>`;
  }, {
    mount(app, pid) {
      const p = PA.PLANS.find((x) => x.id === pid) || PA.PLANS[1];
      const f = $("#payForm", app);
      f.card.oninput = () => (f.card.value = f.card.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim());
      f.exp.oninput = () => (f.exp.value = f.exp.value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2"));
      $$('[name="pm"]', f).forEach((r) => (r.onchange = () => $$("[data-card]", f).forEach((d) => (d.hidden = f.pm.value !== "card"))));
      const err = (el, msg) => { const box = el.type === "checkbox" ? el.closest("div").querySelector(".err-text") : el.nextElementSibling; el.classList && el.classList.toggle("err", !!msg); box.textContent = msg || ""; return !msg; };
      f.onsubmit = (e) => {
        e.preventDefault();
        const card = f.pm.value === "card";
        const ok = [
          err(f.name, f.name.value.trim() ? "" : "이름을 입력하세요"),
          err(f.email, /^\S+@\S+\.\S+$/.test(f.email.value) ? "" : "올바른 이메일을 입력하세요"),
          !card || err(f.card, f.card.value.replace(/\s/g, "").length === 16 ? "" : "16자리 카드 번호"),
          !card || err(f.exp, /^(0[1-9]|1[0-2])\/\d{2}$/.test(f.exp.value) ? "" : "MM/YY"),
          !card || err(f.cvc, /^\d{3,4}$/.test(f.cvc.value) ? "" : "3~4자리"),
          err(f.agree, f.agree.checked ? "" : "약관에 동의해주세요"),
        ].every(Boolean);
        if (!ok) return;
        requireAuth(() => quickAuth(() => {
          const btn = f.querySelector("button.btn-primary"); btn.disabled = true; btn.textContent = "결제 처리 중…";
          setTimeout(() => {
            earn(p.credits, `${p.name} 플랜 월간 크레딧`, "구독 시작", "＋");
            state.user && (state.user.plan = p.name, save("user"));
            const m = modal(`<div style="text-align:center"><div style="font-size:60px">🎉</div><h3>${p.name} 플랜이 시작되었습니다</h3><p class="lead">${num(p.credits)} Cr이 지갑에 충전되었습니다.</p><a href="#/wallet" class="btn btn-primary btn-block" id="ok">지갑 확인하기</a></div>`);
            $("#ok", m.el).onclick = () => m.close();
          }, 1200);
        }, "결제 인증"));
      };
    },
  });

  /* =========================================================
     WALLET  (IA: 홈 메인(월렛) — 알림 · 사용내역 · 보내기 · 입출금내역 · 운동정보→플레이 통계)
     ========================================================= */
  route("/wallet", () => {
    const u = state.user;
    const used = state.tx.filter((t) => t.amt < 0 && t.date.startsWith("2026.10")).reduce((s, t) => s - t.amt, 0);
    const quota = 300, pct = Math.min(100, Math.round((Math.min(used, quota) / quota) * 100));
    const week = [38, 62, 25, 80, 54, 96, 40];
    const st = state.stats;
    return `
    <div class="container">
      <div class="page-head"><p class="eyebrow">My Wallet</p><h1 class="h2">${u ? `@${esc(u.handle)}의 지갑` : "지갑"}</h1></div>
      ${u ? "" : `<div class="panel row-between" style="margin-bottom:20px"><span>로그인하면 크레딧 보내기, QR 수신, 거래 내역을 이용할 수 있어요.</span><button class="btn btn-primary btn-sm" data-action="login">로그인</button></div>`}
      <div class="wallet-top">
        <div class="balance-card">
          <span class="muted" style="font-size:13px">보유 Compute Credit</span>
          <div class="balance-num">${gem}${num(state.credits)}<span style="font-size:20px;color:var(--muted);font-weight:600">Cr</span></div>
          <span class="muted" style="font-size:13px">${u && u.plan ? `${u.plan} 플랜 이용 중` : "Free 플랜"} · 다음 충전 11월 1일</span>
          <div class="quota"><div class="row-between" style="font-size:12px"><span>이번 달 무료 쿼터</span><span>${Math.min(used, quota)} / ${quota} Cr</span></div><div class="meter"><i style="width:${pct}%"></i></div></div>
          <div class="wallet-actions">
            <button class="w-act" data-action="send"><i>↗</i>보내기</button>
            <button class="w-act" data-action="qr"><i>▦</i>받기 (QR)</button>
            <a class="w-act" href="#/pricing"><i>＋</i>충전</a>
            <a class="w-act" href="#/more/security"><i>🔒</i>보안</a>
          </div>
        </div>
        <div>
          <div class="stat-grid">
            <div class="stat-box"><span>총 플레이 시간</span><b>${Math.floor(st.minutes / 60)}h ${st.minutes % 60}m</b><small>▲ 12% this week</small></div>
            <div class="stat-box"><span>탐험한 세계</span><b>${st.worlds}</b><small>▲ 3 new</small></div>
            <div class="stat-box"><span>포크한 세계선</span><b>${st.forks}</b><small>로열티 +180 Cr</small></div>
            <div class="stat-box"><span>프롬프트 인젝션</span><b>${st.injections}</b><small>Top 8% 관전자</small></div>
          </div>
          <div class="panel" style="margin-top:12px;padding:16px"><div class="row-between" style="font-size:13px"><b>주간 크레딧 사용량</b><span class="muted">Cr</span></div>
            <div class="chart">${week.map((v, i) => `<div><i style="height:0" data-h="${v}"></i><span>${"월화수목금토일"[i]}</span></div>`).join("")}</div>
          </div>
        </div>
      </div>
      <div class="wallet-cols">
        <div class="panel">
          <div class="panel-title"><span>거래 내역</span><div class="tx-tabs" id="txTabs"><button class="chip active" data-f="all">전체</button><button class="chip" data-f="use">사용 내역</button><button class="chip" data-f="io">입출금</button></div></div>
          <div class="tx-list" id="txList"></div>
        </div>
        <div class="panel">
          <div class="panel-title"><span>🔔 알림</span><button class="link" id="readAll">모두 읽음</button></div>
          <div id="notis">
            ${[["@voxel님이 당신의 세계선을 포크했습니다", "로열티 +12 Cr 예정", "5분 전"], ["Live Prompt Injection 2.0 출시", "관전자가 보스를 직접 설계", "1시간 전"], ["Old Sato가 당신을 그리워합니다", "Neon Drift City · NPC 메시지", "어제"], ["10월 무료 쿼터 300 Cr 지급", "Compute Credit", "10월 1일"]].map(([t, s, d], i) => `<div class="noti ${i > 1 ? "read" : ""}"><span class="dot"></span><div>${t}<small>${s} · ${d}</small></div></div>`).join("")}
          </div>
        </div>
      </div>
    </div>${footer()}`;
  }, {
    mount(app) {
      let f = "all";
      const draw = () => {
        const list = state.tx.filter((t) => f === "all" || (f === "use" ? t.kind === "use" : t.kind !== "use"));
        $("#txList", app).innerHTML = list.slice(0, 12).map((t) => `<div class="tx" data-action="tx" data-id="${t.id}"><span class="tx-ico">${t.icon}</span><div><b>${esc(t.title)}</b><small>${esc(t.sub)} · ${t.date}</small></div><span class="amt ${t.amt > 0 ? "plus" : "minus"}">${t.amt > 0 ? "+" : ""}${num(t.amt)}</span></div>`).join("") || '<p class="muted">내역이 없습니다</p>';
      };
      $$("[data-f]", app).forEach((b) => (b.onclick = () => { f = b.dataset.f; $$("[data-f]", app).forEach((x) => x.classList.toggle("active", x === b)); draw(); }));
      $("#readAll", app).onclick = () => $$(".noti", app).forEach((n) => n.classList.add("read"));
      draw();
      requestAnimationFrame(() => setTimeout(() => $$("[data-h]", app).forEach((i) => (i.style.height = i.dataset.h + "%")), 50));
    },
  });

  /* =========================================================
     NEWS (소식)
     ========================================================= */
  route("/news", () => {
    const [top, ...rest] = PA.NEWS;
    return `
    <div class="container">
      <div class="page-head"><p class="eyebrow">News</p><h1 class="h2">소식 · 공지사항 · 이벤트</h1></div>
      <div class="news-feature">
        <div class="news-big" data-news="${top.id}">${media(top.img, { live: true })}<div class="copy"><span class="badge new">BREAKING</span><h2 class="h2" style="margin:10px 0 6px;font-size:28px">${esc(top.title)}</h2><p class="muted">${top.date}</p></div></div>
        <div class="panel"><div class="panel-title">최신 소식</div><div class="news-list">${rest.slice(0, 5).map((n) => `<a href="#" class="news-row" data-news="${n.id}"><span class="badge">${n.cat}</span><span class="title">${esc(n.title)}</span><span class="date">${n.date.slice(5)}</span></a>`).join("")}</div></div>
      </div>
      <div class="filter-row" style="position:static;padding-top:0"><div class="genre-tabs" style="margin:0">${["All", "Breaking", "Notice", "Event", "Patch", "Creator"].map((c, i) => `<button class="chip ${i ? "" : "active"}" data-nc="${c}">${c}</button>`).join("")}</div></div>
      <div class="news-cards" id="newsCards"></div>
    </div>${footer()}`;
  }, {
    mount(app, q) {
      const draw = (c) => ($("#newsCards", app).innerHTML = PA.NEWS.filter((n) => c === "All" || n.cat === c).map((n) => `<article class="news-card" data-news="${n.id}">${media(n.img)}<div class="body"><span class="badge ${n.cat === "Breaking" ? "new" : ""}">${n.cat}</span><h4>${esc(n.title)}</h4><p>${n.date}</p></div></article>`).join(""));
      $$("[data-nc]", app).forEach((b) => (b.onclick = () => { $$("[data-nc]", app).forEach((x) => x.classList.toggle("active", x === b)); draw(b.dataset.nc); }));
      draw("All");
      app.addEventListener("click", (e) => { const el = e.target.closest("[data-news]"); if (el) { e.preventDefault(); newsModal(el.dataset.news); } });
      if (q.id) newsModal(q.id);
    },
  });
  function newsModal(id) {
    const n = PA.NEWS.find((x) => x.id === id); if (!n) return;
    const m = modal(`<div style="margin:-32px -32px 20px;height:220px">${media(n.img).replace('class="media', 'style="height:100%" class="media')}</div><span class="badge ${n.cat === "Breaking" ? "new" : ""}">${n.cat}</span><h3 style="margin-top:10px">${esc(n.title)}</h3><p class="muted" style="font-size:13px;margin-bottom:16px">${n.date}</p><p style="color:#cfd5e0;line-height:1.7">${esc(n.body)}</p><button class="btn btn-primary btn-block" style="margin-top:22px" id="ok">확인</button>`, { cls: "wide" });
    $("#ok", m.el).onclick = m.close;
  }

  /* =========================================================
     SUPPORT (Miro: search bar + FAQ)
     ========================================================= */
  route("/support", () => `
    <div class="container">
      <div class="support-hero">
        <p class="eyebrow">Customer Center</p>
        <h1 class="h2">무엇을 도와드릴까요?</h1>
        <form class="support-search" id="faqSearch"><input placeholder="크레딧, 포크, 보안 PIN…" /><button class="btn btn-primary btn-sm">검색</button></form>
      </div>
      <div class="faq-cats">${["All", "Credits", "Play", "Remix", "Account"].map((c, i) => `<button class="chip ${i ? "" : "active"}" data-fc="${c}">${c}</button>`).join("")}</div>
      <div class="faq" id="faq"></div>
      <div class="contact-grid">
        <div class="panel"><div style="font-size:26px">💬</div><h4 style="margin:10px 0 4px">실시간 채팅</h4><p class="muted" style="font-size:13px;margin-bottom:12px">평균 응답 2분 · 24/7</p><button class="btn btn-ghost btn-sm" id="chatBtn">채팅 시작</button></div>
        <div class="panel"><div style="font-size:26px">✉️</div><h4 style="margin:10px 0 4px">1:1 문의</h4><p class="muted" style="font-size:13px;margin-bottom:12px">결제·환불·계정 문의</p><button class="btn btn-ghost btn-sm" id="ticketBtn">문의 작성</button></div>
        <div class="panel"><div style="font-size:26px">🧰</div><h4 style="margin:10px 0 4px">개발자 · SDK</h4><p class="muted" style="font-size:13px;margin-bottom:12px">Indie Launchpad 파트너십</p><a class="btn btn-ghost btn-sm" href="#/pricing#b2b">자세히</a></div>
      </div>
    </div>${footer()}`, {
    mount(app) {
      let cat = "All", qq = "";
      const draw = () => {
        const list = PA.FAQ.filter((f) => (cat === "All" || f.c === cat) && (!qq || (f.q + f.a).toLowerCase().includes(qq)));
        $("#faq", app).innerHTML = list.map((f, i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("") || `<p class="muted" style="padding:22px">“${esc(qq)}” 관련 FAQ가 없어요. 1:1 문의를 남겨주세요.</p>`;
      };
      $$("[data-fc]", app).forEach((b) => (b.onclick = () => { cat = b.dataset.fc; $$("[data-fc]", app).forEach((x) => x.classList.toggle("active", x === b)); draw(); }));
      $("#faqSearch", app).onsubmit = (e) => { e.preventDefault(); qq = e.target.querySelector("input").value.trim().toLowerCase(); draw(); };
      $("#faqSearch input", app).oninput = (e) => { qq = e.target.value.trim().toLowerCase(); draw(); };
      $("#chatBtn", app).onclick = () => toast("상담원을 연결하는 중입니다… (데모)");
      $("#ticketBtn", app).onclick = () => {
        const m = modal(`<h3>1:1 문의</h3><p class="lead">영업일 기준 24시간 내 답변드립니다.</p><form class="stack"><select class="input"><option>결제 / 환불</option><option>크레딧</option><option>계정 / 보안</option><option>버그 신고</option></select><textarea class="input" rows="5" placeholder="문의 내용을 입력하세요" required></textarea><button class="btn btn-primary btn-block">제출</button></form>`);
        m.el.querySelector("form").onsubmit = (e) => { e.preventDefault(); m.close(); toast("문의가 접수되었습니다"); };
      };
      draw();
    },
  });

  /* =========================================================
     CREATOR PROFILE (Miro: hero + avatars)
     ========================================================= */
  route("/creator/:handle", (h) => {
    const games = PA.GAMES.filter((g) => g.creator === h);
    const assets = PA.ASSETS.filter((a) => a.by === h);
    const banner = games[0] ? games[0].id : "hero";
    const plays = games.reduce((s, g) => s + g.plays, 0) || 1240;
    const following = state.following.has(h);
    const collab = ["voxel", "nova", "synthia", "tidal", "cyberdev", "glitch_art", "lumen", "nyx"].filter((x) => x !== h).slice(0, 4);
    return `
    <div class="container">
      <div class="creator-banner">${media(banner, { live: true }).replace('class="media', 'style="height:100%" class="media')}</div>
      <div class="creator-head">
        ${avatar(h, "lg")}
        <div class="info"><h1 class="h2">@${esc(h)}</h1><p class="muted">World builder · ${games.length ? esc(games[0].genre) : "Remixer"} · Seoul</p></div>
        <button class="btn ${following ? "btn-ghost" : "btn-primary"}" id="followBtn">${following ? "팔로잉 ✓" : "팔로우"}</button>
      </div>
      <div class="creator-stats"><div><b>${k(plays)}</b><span>Total plays</span></div><div><b>${games.reduce((s, g) => s + g.forks, 0) || 12}</b><span>Forks</span></div><div><b>${k(2400 + h.length * 310 + (following ? 1 : 0))}</b><span>Followers</span></div><div><b>${num(games.length * 1820 + assets.length * 640 + 180)} Cr</b><span>Royalty earned</span></div></div>
      <section class="section" style="padding-top:44px"><div class="section-head"><h2 class="h3">Worlds</h2></div>
        <div class="game-grid">${games.length ? games.map(gameCard).join("") : PA.FORKS.filter((f) => f.by === h).map((f) => gameCard({ ...G(f.from), title: f.title, creator: h })).join("") || '<p class="muted">아직 공개한 세계가 없어요.</p>'}</div>
      </section>
      ${assets.length ? `<section class="section" style="padding-top:44px"><div class="section-head"><h2 class="h3">Market assets</h2></div><div class="asset-grid">${assets.map((a) => `<a href="#/market?item=${a.id}" class="asset"><div class="asset-icon" style="background:${a.bg}"><span class="badge type">${a.type}</span>${a.icon}</div><h4>${esc(a.name)}</h4><div class="asset-foot"><span class="muted">★ ${a.rating}</span><span class="price">${gem}${num(a.price)}</span></div></a>`).join("")}</div></section>` : ""}
      <section class="section" style="padding-top:44px"><div class="section-head"><h2 class="h3">Collaborators</h2></div>
        <div class="team-grid">${collab.map((c) => `<a href="#/creator/${c}" class="team">${avatar(c, "md")}<div><b>@${c}</b><span>Co-remixed ${2 + c.length % 5} worlds</span></div></a>`).join("")}</div>
      </section>
    </div>${footer()}`;
  }, {
    mount(app, h) {
      $("#followBtn", app).onclick = () => requireAuth(() => {
        state.following.has(h) ? state.following.delete(h) : state.following.add(h);
        save("following"); render();
      });
    },
  });

  /* =========================================================
     MORE (더보기)
     내 정보(이메일 변경 · 로그인 이력 · 비밀번호 변경/찾기) · 인증/보안(패턴 · PIN · 보안비밀번호)
     연동 앱 · 고객센터 · 설정 · 공지사항/이벤트 · 버전정보
     ========================================================= */
  const MORE = [
    ["grp", "Account"], ["profile", "내 정보"], ["security", "인증 / 보안"], ["apps", "연동 앱 정보"],
    ["grp", "Service"], ["support", "고객센터", "#/support"], ["settings", "설정"], ["notice", "공지사항 / 이벤트", "#/news"], ["version", "버전 정보"],
  ];
  route("/more", () => moreView("profile"), { mount: (app) => moreMount(app, "profile") });
  route("/more/:sec", (s) => moreView(s), { mount: (app, s) => moreMount(app, s) });

  function moreView(sec) {
    const u = state.user;
    const menu = `<nav class="side-menu">${MORE.map(([id, label, href]) => id === "grp" ? `<div class="grp">${label}</div>` : `<a href="${href || "#/more/" + id}" class="${id === sec ? "active" : ""}">${label}<span>›</span></a>`).join("")}${u ? '<a href="#" data-action="logout" style="color:var(--red)">로그아웃</a>' : ""}</nav>`;
    let body = "";
    const needLogin = `<div class="panel" style="text-align:center;padding:48px"><div style="font-size:48px">🔐</div><h3 class="h3" style="margin:10px 0 6px">로그인이 필요합니다</h3><p class="muted" style="margin-bottom:18px">계정 정보와 보안 설정을 관리하려면 로그인하세요.</p><button class="btn btn-primary" data-action="login">로그인</button> <button class="btn btn-ghost" data-action="signup">회원가입</button></div>`;
    if (sec === "profile") body = !u ? needLogin : `
      <div class="profile-head">${avatar(u.handle, "md")}<div style="flex:1"><b style="font-size:18px">@${esc(u.handle)}</b><div class="muted" style="font-size:13px">${esc(u.email)} ${u.verified ? '<span class="badge ai">VERIFIED</span>' : ""}</div></div><a href="#/creator/${esc(u.handle)}" class="btn btn-ghost btn-sm">크리에이터 페이지</a></div>
      <div class="list-group"><h4>회원정보 관리</h4>
        <button class="list-item" data-m="nick"><span>닉네임 변경<small>@${esc(u.handle)}</small></span><span class="arrow">›</span></button>
        <button class="list-item" data-m="email"><span>이메일 변경<small>${esc(u.email)}</small></span><span class="arrow">›</span></button>
        <button class="list-item" data-m="history"><span>로그인 이력<small>최근 접속 ${PA.LOGIN_HISTORY[0].d}</small></span><span class="arrow">›</span></button>
        <button class="list-item" data-m="pw"><span>비밀번호 변경</span><span class="arrow">›</span></button>
        <button class="list-item" data-m="findpw"><span>비밀번호 찾기</span><span class="arrow">›</span></button>
      </div>
      <div class="list-group"><h4>구독</h4><a class="list-item" href="#/pricing"><span>${u.plan || "Free"} 플랜<small>플랜 변경 및 결제 수단 관리</small></span><span class="arrow">›</span></a><button class="list-item" data-m="withdraw"><span style="color:var(--red)">회원 탈퇴</span><span class="arrow">›</span></button></div>`;
    if (sec === "security") {
      const s = state.security;
      body = !u ? needLogin : `
      <div class="list-group"><h4>간편 인증</h4>
        <button class="list-item" data-m="pattern"><span>패턴 ${s.pattern ? "변경 및 재설정" : "등록"}<small>${s.pattern ? "등록됨" : "미등록"}</small></span><span class="arrow">${s.pattern ? "✓" : "›"}</span></button>
        <button class="list-item" data-m="pin"><span>PIN 번호 ${s.pin ? "변경 및 재설정" : "등록"}<small>${s.pin ? "등록됨 · 6자리" : "미등록"}</small></span><span class="arrow">${s.pin ? "✓" : "›"}</span></button>
        <button class="list-item" data-m="bio"><span>지문 / Passkey<small>${s.bio ? "사용 중" : "사용 안 함"}</small></span><span class="arrow">${s.bio ? "✓" : "›"}</span></button>
      </div>
      <div class="list-group"><h4>지갑 보안</h4>
        <button class="list-item" data-m="securepw"><span>보안 비밀번호 ${s.securePw ? "변경 및 재설정" : "등록"}<small>크레딧 보내기 시 사용 · ${s.securePw ? "등록됨" : "미등록"}</small></span><span class="arrow">›</span></button>
        <label class="list-item"><span>2단계 인증 (OTP)<small>로그인 시 추가 인증</small></span><span class="switch"><input type="checkbox" data-set="otp" ${state.settings.otp ? "checked" : ""}/><span></span></span></label>
      </div>`;
    }
    if (sec === "apps") {
      const apps = [["Twitch", "#9146ff", "T", "라이브 프롬프트 인젝션 채팅 연동"], ["YouTube", "#ff0033", "▶", "라이브 스트리밍 관전자 연동"], ["Discord", "#5865f2", "D", "세계선 공유 & 커뮤니티 알림"], ["GitHub", "#24292f", "G", "로직 템플릿 버전 관리"], ["Steam", "#1b2838", "S", "친구 목록 가져오기"]];
      const linked = store.get("apps", ["Discord"]);
      body = `<div class="list-group"><h4>연동 앱 정보</h4>${apps.map(([n, c, l, d]) => `<div class="list-item"><span class="app-row"><span class="app-logo" style="background:${c}">${l}</span><span>${n}<small>${d}</small></span></span><button class="btn ${linked.includes(n) ? "btn-ghost" : "btn-outline"} btn-sm" data-app="${n}">${linked.includes(n) ? "연결 해제" : "연결"}</button></div>`).join("")}</div>`;
    }
    if (sec === "settings") {
      const S = state.settings;
      const row = (k_, t, d) => `<label class="list-item"><span>${t}<small>${d}</small></span><span class="switch"><input type="checkbox" data-set="${k_}" ${S[k_] ? "checked" : ""}/><span></span></span></label>`;
      body = `
      <div class="list-group"><h4>알림</h4>${row("push", "푸시 알림", "포크, 로열티, NPC 메시지")}${row("email", "이메일 알림", "이벤트 및 크레딧 혜택")}</div>
      <div class="list-group"><h4>플레이</h4>${row("autoplay", "썸네일 라이브 미리보기", "탐색 화면에서 실시간 세션 재생")}${row("hd", "고해상도 세션 우선", "크레딧 소모가 늘어날 수 있습니다")}${row("lowLatency", "초저지연 모드", "Ultra 플랜 전용 · ~20ms")}${row("npcMemory", "Neural NPC 장기 기억", "NPC가 나와의 상호작용을 기억")}</div>
      <div class="list-group"><h4>관전 &amp; 개인정보</h4>${row("spectate", "관전 허용", "다른 유저가 내 세션을 시청하고 인젝션 가능")}<button class="list-item" data-action="tutorial"><span>튜토리얼 다시 보기</span><span class="arrow">›</span></button><button class="list-item" id="resetDemo"><span style="color:var(--red)">데모 데이터 초기화<small>로컬 저장 정보를 모두 지웁니다</small></span><span class="arrow">›</span></button></div>`;
    }
    if (sec === "version") body = `
      <div class="panel" style="text-align:center;padding:48px"><div class="logo" style="justify-content:center">${PA.logoHTML}</div><p style="margin-top:18px"><b>v2.6.0</b> <span class="badge ai">최신 버전</span></p><p class="muted" style="font-size:13px;margin-top:6px">WebGPU Renderer 3.1 · WASM Runtime 1.8 · Neural NPC Engine 0.9</p>
      <div style="display:flex;gap:10px;justify-content:center;margin-top:20px"><button class="btn btn-ghost btn-sm" data-action="policy" data-kind="terms">이용약관</button><button class="btn btn-ghost btn-sm" data-action="policy" data-kind="privacy">개인정보 처리방침</button><button class="btn btn-ghost btn-sm" id="oss">오픈소스 라이선스</button></div></div>`;
    if (!body) body = `<div class="panel">준비 중입니다.</div>`;
    return `<div class="container"><div class="more-layout">${menu}<div><h1 class="h2" style="margin-bottom:20px;font-size:26px">${(MORE.find((m) => m[0] === sec) || [, "더보기"])[1]}</h1>${body}</div></div></div>${footer()}`;
  }

  function moreMount(app, sec) {
    const s = state.security;
    const simpleForm = (title, lead, fields, onOk) => {
      const m = modal(`<h3>${title}</h3><p class="lead">${lead}</p><form class="stack">${fields.map(([n, l, t = "text", v = ""]) => `<div><label class="field-label">${l}</label><input class="input" name="${n}" type="${t}" value="${esc(v)}" /><div class="err-text"></div></div>`).join("")}<button class="btn btn-primary btn-block">저장</button></form>`);
      m.el.querySelector("form").onsubmit = (e) => { e.preventDefault(); const r = onOk(e.target); if (r === true) { m.close(); render(); } else if (typeof r === "string") { const el = e.target.querySelector(".input:last-of-type"); toast(r, "warn"); } };
    };
    const handlers = {
      nick: () => simpleForm("닉네임 변경", "영문/숫자/_ 3~16자", [["h", "새 닉네임", "text", state.user.handle]], (f) => { if (!/^\w{3,16}$/.test(f.h.value)) return "형식을 확인하세요"; state.user.handle = f.h.value; save("user"); PA.renderAuth(); toast("닉네임이 변경되었습니다"); return true; }),
      email: () => quickAuth(() => {
        const m = modal(`<h3>이메일 변경</h3><p class="lead">새 이메일로 인증 코드를 보내드립니다.</p><form class="stack"><div><label class="field-label">새 이메일</label><input class="input" name="e" type="email" /><div class="err-text"></div></div><button class="btn btn-primary btn-block">인증 코드 받기</button></form>`);
        m.el.querySelector("form").onsubmit = (e) => {
          e.preventDefault(); const em = e.target.e.value;
          if (!/^\S+@\S+\.\S+$/.test(em)) { e.target.e.classList.add("err"); e.target.e.nextElementSibling.textContent = "올바른 이메일을 입력하세요"; return; }
          swap(m, `<h3>인증 코드 입력</h3><p class="lead">${esc(em)} 으로 보낸 6자리 코드를 입력하세요. (데모: 아무 6자리)</p><form class="stack"><input class="input" name="c" maxlength="6" inputmode="numeric" placeholder="000000" style="text-align:center;font-size:24px;letter-spacing:.4em;font-family:var(--mono)" /><button class="btn btn-primary btn-block">확인</button></form>`);
          m.el.querySelector("form").onsubmit = (ev) => { ev.preventDefault(); if (!/^\d{6}$/.test(ev.target.c.value)) return toast("6자리 숫자를 입력하세요", "warn"); state.user.email = em; save("user"); m.close(); toast("이메일이 변경되었습니다"); render(); };
        };
      }, "이메일 변경 인증"),
      history: () => { const m = modal(`<h3>로그인 이력</h3><p class="lead">본인이 아닌 접속이 있다면 비밀번호를 변경하세요.</p><div class="list-group" style="margin:0">${PA.LOGIN_HISTORY.map((h) => `<div class="list-item" style="cursor:default"><span>${h.dev} ${h.now ? '<span class="badge ai">현재 기기</span>' : ""}<small>${h.d} · ${h.loc} · ${h.ip}</small></span>${h.now ? "" : '<button class="btn btn-ghost btn-sm" data-out>로그아웃</button>'}</div>`).join("")}</div>`, { cls: "wide" }); $$("[data-out]", m.el).forEach((b) => (b.onclick = () => { b.closest(".list-item").remove(); toast("해당 기기에서 로그아웃했습니다"); })); },
      pw: () => simpleForm("비밀번호 변경", "8자 이상, 영문·숫자·특수문자 조합을 권장합니다.", [["cur", "현재 비밀번호", "password"], ["n1", "새 비밀번호", "password"], ["n2", "새 비밀번호 확인", "password"]], (f) => { if (!f.cur.value) return "현재 비밀번호를 입력하세요"; if (f.n1.value.length < 8) return "새 비밀번호는 8자 이상"; if (f.n1.value !== f.n2.value) return "새 비밀번호가 일치하지 않습니다"; toast("비밀번호가 변경되었습니다"); return true; }),
      findpw: () => PA.forgotPassword(),
      withdraw: () => { const m = modal(`<h3>회원 탈퇴</h3><p class="lead">보유 크레딧 ${num(state.credits)} Cr과 발행한 세계선이 모두 삭제됩니다. 포크된 세계선은 익명으로 유지됩니다.</p><div style="display:flex;gap:10px"><button class="btn btn-ghost" style="flex:1" id="c">취소</button><button class="btn btn-danger" style="flex:1" id="w">탈퇴하기</button></div>`); $("#c", m.el).onclick = m.close; $("#w", m.el).onclick = () => { m.close(); localStorage.clear(); location.hash = "#/"; location.reload(); }; },
      pattern: () => (s.pattern ? quickAuth(() => setPattern(), "기존 인증 확인") : setPattern()),
      pin: () => (s.pin ? quickAuth(() => setPin(), "기존 인증 확인") : setPin()),
      bio: () => { if (s.bio) { s.bio = false; save("security"); toast("지문/Passkey 사용을 해제했습니다"); render(); } else PA.securitySetup(() => render(), "bio"); },
      securepw: () => {
        const go = () => { const m = modal(`<h3>보안 비밀번호 ${s.securePw ? "재설정" : "등록"}</h3><p class="lead">크레딧 보내기에 사용할 4자리 비밀번호</p><div data-a></div>`); PA.pinPad(m.el.querySelector("[data-a]"), { confirm: true, len: 4, label: "새 보안 비밀번호 4자리", onDone: (v) => { s.securePw = v; save("security"); m.close(); toast("보안 비밀번호가 저장되었습니다"); render(); } }); };
        s.securePw ? quickAuth(go, "기존 인증 확인") : go();
      },
    };
    function setPin() { const m = modal(`<h3>PIN 번호 설정</h3><p class="lead">6자리 PIN을 두 번 입력하세요.</p><div data-a></div>`); PA.pinPad(m.el.querySelector("[data-a]"), { confirm: true, onDone: (v) => { s.pin = v; save("security"); m.close(); toast("PIN이 저장되었습니다"); render(); } }); }
    function setPattern() { const m = modal(`<h3>패턴 설정</h3><p class="lead">4개 이상의 점을 연결해 두 번 그려주세요.</p><div data-a></div>`); PA.patternPad(m.el.querySelector("[data-a]"), { confirm: true, onDone: (v) => { s.pattern = v; save("security"); m.close(); toast("패턴이 저장되었습니다"); render(); } }); }

    $$("[data-m]", app).forEach((b) => (b.onclick = () => handlers[b.dataset.m] && handlers[b.dataset.m]()));
    $$("[data-set]", app).forEach((i) => (i.onchange = () => { state.settings[i.dataset.set] = i.checked; save("settings"); toast("설정이 저장되었습니다"); }));
    $$("[data-app]", app).forEach((b) => (b.onclick = () => requireAuth(() => {
      const list = store.get("apps", ["Discord"]), n = b.dataset.app;
      const on = list.includes(n);
      store.set("apps", on ? list.filter((x) => x !== n) : [...list, n]);
      toast(on ? `${n} 연결을 해제했습니다` : `${n} 계정이 연결되었습니다`); render();
    })));
    const r = $("#resetDemo", app); r && (r.onclick = () => { localStorage.clear(); sessionStorage.clear(); location.hash = "#/"; location.reload(); });
    const o = $("#oss", app); o && (o.onclick = () => { const m = modal(`<h3>오픈소스 라이선스</h3><div class="policy-box">Inter — SIL Open Font License 1.1<br/>JetBrains Mono — SIL Open Font License 1.1<br/>Noto Sans KR — SIL Open Font License 1.1</div>`); });
  }
})();
