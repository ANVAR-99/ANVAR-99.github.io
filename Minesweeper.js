(function () {
  const ROWS = 8;
  const COLS = 8;
  const MINE_COUNT = 10;

  const boardEl = document.getElementById('minesweeper-board');
  const minesLeftEl = document.getElementById('mines-left');
  const resetBtn = document.getElementById('minesweeper-reset');
  const statusEl = document.getElementById('minesweeper-status');

  let cells = [];
  let gameOver = false;
  let firstReveal = true;

  function idx(r, c) {
    return r * COLS + c;
  }

  function inBounds(r, c) {
    return r >= 0 && r < ROWS && c >= 0 && c < COLS;
  }

  function neighbors(r, c) {
    const list = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc)) list.push([nr, nc]);
      }
    }
    return list;
  }

  function flagCount() {
    return cells.reduce((n, cell) => n + (cell.flagged ? 1 : 0), 0);
  }

  function initCells() {
    cells = [];
    for (let i = 0; i < ROWS * COLS; i++) {
      cells.push({
        isMine: false,
        revealed: false,
        flagged: false,
        adjacent: 0,
      });
    }
    gameOver = false;
    firstReveal = true;
  }

  function placeMines(safeR, safeC) {
    const excluded = new Set([idx(safeR, safeC)]);
    for (const [nr, nc] of neighbors(safeR, safeC)) {
      excluded.add(idx(nr, nc));
    }
    const candidates = [];
    for (let i = 0; i < ROWS * COLS; i++) {
      if (!excluded.has(i)) candidates.push(i);
    }
    for (let i = 0; i < ROWS * COLS; i++) {
      cells[i].isMine = false;
      cells[i].adjacent = 0;
    }
    let placed = 0;
    while (placed < MINE_COUNT && candidates.length > 0) {
      const pick = Math.floor(Math.random() * candidates.length);
      const cellIndex = candidates.splice(pick, 1)[0];
      cells[cellIndex].isMine = true;
      placed++;
    }
    for (let i = 0; i < ROWS * COLS; i++) {
      if (cells[i].isMine) continue;
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      let count = 0;
      for (const [nr, nc] of neighbors(r, c)) {
        if (cells[idx(nr, nc)].isMine) count++;
      }
      cells[i].adjacent = count;
    }
  }

  function floodReveal(r, c) {
    const cell = cells[idx(r, c)];
    if (cell.revealed || cell.flagged || cell.isMine) return;
    cell.revealed = true;
    if (cell.adjacent === 0) {
      for (const [nr, nc] of neighbors(r, c)) {
        floodReveal(nr, nc);
      }
    }
  }

  function revealAllMines() {
    for (let i = 0; i < ROWS * COLS; i++) {
      if (cells[i].isMine) cells[i].revealed = true;
    }
  }

  function checkWin() {
    for (let i = 0; i < ROWS * COLS; i++) {
      if (!cells[i].isMine && !cells[i].revealed) return false;
    }
    return true;
  }

  function reveal(r, c) {
    const cell = cells[idx(r, c)];
    if (gameOver || cell.flagged || cell.revealed) return;

    if (firstReveal) {
      placeMines(r, c);
      firstReveal = false;
    }

    if (cell.isMine) {
      cell.revealed = true;
      gameOver = true;
      revealAllMines();
      statusEl.textContent = 'Game over';
      render();
      return;
    }

    floodReveal(r, c);
    if (checkWin()) {
      gameOver = true;
      statusEl.textContent = 'You won, thank you for visiting my website!';
    } else {
      statusEl.textContent = '';
    }
    render();
  }

  function toggleFlag(r, c) {
    if (gameOver) return;
    const cell = cells[idx(r, c)];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    render();
  }

  function updateMinesLeft() {
    minesLeftEl.textContent = String(MINE_COUNT - flagCount());
  }

  function cellDisabled(cell) {
    return gameOver || cell.revealed;
  }

  const LONG_PRESS_MS = 500;
  const TOUCH_MOVE_CANCEL_PX = 14;
  let suppressClick = false;
  let longPressTimer = null;
  let touchTracking = null;
  let longPressFired = false;

  function touchById(touchList, id) {
    for (let i = 0; i < touchList.length; i++) {
      if (touchList[i].identifier === id) return touchList[i];
    }
    return null;
  }

  function render() {
    boardEl.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = cells[idx(r, c)];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'minesweeper-cell';
        btn.dataset.r = String(r);
        btn.dataset.c = String(c);
        btn.disabled = cellDisabled(cell);
        btn.setAttribute(
          'aria-label',
          `Cell row ${r + 1} column ${c + 1}`,
        );

        if (cell.flagged && !cell.revealed) {
          btn.classList.add('is-flagged', 'is-hidden');
          btn.setAttribute('aria-label', `Flagged cell row ${r + 1} column ${c + 1}`);
          const img = document.createElement('img');
          img.src = 'images/flag.png';
          img.alt = '';
          img.className = 'minesweeper-cell-icon';
          btn.appendChild(img);
        } else if (cell.revealed) {
          btn.classList.add('is-revealed');
          if (cell.isMine) {
            btn.classList.add('is-mine-hit');
            const img = document.createElement('img');
            img.src = 'images/mine.png';
            img.alt = '';
            img.className = 'minesweeper-cell-icon';
            btn.appendChild(img);
          } else if (cell.adjacent > 0) {
            btn.textContent = String(cell.adjacent);
            btn.classList.add(`adj-${cell.adjacent}`, 'is-number');
          } else {
            btn.classList.add('is-empty');
          }
        } else {
          btn.classList.add('is-hidden');
        }

        boardEl.appendChild(btn);
      }
    }
    updateMinesLeft();
  }

  function scheduleClearSuppress() {
    window.setTimeout(() => {
      suppressClick = false;
    }, 380);
  }

  boardEl.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      const btn = e.target.closest('.minesweeper-cell');
      if (!btn || btn.disabled || gameOver) return;
      const t = e.touches[0];
      if (longPressTimer) window.clearTimeout(longPressTimer);
      longPressFired = false;
      touchTracking = {
        id: t.identifier,
        r: +btn.dataset.r,
        c: +btn.dataset.c,
        x: t.clientX,
        y: t.clientY,
        t0: Date.now(),
      };
      longPressTimer = window.setTimeout(() => {
        longPressTimer = null;
        if (!touchTracking) return;
        longPressFired = true;
        toggleFlag(touchTracking.r, touchTracking.c);
        try {
          navigator.vibrate(15);
        } catch (_) {
          /* ignore */
        }
      }, LONG_PRESS_MS);
    },
    { passive: true },
  );

  boardEl.addEventListener(
    'touchmove',
    (e) => {
      if (!touchTracking || !longPressTimer) return;
      const t = touchById(e.touches, touchTracking.id);
      if (!t) return;
      const dx = t.clientX - touchTracking.x;
      const dy = t.clientY - touchTracking.y;
      if (dx * dx + dy * dy > TOUCH_MOVE_CANCEL_PX * TOUCH_MOVE_CANCEL_PX) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    },
    { passive: true },
  );

  boardEl.addEventListener(
    'touchend',
    (e) => {
      if (!touchTracking) return;
      const t = touchById(e.changedTouches, touchTracking.id);
      if (!t) return;
      if (longPressTimer) {
        window.clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      const start = touchTracking;
      touchTracking = null;

      if (longPressFired) {
        longPressFired = false;
        suppressClick = true;
        scheduleClearSuppress();
        e.preventDefault();
        return;
      }

      const endBtn = e.target.closest('.minesweeper-cell');
      if (
        !endBtn ||
        endBtn.disabled ||
        +endBtn.dataset.r !== start.r ||
        +endBtn.dataset.c !== start.c
      ) {
        return;
      }

      if (Date.now() - start.t0 >= LONG_PRESS_MS) return;

      suppressClick = true;
      scheduleClearSuppress();
      reveal(start.r, start.c);
      e.preventDefault();
    },
    { passive: false },
  );

  boardEl.addEventListener('touchcancel', () => {
    if (longPressTimer) {
      window.clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    touchTracking = null;
    longPressFired = false;
  });

  boardEl.addEventListener('click', (e) => {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const btn = e.target.closest('.minesweeper-cell');
    if (!btn || btn.disabled) return;
    reveal(+btn.dataset.r, +btn.dataset.c);
  });

  boardEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const btn = e.target.closest('.minesweeper-cell');
    if (!btn || gameOver) return;
    const r = +btn.dataset.r;
    const c = +btn.dataset.c;
    const cell = cells[idx(r, c)];
    if (cell.revealed) return;
    toggleFlag(r, c);
  });

  resetBtn.addEventListener('click', () => {
    initCells();
    statusEl.textContent = '';
    render();
  });

  initCells();
  render();
})();
