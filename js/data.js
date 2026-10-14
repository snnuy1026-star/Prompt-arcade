/* =========================================================
   PromptArcade — Mock data
   ========================================================= */
window.PA = window.PA || {};

/* Image map — id -> path (ext/suffix adjusted to match generated assets) */
PA.IMG = {
  hero: "assets/img/hero.jpg",
  "neon-drift-city": "assets/img/neon-drift-city.jpg",
  "ember-crown": "assets/img/ember-crown.jpg",
  "hollow-ward": "assets/img/hollow-ward.jpg",
  "orbit-salvage": "assets/img/orbit-salvage.jpg",
  "turbo-mirage": "assets/img/turbo-mirage.jpg",
  "prism-lock": "assets/img/prism-lock.jpg",
  "8bit-dungeon": "assets/img/8bit-dungeon.jpg",
  "moss-hollow-farm": "assets/img/moss-hollow-farm.jpg",
  "abyssal-ruins": "assets/img/abyssal-ruins.jpg",
  "ronin-bamboo": "assets/img/ronin-bamboo.jpg",
  /* TODO: regenerate when image quota resets — styled fallbacks are used meanwhile */
  "iron-titans": null,
  "phantom-carnival": null,
};
PA.FALLBACK_ART = {
  "iron-titans": { emoji: "🤖", bg: "radial-gradient(circle at 70% 30%,#ff7a3d55,transparent 40%),linear-gradient(160deg,#3a3f4a,#14161c 60%,#4a2412)" },
  "phantom-carnival": { emoji: "🎡", bg: "radial-gradient(circle at 50% 35%,#ff4fd866,transparent 45%),linear-gradient(160deg,#2a0f4a,#0b0614 60%,#0f3a4a)" },
};

PA.GENRES = ["All", "Cyberpunk", "Fantasy RPG", "Horror", "Sci-Fi", "Racing", "Puzzle", "Pixel Retro", "Cozy Sim"];

/* fallback gradients for each genre (if image missing) */
PA.GENRE_FALLBACK = {
  Cyberpunk: "linear-gradient(135deg,#3a0f5c,#0b3a52)",
  "Fantasy RPG": "linear-gradient(135deg,#6b2f0f,#2a1440)",
  Horror: "linear-gradient(135deg,#0f2a1a,#050a08)",
  "Sci-Fi": "linear-gradient(135deg,#0d2450,#04070f)",
  Racing: "linear-gradient(135deg,#5a1a6b,#d1477a)",
  Puzzle: "linear-gradient(135deg,#3b1f8a,#0f9fb0)",
  "Pixel Retro": "linear-gradient(135deg,#2a2a3a,#0f5a3a)",
  "Cozy Sim": "linear-gradient(135deg,#d99a6c,#6b9c5a)",
};

PA.GAMES = [
  {
    id: "neon-drift-city", title: "Neon Drift City", genre: "Cyberpunk", tags: ["Cyberpunk", "Open World", "Exploration"],
    creator: "kairo", badge: "PRO", likes: 1200, plays: 12400, viewers: 342, rating: 4.8, cost: 25, forks: 342, version: "v1.3", gen: 3, live: true,
    prompt: "A rain-soaked neon metropolis at dusk, synthwave sun, lone runner exploring alleys. NPC factions trade secrets; weather reacts to the city's mood.",
    desc: "비에 젖은 네온 메트로폴리스. 플레이어의 선택에 따라 거리의 세력 구도와 날씨가 실시간으로 재구성됩니다.",
    npcs: [
      { name: "Vex", role: "Info Broker", mood: "Suspicious", trust: 42, emoji: "🕶️" },
      { name: "Mira-7", role: "Rogue Android", mood: "Curious", trust: 68, emoji: "🤖" },
      { name: "Old Sato", role: "Noodle Vendor", mood: "Warm", trust: 85, emoji: "🍜" },
    ],
  },
  {
    id: "ember-crown", title: "Ember Crown", genre: "Fantasy RPG", tags: ["Fantasy RPG", "Dragons", "Story"],
    creator: "lumen", badge: "AI", likes: 940, plays: 8100, viewers: 210, rating: 4.7, cost: 30, forks: 188, version: "v2.0", gen: 3, live: true,
    prompt: "A crumbling kingdom ruled by a dragon who remembers every hero that failed. Quests rewrite themselves around the player's lineage.",
    desc: "모든 실패한 영웅을 기억하는 드래곤의 왕국. 퀘스트가 플레이어의 혈통과 선택에 맞춰 다시 쓰여집니다.",
    npcs: [
      { name: "Ashvyre", role: "Ancient Dragon", mood: "Amused", trust: 20, emoji: "🐉" },
      { name: "Sir Hale", role: "Fallen Knight", mood: "Bitter", trust: 51, emoji: "🛡️" },
      { name: "Wren", role: "Court Mage", mood: "Anxious", trust: 74, emoji: "🔮" },
    ],
  },
  {
    id: "hollow-ward", title: "Hollow Ward", genre: "Horror", tags: ["Horror", "Psychological", "Survival"],
    creator: "nyx", badge: "PRO", likes: 780, plays: 6500, viewers: 188, rating: 4.6, cost: 20, forks: 97, version: "v1.1", gen: 2, live: true,
    prompt: "An abandoned hospital that learns your fears from your voice. Corridors rearrange when you aren't looking.",
    desc: "플레이어의 목소리에서 공포를 학습하는 폐병원. 시선을 돌리면 복도가 재배치됩니다.",
    npcs: [
      { name: "Nurse Ilse", role: "Night Shift", mood: "Unsettling", trust: 12, emoji: "🩺" },
      { name: "Patient 9", role: "Survivor", mood: "Terrified", trust: 60, emoji: "🫣" },
      { name: "The Voice", role: "Intercom", mood: "Hungry", trust: 0, emoji: "📢" },
    ],
  },
  {
    id: "orbit-salvage", title: "Orbit Salvage", genre: "Sci-Fi", tags: ["Sci-Fi", "Survival", "Co-op"],
    creator: "voidtech", badge: "AI", likes: 1500, plays: 15200, viewers: 405, rating: 4.9, cost: 35, forks: 512, version: "v3.2", gen: 3, live: true,
    prompt: "Salvage crews strip derelict stations above a dying gas giant. The station AI negotiates, lies, and remembers each crew.",
    desc: "죽어가는 가스 행성 위 버려진 정거장을 해체하는 샐비지 크루. 정거장 AI는 협상하고, 거짓말하고, 모든 크루를 기억합니다.",
    npcs: [
      { name: "HALCYON", role: "Station AI", mood: "Calculating", trust: 33, emoji: "🛰️" },
      { name: "Juno", role: "Engineer", mood: "Optimistic", trust: 79, emoji: "🔧" },
      { name: "Dekker", role: "Rival Captain", mood: "Hostile", trust: 15, emoji: "🚀" },
    ],
  },
  {
    id: "turbo-mirage", title: "Turbo Mirage", genre: "Racing", tags: ["Racing", "Synthwave", "Arcade"],
    creator: "revline", badge: "AI", likes: 890, plays: 9300, viewers: 156, rating: 4.5, cost: 15, forks: 140, version: "v1.6", gen: 2, live: true,
    prompt: "Endless synthwave highway generated to the beat of your music. Rivals adapt to your driving style lap by lap.",
    desc: "음악 비트에 맞춰 무한 생성되는 신스웨이브 하이웨이. 라이벌은 랩마다 당신의 주행 스타일에 적응합니다.",
    npcs: [
      { name: "Nova", role: "Rival Racer", mood: "Cocky", trust: 30, emoji: "🏎️" },
      { name: "DJ Pulse", role: "Radio Host", mood: "Hyped", trust: 88, emoji: "🎧" },
      { name: "Grease", role: "Mechanic", mood: "Gruff", trust: 64, emoji: "🧰" },
    ],
  },
  {
    id: "prism-lock", title: "Prism Lock", genre: "Puzzle", tags: ["Puzzle", "Relaxing", "Logic"],
    creator: "cubix", badge: "PRO", likes: 620, plays: 4800, viewers: 64, rating: 4.6, cost: 10, forks: 76, version: "v1.0", gen: 1, live: false,
    prompt: "Floating crystal puzzles that grow harder exactly as fast as you get better. No two solutions are ever the same.",
    desc: "실력이 늘어나는 속도에 맞춰 정확히 어려워지는 크리스털 퍼즐. 같은 해답은 두 번 나오지 않습니다.",
    npcs: [
      { name: "Lumi", role: "Guide Spirit", mood: "Gentle", trust: 90, emoji: "✨" },
      { name: "Cipher", role: "Puzzle Keeper", mood: "Smug", trust: 40, emoji: "🧩" },
      { name: "Echo", role: "Mirror Self", mood: "Mimicking", trust: 50, emoji: "🪞" },
    ],
  },
  {
    id: "8bit-dungeon", title: "8-Bit Dungeon", genre: "Pixel Retro", tags: ["Pixel Retro", "Roguelike", "Action"],
    creator: "pixelpop", badge: "AI", likes: 1100, plays: 11000, viewers: 230, rating: 4.7, cost: 12, forks: 301, version: "v2.4", gen: 2, live: true,
    prompt: "A roguelike dungeon where slimes gossip about your last run and the dungeon master rewrites floors out of spite.",
    desc: "슬라임들이 지난 플레이를 수다로 전하고, 던전 마스터가 앙심을 품고 층을 다시 쓰는 로그라이크.",
    npcs: [
      { name: "Gloop", role: "Gossip Slime", mood: "Chatty", trust: 70, emoji: "🟢" },
      { name: "DM Grim", role: "Dungeon Master", mood: "Spiteful", trust: 10, emoji: "💀" },
      { name: "Pip", role: "Shopkeeper", mood: "Greedy", trust: 55, emoji: "🪙" },
    ],
  },
  {
    id: "moss-hollow-farm", title: "Moss Hollow Farm", genre: "Cozy Sim", tags: ["Cozy Sim", "Farming", "Life"],
    creator: "sprout", badge: "PRO", likes: 1400, plays: 13700, viewers: 120, rating: 4.9, cost: 8, forks: 420, version: "v1.8", gen: 2, live: true,
    prompt: "A cozy valley where villagers keep living, gardening, and falling in love even after you log off.",
    desc: "로그아웃 후에도 주민들이 계속 살아가고, 정원을 가꾸고, 사랑에 빠지는 아늑한 골짜기.",
    npcs: [
      { name: "Hazel", role: "Baker", mood: "Cheerful", trust: 82, emoji: "🥐" },
      { name: "Bramble", role: "Grumpy Goat", mood: "Grumpy", trust: 35, emoji: "🐐" },
      { name: "Tomo", role: "Fisher", mood: "Calm", trust: 66, emoji: "🎣" },
    ],
  },
  {
    id: "abyssal-ruins", title: "Abyssal Ruins", genre: "Fantasy RPG", tags: ["Fantasy RPG", "Underwater", "Exploration"],
    creator: "tidal", badge: "AI", likes: 540, plays: 3900, viewers: 72, rating: 4.4, cost: 18, forks: 45, version: "v0.9", gen: 3, live: true,
    prompt: "A sunken civilization whose murals change to depict what the diver did on the surface.",
    desc: "다이버가 수면 위에서 한 일을 벽화로 바꾸어 그리는 가라앉은 문명.", npcs: [],
  },
  {
    id: "ronin-bamboo", title: "Ronin of Bamboo", genre: "Fantasy RPG", tags: ["Action", "Samurai", "Story"],
    creator: "kazeai", badge: "PRO", likes: 870, plays: 7200, viewers: 98, rating: 4.7, cost: 22, forks: 130, version: "v1.2", gen: 3, live: true,
    prompt: "A masterless samurai whose honor score reshapes allies, enemies, and the forest itself.",
    desc: "명예 수치가 동료, 적, 그리고 숲 자체를 재구성하는 주인 없는 사무라이.", npcs: [],
  },
  {
    id: "iron-titans", title: "Iron Titans", genre: "Sci-Fi", tags: ["Sci-Fi", "Mech", "PvP"],
    creator: "mechlab", badge: "AI", likes: 1300, plays: 10800, viewers: 312, rating: 4.6, cost: 28, forks: 260, version: "v2.1", gen: 3, live: true,
    prompt: "Squad mech warfare where pilots' callouts are parsed into real-time battlefield tactics.",
    desc: "파일럿의 음성 콜아웃이 실시간 전술로 해석되는 분대 메카 전투.", npcs: [],
  },
  {
    id: "phantom-carnival", title: "Phantom Carnival", genre: "Horror", tags: ["Horror", "Mystery", "Neon"],
    creator: "glitch_art", badge: "PRO", likes: 990, plays: 8800, viewers: 144, rating: 4.5, cost: 16, forks: 175, version: "v1.4", gen: 2, live: true,
    prompt: "A haunted neon carnival that invents a new ride from every visitor's worst memory.",
    desc: "방문자의 최악의 기억으로 새로운 놀이기구를 만들어내는 유령 네온 카니발.", npcs: [],
  },
];

PA.CORE_FEATURES = [
  {
    key: "fork", icon: "⑂", title: "Fork & Remix",
    kr: "포크 & 리믹스",
    desc: "깃허브의 브랜치처럼, 플레이 중 만들어진 독특한 월드 상태(World State)를 포크해 다른 플레이어가 이어받거나 변형할 수 있습니다.",
    bullets: ["세계선(Timeline) 단위 버전 관리", "원작자에게 자동 로열티 정산", "Diff로 변경된 룰·NPC 확인"],
    img: "neon-drift-city",
  },
  {
    key: "inject", icon: "⚡", title: "Live Prompt Injection",
    kr: "라이브 프롬프트 인젝트",
    desc: "스트리밍 관전자가 채팅과 토큰 후원으로 실시간 이벤트, 보스 몬스터, 돌발 날씨를 게임에 직접 주입합니다.",
    bullets: ["관전형 참여 — Audience Action Bits", "보스·날씨·이벤트 즉시 생성", "트위치/유튜브 채팅 연동"],
    img: "iron-titans",
  },
  {
    key: "npc", icon: "🧠", title: "Persistent Neural NPCs",
    kr: "자율형 신경망 NPC",
    desc: "게임을 종료한 뒤에도 서버에서 대화하고 관계를 맺으며 스스로 세력을 구축하는 영구 자율형 LLM 기반 NPC.",
    bullets: ["실시간 감정 추론 모델", "오프라인 중에도 세력·관계 변화", "플레이어를 기억하는 장기 메모리"],
    img: "moss-hollow-farm",
  },
  {
    key: "market", icon: "◈", title: "Asset & Model Market",
    kr: "AI 로직 & 에셋 마켓",
    desc: "파인튜닝된 게임 전용 AI 모델, 프롬프트 시드, 셰이더, 로직 템플릿을 개발자와 유저가 직거래하는 거래소.",
    bullets: ["크리에이터 리믹스 수수료 정산", "플랫폼 수수료 15~20%", "원클릭 월드 적용"],
    img: "prism-lock",
  },
];

PA.JOURNEY = [
  { n: "01", t: "탐색 (Discovery)", d: "메인 로비에서 실시간 렌더링 중인 게임 카탈로그를 탐색합니다. 모든 썸네일은 플레이어들의 라이브 세션 화면입니다." },
  { n: "02", t: "즉각 실행 (Instant Play)", d: "다운로드·설치 없이 카드 클릭 한 번, WebAssembly + WebGPU로 3초 안에 브라우저에서 실행됩니다." },
  { n: "03", t: "가변적 상호작용 (Dynamic Interaction)", d: "텍스트·음성·컨트롤러 입력에 따라 세계관이 재구성되고, NPC는 감정 추론 모델로 반응합니다." },
  { n: "04", t: "세계선 공유 (Share & Archive)", d: "플레이가 끝나면 나만의 세계선(Timeline)을 링크로 발행해 공유하거나 포크를 허용합니다." },
];

PA.ASSETS = [
  { id: "a1", type: "AI Model", name: "NPC-Emotion 7B", by: "voidtech", price: 1200, rating: 4.9, sales: 2140, icon: "🧠", bg: "linear-gradient(135deg,#1b3a5c,#3b1f6b)", desc: "실시간 감정 추론에 특화된 NPC 대화 파인튜닝 모델." },
  { id: "a2", type: "Prompt Seed", name: "Neon Noir Starter", by: "kairo", price: 150, rating: 4.8, sales: 5320, icon: "🌆", bg: "linear-gradient(135deg,#4a1260,#0f3d52)", desc: "사이버펑크 도시 월드를 즉시 생성하는 검증된 시드 팩." },
  { id: "a3", type: "Shader", name: "Synthwave Sky Pack", by: "revline", price: 90, rating: 4.7, sales: 3810, icon: "🌅", bg: "linear-gradient(135deg,#7a1f6b,#ff7a59)", desc: "그라디언트 태양·그리드 지평선 WebGPU 셰이더 12종." },
  { id: "a4", type: "Logic Template", name: "Faction Wars Engine", by: "lumen", price: 480, rating: 4.8, sales: 960, icon: "⚔️", bg: "linear-gradient(135deg,#5a2a0f,#2a1440)", desc: "NPC 세력 간 동맹·배신·전쟁을 자동으로 운영하는 로직." },
  { id: "a5", type: "AI Model", name: "Horror Director XL", by: "nyx", price: 900, rating: 4.6, sales: 720, icon: "👁️", bg: "linear-gradient(135deg,#0f2a1a,#2a0f1a)", desc: "플레이어 반응을 분석해 공포 연출 강도를 조절하는 디렉터 모델." },
  { id: "a6", type: "Prompt Seed", name: "Cozy Village Seeds", by: "sprout", price: 120, rating: 4.9, sales: 4410, icon: "🌻", bg: "linear-gradient(135deg,#d99a6c,#5a8c4a)", desc: "주민 성격·관계도가 포함된 힐링 마을 시드 20종." },
  { id: "a7", type: "Shader", name: "CRT Pixel Filter", by: "pixelpop", price: 60, rating: 4.7, sales: 6120, icon: "📺", bg: "linear-gradient(135deg,#2a2a3a,#0f5a3a)", desc: "스캔라인·블룸·색수차가 있는 레트로 CRT 후처리." },
  { id: "a8", type: "Logic Template", name: "Rogue Floor Generator", by: "cubix", price: 300, rating: 4.5, sales: 1280, icon: "🧱", bg: "linear-gradient(135deg,#3b1f8a,#0f9fb0)", desc: "플레이 기록 기반 적응형 던전 층 생성 템플릿." },
];

PA.FORKS = [
  { id: "f1", title: "Neon Drift 2099", by: "voxel", from: "neon-drift-city", img: "neon-drift-city", plays: 3200, change: "+ Acid rain weather, + Corporate faction" },
  { id: "f2", title: "Rain Runner", by: "cyberdev", from: "neon-drift-city", img: "hero", plays: 1800, change: "+ Parkour rules, − Vehicles" },
  { id: "f3", title: "Synth Alley", by: "synthia", from: "neon-drift-city", img: "turbo-mirage", plays: 950, change: "+ Rhythm combat" },
  { id: "f4", title: "Cyber District", by: "glitch_art", from: "neon-drift-city", img: "phantom-carnival", plays: 2100, change: "+ Night market economy" },
  { id: "f5", title: "Ember Crown: Ashfall", by: "draco", from: "ember-crown", img: "ember-crown", plays: 1400, change: "+ Volcanic map, Dragon ally" },
  { id: "f6", title: "Orbit Salvage: Mutiny", by: "juno", from: "orbit-salvage", img: "orbit-salvage", plays: 2600, change: "+ Crew betrayal system" },
];

PA.NEWS = [
  { id: "n1", cat: "Breaking", title: "Live Prompt Injection 2.0 출시 — 관전자가 보스 몬스터를 직접 설계", date: "2026.10.12", img: "iron-titans", hot: true, body: "관전자는 이제 보스의 외형, 패턴, 약점을 프롬프트로 직접 설계해 스트리머의 세션에 주입할 수 있습니다. Audience Action Bits 소모량은 보스 등급에 따라 달라집니다." },
  { id: "n2", cat: "Event", title: "할로윈 공포 장르 페스티벌 — Horror 월드 플레이 시 크레딧 2배", date: "2026.10.10", img: "phantom-carnival", body: "10월 31일까지 Horror 장르 월드를 플레이하면 사용한 컴퓨팅 크레딧의 100%를 보너스로 돌려드립니다." },
  { id: "n3", cat: "Notice", title: "WebGPU 렌더러 업데이트 및 초저지연 세션 지역 확대 (서울·도쿄)", date: "2026.10.08", img: "orbit-salvage", body: "아시아 리전에 신규 GPU 클러스터가 추가되어 평균 입력 지연이 38ms에서 21ms로 감소했습니다." },
  { id: "n4", cat: "Creator", title: "이달의 크리에이터 @sprout — 포크 420회, 로열티 1위", date: "2026.10.05", img: "moss-hollow-farm", body: "Moss Hollow Farm의 제작자 @sprout 님의 인터뷰를 만나보세요." },
  { id: "n5", cat: "Patch", title: "Neural NPC 장기 기억 용량 4배 확장", date: "2026.10.02", img: "ember-crown", body: "NPC가 기억할 수 있는 플레이어 상호작용 기록이 4배로 늘어났습니다." },
  { id: "n6", cat: "Event", title: "B2B 인디 런치패드 2기 모집 — SDK Pass 6개월 무료", date: "2026.09.28", img: "prism-lock", body: "중소형 인디 개발팀을 대상으로 서버 인프라, 실시간 AI API 백엔드, 통합 빌링을 제공합니다." },
];

PA.TX = [
  { id: "t1", kind: "use", title: "Neon Drift City 세션", sub: "GPU 추론 · 42분", amt: -25, date: "2026.10.13 14:20", icon: "🎮" },
  { id: "t2", kind: "in", title: "로열티 정산 — Neon Noir Starter", sub: "포크 12회", amt: +180, date: "2026.10.13 09:00", icon: "💎" },
  { id: "t3", kind: "use", title: "Prompt Injection — Boss Spawn", sub: "@kairo 세션", amt: -40, date: "2026.10.12 22:14", icon: "⚡" },
  { id: "t4", kind: "out", title: "크레딧 보내기 → @lumen", sub: "선물", amt: -100, date: "2026.10.12 18:30", icon: "↗" },
  { id: "t5", kind: "in", title: "Pro 플랜 월간 크레딧", sub: "구독 갱신", amt: +1000, date: "2026.10.01 00:00", icon: "＋" },
  { id: "t6", kind: "use", title: "Orbit Salvage 세션", sub: "고해상도 · 1시간 10분", amt: -35, date: "2026.09.30 21:02", icon: "🎮" },
  { id: "t7", kind: "out", title: "마켓 구매 — Synthwave Sky Pack", sub: "Shader", amt: -90, date: "2026.09.29 13:45", icon: "◈" },
  { id: "t8", kind: "in", title: "신규 가입 보너스", sub: "30일 Risk-free", amt: +500, date: "2026.09.20 10:12", icon: "🎁" },
];

PA.FAQ = [
  { c: "Credits", q: "Compute Credit(Cr)은 무엇인가요?", a: "실시간 추론 연산(LLM, 이미지·비디오 생성)에 필요한 GPU 리소스를 측정하는 단위입니다. 세션 길이와 해상도, 프롬프트 인젝션 사용량에 따라 차감됩니다." },
  { c: "Credits", q: "무료 쿼터는 얼마나 제공되나요?", a: "모든 유저에게 매월 300 Cr의 기본 쿼터가 제공되며, 신규 가입 시 30일 Risk-free 체험으로 500 Cr이 추가 지급됩니다." },
  { c: "Play", q: "게임을 다운로드해야 하나요?", a: "아니요. 모든 게임은 WebAssembly와 WebGL/WebGPU 기반으로 브라우저에서 3초 안에 즉시 실행됩니다." },
  { c: "Play", q: "같은 게임인데 왜 친구와 내용이 다른가요?", a: "PromptArcade의 월드는 생성형 AI로 실시간 재구성됩니다. 플레이어의 입력과 선택에 따라 룰, NPC, 그래픽, 엔딩이 모두 달라집니다." },
  { c: "Remix", q: "포크(Fork)한 월드의 수익은 어떻게 정산되나요?", a: "포크된 월드에서 발생한 컴퓨팅 수익의 일정 비율이 원작자에게 자동 정산되며, 플랫폼은 15~20%의 수수료를 취득합니다." },
  { c: "Remix", q: "내 세계선을 비공개로 할 수 있나요?", a: "네. 세계선 발행 시 공개 / 링크 공유 / 비공개 중 선택할 수 있고, 포크 허용 여부도 별도로 설정할 수 있습니다." },
  { c: "Account", q: "보안 PIN과 패턴은 어디서 재설정하나요?", a: "더보기 > 인증/보안 메뉴에서 PIN, 패턴, 보안 비밀번호를 변경하거나 재설정할 수 있습니다." },
  { c: "Account", q: "Twitch / Discord 계정을 연동할 수 있나요?", a: "더보기 > 연동 앱 정보에서 Twitch, YouTube, Discord, GitHub 계정을 연결해 라이브 인젝션과 커뮤니티 기능을 사용할 수 있습니다." },
];

PA.PLANS = [
  { id: "starter", name: "Starter", price: 3, credits: 400, desc: "가볍게 무한 세계를 맛보고 싶은 플레이어", feats: ["월 400 Cr 컴퓨팅 크레딧", "720p 표준 세션", "세계선 공유 월 5회", "커뮤니티 리믹스"], off: ["초저지연 세션", "Neural NPC 장기 기억"] },
  { id: "pro", name: "Pro", price: 9, credits: 1000, featured: true, desc: "매일 플레이하고 리믹스하는 크리에이터", feats: ["월 1,000 Cr 컴퓨팅 크레딧", "1080p 고해상도 세션", "무제한 세계선 공유 & 포크", "Neural NPC 장기 기억", "마켓 판매 수수료 15%"], off: ["4K / 초저지연 우선 큐"] },
  { id: "ultra", name: "Ultra", price: 23, credits: 3000, desc: "스트리머 & 하드코어 크리에이터", feats: ["월 3,000 Cr 컴퓨팅 크레딧", "4K · 초저지연(~20ms) 우선 큐", "Live Prompt Injection 스트리머 도구", "Audience Bits 수익 배분", "전용 크리에이터 대시보드", "마켓 판매 수수료 15%"], off: [] },
];

PA.TESTIMONIALS = [
  { q: "같은 게임을 10번 했는데 10번 다 엔딩이 달랐어요. 이건 스토어가 아니라 우주예요.", n: "Hana K.", r: "Pro 플레이어" },
  { q: "시청자가 보스를 주입하는 순간 채팅창이 폭발합니다. 방송 체류시간이 2배가 됐어요.", n: "@StreamWolf", r: "Ultra · 스트리머" },
  { q: "제가 만든 시드가 400번 포크됐고, 로열티로 GPU 비용을 다 충당하고 있어요.", n: "@sprout", r: "크리에이터" },
];

PA.LOGIN_HISTORY = [
  { d: "2026.10.13 14:02", dev: "Chrome · Windows", ip: "211.36.xxx.xxx", loc: "Seoul, KR", now: true },
  { d: "2026.10.12 21:40", dev: "Safari · iPhone", ip: "223.38.xxx.xxx", loc: "Seoul, KR" },
  { d: "2026.10.10 09:15", dev: "Edge · Windows", ip: "211.36.xxx.xxx", loc: "Seoul, KR" },
];

PA.CHAT_POOL = [
  ["neo_fan", "이 도시 비 오는 거 미쳤다 ㅋㅋ"], ["ghost88", "왼쪽 골목 가봐요!"], ["luna", "NPC가 아까 한 말 기억함 ㄷㄷ"],
  ["byte", "보스 소환 가즈아"], ["mika", "포크해서 내 버전 만들어야지"], ["zeroK", "그래픽이 매번 달라지는 게 신기함"],
  ["drift", "Vex 믿지 마세요"], ["hoshi", "날씨 바꾸고 싶다"], ["pixel_cat", "3초 만에 켜지는 거 실화?"],
];
