/* =============================================================================
   store.js  ―  저장소 (localStorage) + 데이터 정규화
   -----------------------------------------------------------------------------
   index.html 과 admin.html 이 함께 사용합니다. 서버·DB 없이 동작합니다.
   미디어는 이미지만 다룹니다 (영상 미지원).

   우선순위 :  localStorage(관리자 저장)  >  save.js(배포본)  >  data.js(기본값)

   · localStorage 는 "이 컴퓨터의 이 브라우저"에만 저장됩니다.
     다른 사람에게도 같은 내용을 보여주려면 관리자 페이지에서
     [save.js 내보내기] 를 눌러 받은 파일을 index.html 옆에 두세요.
   ============================================================================= */
(function (global) {
  'use strict';

  const KEY = 'pm.data.v2';
  const clone = o => JSON.parse(JSON.stringify(o));

  /* ---------- 원본(편집용) 데이터 읽기 ---------- */
  function raw() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return migrate(JSON.parse(saved));
    } catch (e) {
      console.warn('[store] 저장된 데이터를 읽지 못했습니다. 기본값을 사용합니다.', e);
    }
    if (global.PM_SAVED) return migrate(clone(global.PM_SAVED));
    return clone(global.PM_DEFAULT);
  }

  /** 지금 화면이 어느 데이터를 쓰고 있는지 */
  function source() {
    try {
      if (localStorage.getItem(KEY)) return 'localStorage';
    } catch (e) { /* 무시 */ }
    return global.PM_SAVED ? 'save.js' : 'data.js';
  }

  /* ---------- 이미지가 아닌 값(예전 mp4 파일명)은 버립니다 ---------- */
  const VIDEO_EXT = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i;

  function imageOnly(src) {
    const s = String(src || '').trim();
    if (!s) return '';
    if (s.startsWith('data:video')) return '';
    if (VIDEO_EXT.test(s)) return '';
    return s;
  }

  /* ---------- 예전 형식(v1) 자동 변환 ---------- */
  function migrate(d) {
    if (!d || typeof d !== 'object') return clone(global.PM_DEFAULT);

    d.grid = d.grid || clone(global.PM_DEFAULT.grid);
    d.chip = d.chip || clone(global.PM_DEFAULT.chip);
    delete d.world;     // 위치는 이제 그리드가 정합니다
    delete d.verses;    // 성구 기능은 사용하지 않습니다

    d.themes = (d.themes || []).map(t => {
      const a = t.article || {};
      return {
        id: t.id, name: t.name,
        media: imageOnly(t.media || t.video),
        color: t.color || 'slate',
        article: {
          title: a.title || '',
          subtitle: a.subtitle || a.lead || '',
          body: a.body || [],
        },
      };
    });

    d.notices = d.notices || [];
    d.version = 2;
    return d;
  }

  /* ---------- 저장 / 삭제 ---------- */
  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return { ok: true };
    } catch (e) {
      console.error('[store] 저장 실패', e);
      const full = e && (e.name === 'QuotaExceededError' || e.code === 22);
      return {
        ok: false,
        message: full
          ? '저장 공간이 가득 찼습니다. 업로드한 이미지 용량을 줄이거나 개수를 줄여 주세요.'
          : '저장에 실패했습니다.',
      };
    }
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) { /* 무시 */ }
  }

  function defaults() { return clone(global.PM_DEFAULT); }

  /* ---------- 3열 그리드 자동 배치 ---------- */
  function layout(themes, grid) {
    const cols   = Math.max(1, Number(grid.cols)   || 3);
    const cellW  = Number(grid.cellW)  || 700;
    const cellH  = Number(grid.cellH)  || 620;
    const margin = Number(grid.margin) || 380;

    const n     = themes.length;
    const rows  = Math.max(1, Math.ceil(n / cols));
    const fullW = (cols - 1) * cellW;

    const positions = themes.map((_, i) => {
      const row   = Math.floor(i / cols);
      const col   = i % cols;
      const count = Math.min(cols, n - row * cols);   // 이 줄에 놓인 개수
      const rowW  = (count - 1) * cellW;
      return {
        /* 마지막 줄이 덜 찼으면 가운데로 모읍니다 */
        x: margin + (fullW - rowW) / 2 + col * cellW,
        y: margin + row * cellH,
        col, row, count,
      };
    });

    return {
      positions,
      world: { w: margin * 2 + fullW, h: margin * 2 + (rows - 1) * cellH },
    };
  }

  /* ---------- 화면이 바로 쓸 수 있는 형태로 변환 ---------- */
  function normalize(d) {
    const COLORS = global.PM_COLORS || {};
    const ICONS  = global.PM_ICONS  || {};
    const color  = key => COLORS[key] || COLORS.slate || Object.values(COLORS)[0];

    const grid = d.grid || { cols: 3, cellW: 700, cellH: 620, margin: 380 };
    const { positions, world } = layout(d.themes || [], grid);

    return {
      world,
      chip: { ...(d.chip || { dist: 215 }) },

      themes: (d.themes || []).map((t, i) => {
        const c = color(t.color);
        const p = positions[i];
        return {
          id: t.id || 'theme' + i,
          name: t.name || '',
          media: imageOnly(t.media),
          x: p.x, y: p.y,
          /* 줄의 왼쪽 절반이면 오른쪽에, 오른쪽 끝이면 왼쪽에 칩을 붙입니다 */
          side: p.col < p.count / 2 ? 'right' : 'left',
          c: { dot: c.dot, text: c.text, border: c.border, nav: c.nav },
          article: {
            title: (t.article && t.article.title) || '',
            subtitle: (t.article && t.article.subtitle) || '',
            body: (t.article && t.article.body) || [],
          },
        };
      }),

      notices: (d.notices || []).map(n => {
        const c = color(n.iconColor);
        const i = ICONS[n.icon] || Object.values(ICONS)[0] || { path: '' };
        return {
          kicker: n.kicker || '',
          icon: { bg: c.iconBg, fg: c.iconFg, path: i.path },
          title: n.title || '',
          desc:  n.desc  || '',
          box:   !!n.box,
          badge: n.badge || '',
          chips: !!n.chips,
        };
      }),
    };
  }

  /* ---------- save.js 파일 내용 만들기 ---------- */
  function toSaveJs(data) {
    return '/* =============================================================\n'
         + '   save.js  ―  관리자 페이지에서 내보낸 파일 (자동 생성)\n'
         + '   내보낸 시각 : ' + new Date().toLocaleString('ko-KR') + '\n'
         + '   이 파일을 index.html 과 같은 폴더에 두면 모든 사람이 같은\n'
         + '   내용을 보게 됩니다. 직접 수정하지 마세요.\n'
         + '   ============================================================= */\n'
         + 'window.PM_SAVED = ' + JSON.stringify(data, null, 2) + ';\n';
  }

  /* ---------- 파일 내려받기 ---------- */
  function download(filename, text) {
    const blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------- 대략적인 저장 용량 ---------- */
  function usage(data) {
    const bytes = new Blob([JSON.stringify(data)]).size;
    return { bytes, text: bytes > 1024 * 1024
      ? (bytes / 1024 / 1024).toFixed(1) + ' MB'
      : Math.round(bytes / 1024) + ' KB' };
  }

  global.PM = {
    KEY, raw, save, clear, defaults, source, normalize, toSaveJs, download, clone, usage, imageOnly,
    /** 화면에서 바로 쓰는 데이터 */
    load() { return normalize(raw()); },
  };
})(window);
