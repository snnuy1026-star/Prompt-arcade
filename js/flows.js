/* =========================================================
   PromptArcade — Flows
   IA: 스플래쉬 → 튜토리얼 → 로그인/회원가입 → 인증 → 프로모션 팝업 → 홈
   ========================================================= */
(() => {
  const { $, $$, state, save, store, modal, swap, toast, esc, num, k, earn, spend, media, avatar, logoHTML, action, renderAuth, render } = PA;

  /* ======================= Splash & Tutorial ======================= */
  function boot() {
    const first = !sessionStorage.getItem("pa:splashed");
    if (!first) return afterSplash();
    sessionStorage.setItem("pa:splashed", "1");
    const s = $("#splash");
    s.hidden = false;
    setTimeout(() => { s.classList.add("out"); setTimeout(() => { s.hidden = true; afterSplash(); }, 600); }, 2400);
  }
  function afterSplash() {
    if (!store.get("onboarded", false)) tutorial();
  }

  const TUT = [
    { e: "🌌", t: "Infinite Games, Created by AI", d: "모든 플레이어가 서로 다른 엔딩과 세계를 만나는 무한 생성형 아케이드에 오신 것을 환영합니다." },
    { e: "⚡", t: "3초 즉시 실행", d: "다운로드 없이 WebAssembly + WebGPU로 브라우저에서 바로 플레이하세요. 카드를 누르면 3초 안에 세계가 열립니다." },
    { e: "⑂", t: "Fork & Remix", d: "마음에 드는 세계선(Timeline)을 포크해 이어서 플레이하거나 나만의 규칙으로 리믹스하세요." },
    { e: "🧠", t: "살아있는 NPC", d: "NPC는 당신이 떠난 뒤에도 대화하고 관계를 맺으며 세력을 키웁니다. 돌아오면 세계가 달라져 있을 거예요." },
  ];
  function tutorial() {
    let i = 0;
    const m = modal("", { cls: "tutorial", onClose: () => store.set("onboarded", true) });
    const draw = () => {
      const s = TUT[i];
      swap(m, `
        <div class="tut-visual"><div class="big">${s.e}</div></div>
        <div class="tut-body">
          <div class="modal-steps">${TUT.map((_, j) => `<i class="${j <= i ? "on" : ""}"></i>`).join("")}</div>
          <h3>${s.t}</h3>
          <p>${s.d}</p>
          <div class="tut-foot">
            <button class="btn btn-text" data-t="skip">건너뛰기</button>
            <div style="display:flex;gap:8px">
              ${i > 0 ? '<button class="btn btn-ghost" data-t="prev">이전</button>' : ""}
              <button class="btn btn-primary" data-t="next">${i === TUT.length - 1 ? "시작하기" : "다음"}</button>
            </div>
          </div>
        </div>`);
      m.el.querySelector('[data-t="skip"]').onclick = m.close;
      const p = m.el.querySelector('[data-t="prev"]'); p && (p.onclick = () => { i--; draw(); });
      m.el.querySelector('[data-t="next"]').onclick = () => {
        if (i < TUT.length - 1) { i++; draw(); } else { m.close(); openAuth("signup"); }
      };
    };
    draw();
  }

  /* ======================= Auth ======================= */
  function requireAuth(next) {
    if (state.user) return next && next();
    toast("로그인이 필요한 기능입니다", "warn");
    openAuth("login", next);
  }

  function openAuth(mode = "login", next) {
    const m = modal("");
    const draw = () => {
      swap(m, `
        <div style="display:flex;justify-content:center;margin-bottom:18px" data-logo="sm">${logoHTML}</div>
        <div class="seg"><button data-mode="login" class="${mode === "login" ? "active" : ""}">로그인</button><button data-mode="signup" class="${mode === "signup" ? "active" : ""}">회원가입</button></div>
        ${mode === "login" ? loginForm() : signupForm()}
      `);
      $$("[data-mode]", m.el).forEach((b) => (b.onclick = () => { mode = b.dataset.mode; draw(); }));
      mode === "login" ? bindLogin() : bindSignup();
    };
    const social = `<div class="social"><button data-social="Google">Google</button><button data-social="Discord">Discord</button><button data-social="Twitch">Twitch</button></div><div class="divider">또는 이메일로 계속</div>`;
    const loginForm = () => `
      <form class="stack" novalidate>
        ${social}
        <div><label class="field-label">이메일</label><input class="input" name="email" type="email" placeholder="you@example.com" autocomplete="email" /><div class="err-text"></div></div>
        <div><label class="field-label">비밀번호</label><input class="input" name="pw" type="password" placeholder="••••••••" autocomplete="current-password" /><div class="err-text"></div></div>
        <div class="row-between"><label class="check"><input type="checkbox" checked /> 로그인 상태 유지</label><a href="#" class="link" data-forgot>비밀번호 찾기</a></div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">로그인</button>
        <p class="muted" style="font-size:12px;text-align:center">데모: 아무 이메일 / 6자 이상 비밀번호로 로그인됩니다.</p>
      </form>`;
    const signupForm = () => `
      <form class="stack" novalidate>
        ${social}
        <div><label class="field-label">닉네임 (핸들)</label><input class="input" name="handle" placeholder="player_one" /><div class="err-text"></div></div>
        <div><label class="field-label">이메일</label><input class="input" name="email" type="email" placeholder="you@example.com" /><div class="err-text"></div></div>
        <div><label class="field-label">비밀번호 (8자 이상)</label><input class="input" name="pw" type="password" placeholder="••••••••" /><div class="err-text"></div></div>
        <div class="card" style="padding:14px;display:grid;gap:10px">
          <label class="check"><input type="checkbox" data-all /> <b>전체 동의</b></label>
          <label class="check"><input type="checkbox" data-req /> [필수] 서비스 이용약관 <a href="#" class="link" data-policy="terms" style="margin-left:auto">보기</a></label>
          <label class="check"><input type="checkbox" data-req /> [필수] 개인정보 처리방침 <a href="#" class="link" data-policy="privacy" style="margin-left:auto">보기</a></label>
          <label class="check"><input type="checkbox" data-opt /> [선택] 이벤트·크레딧 혜택 알림 수신</label>
          <div class="err-text" data-policy-err></div>
        </div>
        <button class="btn btn-primary btn-block btn-lg" type="submit">가입하고 500 Cr 받기</button>
      </form>`;

    function bindSocial() {
      $$("[data-social]", m.el).forEach((b) => (b.onclick = () => {
        const handle = "player_" + Math.floor(Math.random() * 900 + 100);
        login({ handle, email: `${handle}@${b.dataset.social.toLowerCase()}.com`, name: handle, via: b.dataset.social });
      }));
    }
    function fieldErr(input, msg) {
      input.classList.toggle("err", !!msg);
      input.nextElementSibling.textContent = msg || "";
      return !msg;
    }
    function bindLogin() {
      bindSocial();
      m.el.querySelector("[data-forgot]").onclick = (e) => { e.preventDefault(); forgotPassword(); };
      m.el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        const f = e.target, em = f.email, pw = f.pw;
        const ok1 = fieldErr(em, /^\S+@\S+\.\S+$/.test(em.value) ? "" : "올바른 이메일을 입력하세요");
        const ok2 = fieldErr(pw, pw.value.length >= 6 ? "" : "비밀번호는 6자 이상입니다");
        if (!ok1 || !ok2) return;
        const handle = em.value.split("@")[0].replace(/[^\w]/g, "").slice(0, 16) || "player";
        login({ handle, email: em.value, name: handle });
      };
    }
    function bindSignup() {
      bindSocial();
      const all = m.el.querySelector("[data-all]");
      const boxes = $$("[data-req],[data-opt]", m.el);
      all.onchange = () => boxes.forEach((b) => (b.checked = all.checked));
      boxes.forEach((b) => (b.onchange = () => (all.checked = boxes.every((x) => x.checked))));
      $$("[data-policy]", m.el).forEach((a) => (a.onclick = (e) => { e.preventDefault(); policy(a.dataset.policy); }));
      m.el.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        const f = e.target;
        const a = fieldErr(f.handle, /^\w{3,16}$/.test(f.handle.value) ? "" : "영문/숫자/_ 3~16자");
        const b = fieldErr(f.email, /^\S+@\S+\.\S+$/.test(f.email.value) ? "" : "올바른 이메일을 입력하세요");
        const c = fieldErr(f.pw, f.pw.value.length >= 8 ? "" : "8자 이상 입력하세요");
        const reqOk = $$("[data-req]", m.el).every((x) => x.checked);
        m.el.querySelector("[data-policy-err]").textContent = reqOk ? "" : "필수 약관에 동의해주세요";
        if (!(a && b && c && reqOk)) return;
        verifyEmail(m, { handle: f.handle.value, email: f.email.value, name: f.handle.value });
      };
    }

    function login(user) {
      m.close();
      state.user = user;
      save("user");
      renderAuth();
      toast(`환영합니다, @${user.handle}!`);
      postLogin(next);
    }
    draw();
  }

  /* 인증메일 발송안내 */
  function verifyEmail(m, user) {
    let sec = 60;
    swap(m, `
      <div style="text-align:center">
        <div style="font-size:56px;margin:6px 0 10px">📨</div>
        <h3>인증 메일을 보냈어요</h3>
        <p class="lead"><b style="color:#fff">${esc(user.email)}</b> 으로 발송된 링크를 눌러 이메일 인증을 완료해주세요.</p>
        <div class="stack">
          <button class="btn btn-primary btn-block btn-lg" data-v="done">인증을 완료했어요</button>
          <button class="btn btn-ghost btn-block" data-v="resend" disabled>재발송 (<span>60</span>s)</button>
        </div>
        <p class="muted" style="font-size:12px;margin-top:14px">메일이 보이지 않으면 스팸함을 확인해주세요.</p>
      </div>`);
    const rs = m.el.querySelector('[data-v="resend"]');
    const t = setInterval(() => {
      sec--; rs.querySelector("span") && (rs.querySelector("span").textContent = sec);
      if (sec <= 0) { clearInterval(t); rs.disabled = false; rs.textContent = "인증 메일 재발송"; }
    }, 1000);
    rs.onclick = () => toast("인증 메일을 다시 보냈어요");
    m.el.querySelector('[data-v="done"]').onclick = () => {
      clearInterval(t);
      m.close();
      state.user = { ...user, verified: true, joined: PA.now().slice(0, 10) };
      save("user");
      renderAuth();
      toast("이메일 인증 완료!");
      securitySetup(() => promo());
    };
  }

  function forgotPassword() {
    const m = modal(`
      <h3>비밀번호 찾기</h3>
      <p class="lead">가입한 이메일로 재설정 링크를 보내드립니다.</p>
      <form class="stack"><div><label class="field-label">이메일</label><input class="input" name="email" type="email" placeholder="you@example.com" /><div class="err-text"></div></div>
      <button class="btn btn-primary btn-block">재설정 링크 보내기</button></form>`);
    m.el.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const em = e.target.email;
      if (!/^\S+@\S+\.\S+$/.test(em.value)) { em.classList.add("err"); em.nextElementSibling.textContent = "올바른 이메일을 입력하세요"; return; }
      swap(m, `<div style="text-align:center"><div style="font-size:52px">🔑</div><h3>메일을 확인하세요</h3><p class="lead">${esc(em.value)} 으로 비밀번호 재설정 링크를 보냈습니다. 링크는 30분간 유효합니다.</p><button class="btn btn-primary btn-block" data-ok>확인</button></div>`);
      m.el.querySelector("[data-ok]").onclick = m.close;
    };
  }

  /* 서비스 정책 */
  function policy(kind = "terms") {
    const title = kind === "terms" ? "서비스 이용약관" : kind === "privacy" ? "개인정보 처리방침" : "서비스 정책";
    const m = modal(`
      <h3>${title}</h3><p class="lead">시행일 2026.10.01</p>
      <div class="policy-box">
        <p><b>제1조 (목적)</b> 본 약관은 PromptArcade(이하 "플랫폼")가 제공하는 생성형 AI 게임 스트리밍 서비스의 이용 조건을 규정합니다.</p><br/>
        <p><b>제2조 (컴퓨팅 크레딧)</b> 실시간 추론 연산에 소모되는 GPU 리소스는 Compute Credit(Cr) 단위로 과금되며, 무료 쿼터는 매월 초기화됩니다.</p><br/>
        <p><b>제3조 (생성 콘텐츠의 권리)</b> 유저가 발행한 세계선(Timeline)과 프롬프트 시드의 저작권은 유저에게 귀속되며, 포크 허용 시 원작자 로열티 정책이 적용됩니다.</p><br/>
        <p><b>제4조 (수수료)</b> 마켓플레이스 거래 및 리믹스 수익에 대해 플랫폼은 15~20%의 수수료를 취득합니다.</p><br/>
        <p><b>제5조 (프롬프트 인젝션)</b> 관전자 인젝션은 커뮤니티 가이드라인을 준수해야 하며, 유해 프롬프트는 자동 필터링됩니다.</p>
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:18px" data-ok>확인</button>`);
    m.el.querySelector("[data-ok]").onclick = m.close;
  }

  function postLogin(next) {
    const sec = state.security;
    if (sec.pin || sec.pattern || sec.bio) {
      quickAuth(() => { maybePromo(next); });
    } else {
      securitySetup(() => maybePromo(next));
    }
  }
  function maybePromo(next) {
    if (!state.promoClaimed && !store.get("promoHideToday", "") .startsWith(PA.now().slice(0, 10))) promo(next);
    else { next && next(); render(); }
  }

  /* ======================= 인증 (PIN / 패턴 / 지문) ======================= */
  function securitySetup(done, preset) {
    let method = preset || "pin";
    const m = modal("", { onClose: () => {} });
    const draw = () => {
      swap(m, `
        <div class="modal-steps"><i class="on"></i><i class="on"></i><i></i></div>
        <h3>간편 인증 설정</h3>
        <p class="lead">결제·크레딧 보내기·세계선 발행 시 사용할 인증 수단을 등록하세요.</p>
        <div class="method-cards">
          <button data-m="pin" class="${method === "pin" ? "active" : ""}"><i>🔢</i>PIN 번호</button>
          <button data-m="pattern" class="${method === "pattern" ? "active" : ""}"><i>⠿</i>패턴</button>
          <button data-m="bio" class="${method === "bio" ? "active" : ""}"><i>👆</i>지문 / Passkey</button>
        </div>
        <div data-area></div>
        <button class="btn btn-text btn-block" data-skip style="margin-top:8px">나중에 설정</button>`);
      $$("[data-m]", m.el).forEach((b) => (b.onclick = () => { method = b.dataset.m; draw(); }));
      m.el.querySelector("[data-skip]").onclick = () => { m.close(); done && done(); };
      const area = m.el.querySelector("[data-area]");
      const finish = (msg) => { toast(msg); m.close(); done && done(); };
      if (method === "pin") pinPad(area, { confirm: true, onDone: (pin) => { state.security.pin = pin; save("security"); finish("PIN이 등록되었습니다"); } });
      if (method === "pattern") patternPad(area, { confirm: true, onDone: (p) => { state.security.pattern = p; save("security"); finish("패턴이 등록되었습니다"); } });
      if (method === "bio") bioPad(area, () => { state.security.bio = true; save("security"); finish("지문/Passkey가 등록되었습니다"); });
    };
    draw();
  }

  /* quick auth for returning users / sensitive actions */
  function quickAuth(ok, title = "본인 인증") {
    const sec = state.security;
    const methods = ["pin", "pattern", "bio"].filter((x) => (x === "bio" ? sec.bio : sec[x]));
    if (!methods.length) return securitySetup(ok);
    let method = methods[0];
    const m = modal("");
    const draw = () => {
      swap(m, `
        <h3>${title}</h3><p class="lead">등록된 인증 수단으로 확인해주세요.</p>
        ${methods.length > 1 ? `<div class="seg">${methods.map((x) => `<button data-m="${x}" class="${x === method ? "active" : ""}">${{ pin: "PIN", pattern: "패턴", bio: "지문" }[x]}</button>`).join("")}</div>` : ""}
        <div data-area></div>`);
      $$("[data-m]", m.el).forEach((b) => (b.onclick = () => { method = b.dataset.m; draw(); }));
      const area = m.el.querySelector("[data-area]");
      const pass = () => { m.close(); ok && ok(); };
      if (method === "pin") pinPad(area, { verify: sec.pin, onDone: pass });
      if (method === "pattern") patternPad(area, { verify: sec.pattern, onDone: pass });
      if (method === "bio") bioPad(area, pass);
    };
    draw();
  }

  function pinPad(area, { confirm = false, verify = null, onDone, len = 6, label }) {
    let val = "", first = null, tries = 0;
    area.innerHTML = `
      <p data-l style="text-align:center;font-size:14px;color:#cfd5e0">${label || (verify ? "PIN 6자리를 입력하세요" : "새 PIN 6자리를 입력하세요")}</p>
      <div class="pin-dots">${"<i></i>".repeat(len)}</div>
      <div class="keypad">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-k="${n}">${n}</button>`).join("")}<button data-k="clr" style="font-size:13px">전체삭제</button><button data-k="0">0</button><button data-k="del">⌫</button></div>
      ${verify ? '<p class="muted" style="font-size:12px;text-align:center;margin-top:12px">데모 힌트: 등록한 PIN을 입력하세요</p>' : ""}`;
    const dots = area.querySelector(".pin-dots"), lab = area.querySelector("[data-l]");
    const paint = () => $$("i", dots).forEach((d, i) => d.classList.toggle("on", i < val.length));
    const fail = (msg) => { dots.classList.add("shake"); lab.textContent = msg; lab.style.color = "var(--red)"; setTimeout(() => { dots.classList.remove("shake"); val = ""; paint(); }, 400); };
    const press = (key) => {
      if (key === "del") val = val.slice(0, -1);
      else if (key === "clr") val = "";
      else if (val.length < len) val += key;
      paint();
      if (val.length === len) setTimeout(() => {
        if (verify) {
          if (val === verify) onDone(val);
          else { tries++; fail(`PIN이 일치하지 않습니다 (${tries}/5)`); }
        } else if (confirm && first === null) {
          first = val; val = ""; paint(); lab.textContent = "한 번 더 입력해 확인해주세요"; lab.style.color = "";
        } else if (confirm && val !== first) {
          first = null; fail("PIN이 일치하지 않습니다. 처음부터 다시 입력하세요");
        } else onDone(val);
      }, 120);
    };
    $$("[data-k]", area).forEach((b) => (b.onclick = () => press(b.dataset.k)));
    const kh = (e) => { if (!area.isConnected) return document.removeEventListener("keydown", kh); if (/^\d$/.test(e.key)) press(e.key); if (e.key === "Backspace") press("del"); };
    document.addEventListener("keydown", kh);
  }

  function patternPad(area, { confirm = false, verify = null, onDone }) {
    let path = [], first = null, drawing = false;
    area.innerHTML = `
      <p data-l style="text-align:center;font-size:14px;color:#cfd5e0">${verify ? "패턴을 그려주세요" : "4개 이상의 점을 연결하세요"}</p>
      <div class="pattern"><svg></svg>${Array.from({ length: 9 }, (_, i) => `<span data-i="${i}"></span>`).join("")}</div>`;
    const pad = area.querySelector(".pattern"), svg = pad.querySelector("svg"), lab = area.querySelector("[data-l]");
    const center = (i) => { const s = pad.children[i + 1], r = pad.getBoundingClientRect(), b = s.getBoundingClientRect(); return [b.left - r.left + b.width / 2, b.top - r.top + b.height / 2]; };
    const drawLines = (extra) => {
      const pts = path.map(center); if (extra) pts.push(extra);
      svg.innerHTML = pts.length > 1 ? `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#22e4f5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>` : "";
    };
    const add = (el) => { const i = +el.dataset.i; if (!path.includes(i)) { path.push(i); el.classList.add("on"); } };
    const reset = () => { path = []; $$("span", pad).forEach((s) => s.classList.remove("on")); svg.innerHTML = ""; };
    pad.addEventListener("pointerdown", (e) => { const s = e.target.closest("span"); if (!s) return; reset(); drawing = true; pad.setPointerCapture(e.pointerId); add(s); drawLines(); });
    pad.addEventListener("pointermove", (e) => {
      if (!drawing) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && el.matches(".pattern span")) add(el);
      const r = pad.getBoundingClientRect(); drawLines([e.clientX - r.left, e.clientY - r.top]);
    });
    pad.addEventListener("pointerup", () => {
      if (!drawing) return; drawing = false; drawLines();
      const p = path.join("-");
      const err = (msg) => { lab.textContent = msg; lab.style.color = "var(--red)"; setTimeout(reset, 500); };
      if (path.length < 4) return err("최소 4개의 점을 연결해야 합니다");
      if (verify) return p === verify ? onDone(p) : err("패턴이 일치하지 않습니다");
      if (confirm && first === null) { first = p; lab.textContent = "확인을 위해 한 번 더 그려주세요"; lab.style.color = ""; return setTimeout(reset, 400); }
      if (confirm && p !== first) { first = null; return err("패턴이 다릅니다. 처음부터 다시 그려주세요"); }
      onDone(p);
    });
  }

  function bioPad(area, onDone) {
    area.innerHTML = `<div class="finger" data-f>👆</div><p data-l style="text-align:center;font-size:14px;color:#cfd5e0">센서를 눌러 지문 / Passkey 인증</p>`;
    const f = area.querySelector("[data-f]"), lab = area.querySelector("[data-l]");
    f.onclick = () => {
      if (f.classList.contains("scan")) return;
      f.classList.add("scan"); lab.textContent = "스캔 중…";
      setTimeout(() => { f.classList.remove("scan"); f.classList.add("done"); f.textContent = "✓"; lab.textContent = "인증 완료"; setTimeout(onDone, 500); }, 1500);
    };
  }

  /* ======================= 프로모션 팝업 ======================= */
  function promo(next) {
    const m = modal(`
      <div class="promo-visual">${media("hero")}</div>
      <div class="promo-body">
        <span class="badge new">WELCOME</span>
        <h3 style="margin-top:12px">30일 Risk-free 체험</h3>
        <div class="promo-amount">+500 Cr</div>
        <p class="lead" style="margin:6px 0 20px">무료 컴퓨팅 크레딧으로 고해상도 세션, 라이브 인젝션, 포크를 모두 체험해보세요. 다운로드는 필요 없습니다.</p>
        <button class="btn btn-primary btn-block btn-lg" data-claim>${state.promoClaimed ? "이미 받았어요 — 플레이하러 가기" : "500 Cr 받고 시작하기"}</button>
      </div>
      <div class="promo-foot"><button data-hide>오늘 하루 보지 않기</button><button data-close>닫기</button></div>`,
      { cls: "promo", onClose: () => { next && next(); render(); } });
    m.el.querySelector("[data-claim]").onclick = () => {
      if (!state.promoClaimed) { state.promoClaimed = true; save("promoClaimed"); earn(500, "신규 가입 보너스", "30일 Risk-free", "🎁"); toast("500 Cr이 지급되었습니다!"); }
      m.close();
      if (!next) location.hash = "#/explore";
    };
    m.el.querySelector("[data-hide]").onclick = () => { store.set("promoHideToday", PA.now()); m.close(); };
    m.el.querySelector("[data-close]").onclick = m.close;
  }

  /* ======================= Instant Play (3s boot) ======================= */
  function instantPlay(id) {
    const g = PA.GAMES.find((x) => x.id === id) || PA.GAMES[0];
    const el = document.createElement("div");
    el.className = "boot";
    el.innerHTML = `
      <div>
        <div class="boot-ring"><svg width="140" height="140"><circle class="bg" cx="70" cy="70" r="64"/><circle class="fg" cx="70" cy="70" r="64"/></svg><b>3</b></div>
        <h3 class="h3" style="margin-bottom:6px">${esc(g.title)}</h3>
        <p class="muted" style="margin-bottom:18px;font-size:14px">No download · WebAssembly + WebGPU</p>
        <div class="boot-log"></div>
        <button class="btn btn-text" data-cancel style="margin-top:10px">취소</button>
      </div>`;
    document.body.appendChild(el);
    const fg = el.querySelector(".fg"), num_ = el.querySelector(".boot-ring b"), log = el.querySelector(".boot-log");
    const steps = ["Allocating GPU node · Seoul-2 (21ms)", "Streaming WASM runtime · 4.2 MB", "Generating world state from prompt seed", "Waking Persistent Neural NPCs"];
    const start = performance.now(), D = 3000;
    let shown = 0, raf, cancelled = false;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / D);
      fg.style.strokeDashoffset = 402 * (1 - p);
      num_.textContent = Math.max(1, Math.ceil(3 - p * 3));
      const s = Math.floor(p * steps.length + 0.2);
      while (shown < Math.min(s, steps.length)) { const d = document.createElement("div"); d.textContent = steps[shown++]; log.appendChild(d); }
      if (p < 1) raf = requestAnimationFrame(tick);
      else { num_.textContent = "GO"; setTimeout(() => { el.remove(); if (!cancelled) location.hash = `#/play/${g.id}`; }, 350); }
    };
    raf = requestAnimationFrame(tick);
    el.querySelector("[data-cancel]").onclick = () => { cancelled = true; cancelAnimationFrame(raf); el.remove(); };
  }

  /* ======================= Wallet flows ======================= */
  /* 보내기: 보안비밀번호 → QR/ID 검색 → 이체 확인 */
  function sendCredits() {
    requireAuth(() => {
      if (!state.security.securePw) {
        const m = modal(`<div class="modal-steps"><i class="on"></i><i></i><i></i></div><h3>보안 비밀번호 등록</h3><p class="lead">크레딧 보내기에 사용할 4자리 보안 비밀번호를 등록하세요.</p><div data-area></div>`);
        pinPad(m.el.querySelector("[data-area]"), { confirm: true, len: 4, label: "보안 비밀번호 4자리", onDone: (pw) => { state.security.securePw = pw; save("security"); m.close(); toast("보안 비밀번호가 등록되었습니다"); recipientStep(); } });
      } else {
        const m = modal(`<div class="modal-steps"><i class="on"></i><i></i><i></i></div><h3>보안 비밀번호</h3><p class="lead">크레딧을 보내려면 보안 비밀번호를 입력하세요.</p><div data-area></div>`);
        pinPad(m.el.querySelector("[data-area]"), { verify: state.security.securePw, len: 4, label: "보안 비밀번호 4자리", onDone: () => { m.close(); recipientStep(); } });
      }
    });
  }
  function recipientStep() {
    const people = ["kairo", "lumen", "nyx", "voidtech", "revline", "cubix", "pixelpop", "sprout", "glitch_art"];
    const m = modal(`
      <div class="modal-steps"><i class="on"></i><i class="on"></i><i></i></div>
      <h3>받는 사람</h3><p class="lead">핸들로 검색하거나 QR 코드를 스캔하세요.</p>
      <div class="stack">
        <div class="mini-input"><input placeholder="@handle 검색" data-q /><button class="btn btn-ghost btn-sm" data-qr>QR 스캔</button></div>
        <div data-list style="display:grid;gap:4px;max-height:200px;overflow:auto"></div>
        <div><label class="field-label">보낼 크레딧</label><input class="input" data-amt type="number" min="1" placeholder="100" /><div class="err-text"></div></div>
        <div class="row-between muted" style="font-size:13px"><span>보유 ${num(state.credits)} Cr</span><span>수수료 0 Cr</span></div>
        <button class="btn btn-primary btn-block btn-lg" data-next disabled>다음</button>
      </div>`);
    let to = null;
    const list = m.el.querySelector("[data-list]"), q = m.el.querySelector("[data-q]"), amt = m.el.querySelector("[data-amt]"), next = m.el.querySelector("[data-next]");
    const draw = () => {
      const s = q.value.replace("@", "").toLowerCase();
      list.innerHTML = people.filter((p) => p.includes(s)).map((p) => `<button class="tx" data-p="${p}" style="grid-template-columns:32px 1fr auto;${to === p ? "background:var(--cyan-soft)" : ""}">${avatar(p)}<b>@${p}</b><small>${to === p ? "✓ 선택됨" : ""}</small></button>`).join("") || '<p class="muted" style="font-size:13px;padding:8px">검색 결과가 없습니다</p>';
      $$("[data-p]", list).forEach((b) => (b.onclick = () => { to = b.dataset.p; draw(); valid(); }));
    };
    const valid = () => { next.disabled = !(to && +amt.value > 0); };
    q.oninput = draw; amt.oninput = valid;
    m.el.querySelector("[data-qr]").onclick = () => {
      list.innerHTML = '<div style="padding:30px;text-align:center" class="muted"><div class="finger scan" style="width:80px;height:80px;font-size:34px">📷</div>QR 코드 검색 중…</div>';
      setTimeout(() => { to = "lumen"; q.value = "lumen"; draw(); valid(); toast("QR 인식: @lumen"); }, 1400);
    };
    next.onclick = () => {
      const a = +amt.value;
      if (a > state.credits) { amt.classList.add("err"); amt.nextElementSibling.textContent = "보유 크레딧을 초과했습니다"; return; }
      swap(m, `
        <div class="modal-steps"><i class="on"></i><i class="on"></i><i class="on"></i></div>
        <h3>이체 확인</h3><p class="lead">아래 내용으로 크레딧을 보낼까요?</p>
        <div class="card" style="padding:18px;margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">${avatar(to, "md")}<div><b>@${to}</b><div class="muted" style="font-size:13px">PromptArcade Creator</div></div></div>
          <div class="summary-row"><span>보낼 크레딧</span><b>${num(a)} Cr</b></div>
          <div class="summary-row"><span>수수료</span><span>0 Cr</span></div>
          <div class="summary-row total"><span>이체 후 잔액</span><span>${num(state.credits - a)} Cr</span></div>
        </div>
        <div style="display:flex;gap:10px"><button class="btn btn-ghost" style="flex:1" data-back>취소</button><button class="btn btn-primary" style="flex:2" data-send>${num(a)} Cr 보내기</button></div>`);
      m.el.querySelector("[data-back]").onclick = m.close;
      m.el.querySelector("[data-send]").onclick = () => {
        spend(a, `크레딧 보내기 → @${to}`, "선물", "↗", "out");
        swap(m, `<div style="text-align:center"><div style="font-size:60px">✅</div><h3>보내기 완료</h3><p class="lead">@${to} 님에게 ${num(a)} Cr을 보냈습니다.</p><button class="btn btn-primary btn-block" data-ok>확인</button></div>`);
        m.el.querySelector("[data-ok]").onclick = () => { m.close(); render(); };
      };
    };
    draw();
  }

  /* 지갑 QR코드 */
  function qrSvg(seed = "pa") {
    const n = 25; let r = hash(seed);
    function hash(s) { return [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7); }
    const rnd = () => ((r = (r * 1103515245 + 12345) >>> 0) / 2 ** 32);
    let cells = "";
    const finder = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7" fill="#0b1019"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" fill="#0b1019"/>`;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inF && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1" fill="#0b1019"/>`;
    }
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges">${cells}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}<rect x="10" y="10" width="5" height="5" fill="#22e4f5"/></svg>`;
  }
  function walletQR() {
    requireAuth(() => {
      const h = state.user.handle;
      const m = modal(`
        <div style="text-align:center">
          <h3>내 지갑 QR코드</h3><p class="lead">상대방이 스캔하면 바로 크레딧을 받을 수 있어요.</p>
          <div class="qr">${qrSvg(h)}</div>
          <p style="margin-top:16px;font-family:var(--mono);font-size:13px" class="muted">pa://wallet/@${esc(h)}</p>
          <div style="display:flex;gap:10px;margin-top:18px"><button class="btn btn-ghost" style="flex:1" data-copy>주소 복사</button><button class="btn btn-primary" style="flex:1" data-ok>닫기</button></div>
        </div>`);
      m.el.querySelector("[data-copy]").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(`pa://wallet/@${h}`); toast("지갑 주소가 복사되었습니다"); };
      m.el.querySelector("[data-ok]").onclick = m.close;
    });
  }

  /* 입출금 상세 */
  function txDetail(id) {
    const t = state.tx.find((x) => x.id === id);
    if (!t) return;
    const kindLabel = { use: "사용", in: "입금", out: "출금" }[t.kind];
    const m = modal(`
      <div style="text-align:center;margin-bottom:18px">
        <div class="tx-ico" style="width:56px;height:56px;margin:0 auto 12px;font-size:26px">${t.icon}</div>
        <div class="muted" style="font-size:13px">${esc(t.title)}</div>
        <div style="font-size:34px;font-weight:800;font-family:var(--mono)" class="${t.amt > 0 ? "amt plus" : ""}">${t.amt > 0 ? "+" : ""}${num(t.amt)} Cr</div>
      </div>
      <div class="card" style="padding:6px 18px">
        <div class="summary-row"><span class="muted">거래 유형</span><span>${kindLabel}</span></div>
        <div class="summary-row"><span class="muted">상세</span><span>${esc(t.sub)}</span></div>
        <div class="summary-row"><span class="muted">일시</span><span>${t.date}</span></div>
        <div class="summary-row"><span class="muted">거래 ID</span><span style="font-family:var(--mono);font-size:12px">${t.id.toUpperCase()}-${(t.date || "").replace(/\D/g, "").slice(-6)}</span></div>
        <div class="summary-row"><span class="muted">상태</span><span style="color:var(--green)">완료</span></div>
      </div>
      <button class="btn btn-ghost btn-block" style="margin-top:16px" data-ok>닫기</button>`);
    m.el.querySelector("[data-ok]").onclick = m.close;
  }

  /* ======================= Global actions ======================= */
  action("login", () => openAuth("login"));
  action("signup", () => openAuth("signup"));
  action("get-started", () => (state.user ? (location.hash = "#/explore") : openAuth("signup")));
  action("logout", () => { state.user = null; save("user"); renderAuth(); toast("로그아웃 되었습니다"); location.hash = "#/"; });
  action("play", (el) => instantPlay(el.dataset.id));
  action("send", sendCredits);
  action("qr", walletQR);
  action("tx", (el) => txDetail(el.dataset.id));
  action("policy", (el) => policy(el.dataset.kind));
  action("tutorial", tutorial);

  Object.assign(PA, { boot, openAuth, requireAuth, securitySetup, quickAuth, pinPad, patternPad, bioPad, promo, instantPlay, sendCredits, walletQR, txDetail, forgotPassword, policy, qrSvg });
})();
