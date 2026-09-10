/* =============================================================================
   data.js  ―  기본(초기) 데이터
   -----------------------------------------------------------------------------
   · 이 파일은 "공장 초기값"입니다. 관리자 페이지에서 [기본값 복원]을 누르면
     여기 있는 내용으로 되돌아갑니다.
   · 평소 내용 수정은 admin.html(관리자 페이지)에서 하시면 됩니다.

   데이터 우선순위 :  localStorage(관리자 저장)  >  save.js(배포본)  >  data.js(기본값)

   · 카드 위치는 지정하지 않습니다. grid 설정(열 수·간격)에 따라 자동 배치됩니다.
   · media 에는 이미지만 들어갑니다. 관리자 페이지에서 [이미지 등록] 을 누르면
     data 코드(data:image/jpeg;base64,...)로 저장됩니다.
     같은 폴더에 둔 이미지 파일 이름(photo.jpg)을 적어도 됩니다.
     빈 값이면 카드에 "이미지 없음" 자리표시가 나옵니다.
   ============================================================================= */

/* ---- 사용할 수 있는 색상 ---- */
window.PM_COLORS = {
  emerald: { label: '초록', dot: 'bg-emerald-500', text: 'text-emerald-700', border: 'hover:border-emerald-400', nav: 'bg-emerald-500', iconBg: 'bg-emerald-100', iconFg: 'text-emerald-600' },
  sky:     { label: '하늘', dot: 'bg-sky-500',     text: 'text-sky-700',     border: 'hover:border-sky-400',     nav: 'bg-sky-500',     iconBg: 'bg-sky-100',     iconFg: 'text-sky-600' },
  cyan:    { label: '청록', dot: 'bg-cyan-500',    text: 'text-cyan-700',    border: 'hover:border-cyan-400',    nav: 'bg-cyan-500',    iconBg: 'bg-cyan-100',    iconFg: 'text-cyan-600' },
  amber:   { label: '노랑', dot: 'bg-amber-500',   text: 'text-amber-700',   border: 'hover:border-amber-400',   nav: 'bg-amber-500',   iconBg: 'bg-amber-100',   iconFg: 'text-amber-600' },
  rose:    { label: '분홍', dot: 'bg-rose-500',    text: 'text-rose-700',    border: 'hover:border-rose-400',    nav: 'bg-rose-500',    iconBg: 'bg-rose-100',    iconFg: 'text-rose-600' },
  violet:  { label: '보라', dot: 'bg-violet-500',  text: 'text-violet-700',  border: 'hover:border-violet-400',  nav: 'bg-violet-500',  iconBg: 'bg-violet-100',  iconFg: 'text-violet-600' },
  indigo:  { label: '남색', dot: 'bg-indigo-500',  text: 'text-indigo-700',  border: 'hover:border-indigo-400',  nav: 'bg-indigo-500',  iconBg: 'bg-indigo-100',  iconFg: 'text-indigo-600' },
  slate:   { label: '회색', dot: 'bg-slate-500',   text: 'text-slate-700',   border: 'hover:border-slate-400',   nav: 'bg-slate-500',   iconBg: 'bg-slate-100',   iconFg: 'text-slate-600' },
};

/* ---- 공지사항에 쓸 수 있는 아이콘 ---- */
window.PM_ICONS = {
  book:     { label: '문서(책)',   path: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>' },
  calendar: { label: '일정(달력)', path: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  bell:     { label: '알림(종)',   path: '<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>' },
  star:     { label: '강조(별)',   path: '<path d="M11.5 3.2a.6.6 0 0 1 1 0l2.3 4.7 5.2.8a.6.6 0 0 1 .3 1l-3.7 3.6.9 5.1a.6.6 0 0 1-.9.6L12 16.6l-4.6 2.4a.6.6 0 0 1-.9-.6l.9-5.1L3.7 9.7a.6.6 0 0 1 .3-1l5.2-.8z"/>' },
  users:    { label: '모임(사람)', path: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
};

/* ---- 기본 데이터 ---- */
window.PM_DEFAULT = {
  version: 2,

  /* 카드 자동 배치 : 3열 그리드 */
  grid: { cols: 3, cellW: 700, cellH: 620, margin: 380 },

  /* 미디어 ↔ 키워드 칩 사이 거리 */
  chip: { dist: 215 },

  /* 미디어 + 글 (제목 · 서브제목 · 본문)
     ※ 아래 내용은 화면 확인용 샘플입니다. admin.html 에서 바꿔 쓰세요. */
  themes: [
    {
      id: 'sample1', name: '여행', media: '', color: 'emerald',
      article: {
        title: '낯선 골목을 걷는 일',
        subtitle: '샘플 텍스트 · 카드 1',
        body: [
          `지도를 접어 두고 걷기 시작하면, 목적지보다 길 자체가 먼저 눈에 들어옵니다. 어느 골목에서 꺾을지 정해 두지 않았기 때문입니다.`,
          `낯선 동네의 간판, 문 앞에 내놓은 화분, 오후 네 시의 그림자 같은 것들이 하루의 기억으로 남습니다. 계획했던 일정에는 없던 장면들입니다.`,
          `여행이 끝나고 남는 것은 사진첩의 사진보다, 아무것도 하지 않고 앉아 있던 벤치의 감각인 경우가 많습니다.`,
        ],
      },
    },
    {
      id: 'sample2', name: '음악', media: '', color: 'sky',
      article: {
        title: '반복해서 듣는 한 곡',
        subtitle: '샘플 텍스트 · 카드 2',
        body: [
          `같은 곡을 스무 번쯤 듣고 나면, 처음에는 들리지 않던 소리가 뒤에서 올라옵니다. 베이스의 움직임이나, 숨을 들이쉬는 짧은 소리 같은 것들입니다.`,
          `좋아하는 음악이 늘어나는 속도보다, 오래 듣는 음악이 깊어지는 속도가 더 느립니다. 그래서 더 오래 남습니다.`,
        ],
      },
    },
    {
      id: 'sample3', name: '요리', media: '', color: 'amber',
      article: {
        title: '주말 아침의 부엌',
        subtitle: '샘플 텍스트 · 카드 3',
        body: [
          `재료를 꺼내 놓고 순서를 정하는 시간이, 실제로 불을 켜는 시간보다 깁니다. 준비가 끝나면 요리는 거의 끝난 셈입니다.`,
          `레시피의 계량은 어디까지나 출발점입니다. 몇 번 만들다 보면 손이 먼저 양을 기억하고, 그때부터 그 요리는 자기 것이 됩니다.`,
          `혼자 먹으려고 차린 밥상도 접시에 담고 나면 제법 근사해집니다. 그 차이는 생각보다 큽니다.`,
        ],
      },
    },
    {
      id: 'sample4', name: '산책', media: '', color: 'violet',
      article: {
        title: '같은 길, 다른 속도',
        subtitle: '샘플 텍스트 · 카드 4',
        body: [
          `매일 지나는 길인데도 걷는 속도를 바꾸면 다른 길이 됩니다. 빠르게 지날 때는 보이지 않던 것들이 천천히 걸을 때 눈에 들어옵니다.`,
          `특별한 목적 없이 나선 걸음이 하루 중 가장 정리가 잘 되는 시간이 되기도 합니다.`,
        ],
      },
    },
  ],

  /* 모든 글을 읽은 뒤 나오는 공지 (한 장씩 넘겨 봅니다)
     ※ 아래 내용은 화면 확인용 샘플입니다. */
  notices: [
    {
      kicker: '공지 1 · 안내',
      icon: 'book', iconColor: 'emerald',
      title: '네 장의 카드를 모두 열어 보셨습니다',
      desc: '여기는 공지사항이 들어가는 자리입니다.<br class="hidden sm:block"> 관리자 페이지에서 내용을 바꿀 수 있습니다.',
      box: false, badge: '',
      chips: true,
    },
    {
      kicker: '공지 2 · 일정',
      icon: 'calendar', iconColor: 'amber',
      title: '다음 모임은 <span class="text-amber-700">첫째 주 금요일</span>입니다',
      desc: '이 문장은 샘플입니다. 강조 상자와 라벨이<br class="hidden sm:block"> 어떻게 보이는지 확인하는 용도입니다.',
      box: true, badge: '일정 안내',
      chips: false,
    },
  ],
};
