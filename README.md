# PromptArcade (The Infinite Canvas) 🎮✨

> **"모든 플레이어가 서로 다른 엔딩과 세계를 만나는 무한 생성형 아케이드"**

PromptArcade는 기존의 다운로드형 스토어 모델(Steam 등)을 벗어나, **생성형 AI(Generative AI)**의 영구적 가변성을 게임의 핵심 메커니즘으로 채택한 차세대 브라우저 기반 게임 플랫폼입니다. 별도 설치 없이 WebAssembly와 WebGL/WebGPU 기술을 기반으로 즉각 실행되며, 플레이어의 조작과 실시간 연산에 따라 룰, NPC, 그래픽, 월드가 끊임없이 진화합니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🚀 Key Features (핵심 기능)

1. **포크 & 리믹스 (Fork & Remix)**  
   - 깃허브의 브랜치 개념을 도입하여, 플레이 중 생성된 고유한 세계선(World State)을 포크해 이어받거나 변형할 수 있습니다.
   - 인터랙티브 SVG 트리 그래프를 통해 버전과 변경점(Diff)을 시각화합니다.
   
2. **라이브 프롬프트 인젝트 (Live Prompt Injection)**  
   - 스트리밍 중 관전자가 채팅 및 토큰(Audience Action Bits) 후원을 통해 실시간 이벤트, 보스 몬스터 소환, 돌발 기상 변화(산성비, 뇌우 등)를 인게임에 직접 주입합니다.

3. **자율형 신경망 NPC (Persistent Neural NPCs)**  
   - 게임 종료 후에도 서버에서 백그라운드로 대화하고 관계를 형성하며 독자적인 세력을 구축하는 영구 자율형 LLM 기반 NPC 시스템입니다. 실시간 감정 추론 모델을 통해 플레이어와의 대화 및 신뢰도가 동적으로 변합니다.

4. **AI 로직 & 에셋 마켓플레이스 (Asset & Model Market)**  
   - 파인튜닝된 게임 전용 AI 모델(`NPC-Emotion 7B`), 프롬프트 시드, 셰이더, 로직 템플릿을 개발자와 유저 간에 직거래할 수 있습니다. (크리에이터 로열티 30% 자동 정산)

5. **컴퓨팅 토큰 구독제 (Compute Credit Model)**  
   - GPU 추론 리소스를 크레딧(Cr) 기반으로 측정합니다. 매월 무료 쿼터(300 Cr) 및 가입 시 30일 Risk-free 500 Cr 제공, 고해상도/초저지연 세션을 위한 프리미엄 구독 플랜($3 / $9 / $23)을 지원합니다.

---

## 🎨 8대 게임 장르 (Explore)

- **Cyberpunk**: `Neon Drift City` (비에 젖은 네온 메트로폴리스)
- **Fantasy RPG**: `Ember Crown` (노을 위 성과 드래곤)
- **Horror**: `Hollow Ward` (플레이어의 공포를 학습하는 폐병원)
- **Sci-Fi**: `Orbit Salvage` (버려진 우주 정거장 샐비지)
- **Racing**: `Turbo Mirage` (신스웨이브 고속도로)
- **Puzzle**: `Prism Lock` (동적 기하학 블록 퍼즐)
- **Pixel Retro**: `8-Bit Dungeon` (16비트 레트로 던전)
- **Cozy Sim**: `Moss Hollow Farm` (스스로 살아가는 아늑한 골짜기 마을)

---

## 📂 Project Structure

```text
prompt-arcade/
├── index.html          # 메인 SPA 마크업 (헤더, 라우팅 컨테이너, 모바일 탭바)
├── vercel.json         # Vercel 정적 호스팅 및 SPA 라우팅 설정
├── package.json        # 프로젝트 메타데이터
├── .gitignore          # Git 제외 파일 목록
├── README.md           # 프로젝트 가이드
├── css/
│   └── styles.css      # 네온 다크 테마 디자인 시스템 및 반응형 레이아웃
├── js/
│   ├── data.js         # 8대 장르 게임, 마켓 에셋, FAQ, 목업 데이터
│   ├── core.js         # 해시 라우터, 모달/토스트 시스템, 크레딧 상태 관리
│   ├── flows.js        # 온보딩, PIN/패턴 인증, 3초 부팅, 지갑 송금 플로우
│   ├── views.js        # Home, Explore, Detail, Play, Remix, Market, Wallet 등 전 화면
│   └── app.js          # 애플리케이션 진입점 및 부트스트랩
└── assets/
    └── img/            # 고화질 게임 키아트 및 비주얼 에셋 (11종)
```

---

## 🛠️ Deployment (배포 방법)

### Vercel 배포 (Recommended)
1. GitHub에 이 저장소를 푸시합니다.
2. [Vercel](https://vercel.com/)에 로그인하고 **Add New... > Project**를 선택합니다.
3. 방금 푸시한 `prompt-arcade` 저장소를 **Import**합니다.
4. Framework Preset은 **Other**로 두고 **Deploy** 버튼을 누릅니다. (설정 수정 불필요)
5. 1분 내에 전 세계 글로벌 CDN(Edge Network)에 무료로 즉시 배포됩니다!

### 로컬 실행
별도의 빌드 도구 없이 `index.html`을 웹 브라우저에서 바로 열거나, 간단한 정적 서버를 통해 실행할 수 있습니다.
```bash
# npx serve를 사용할 경우
npx serve .
```

---

## 📄 License
MIT License.
