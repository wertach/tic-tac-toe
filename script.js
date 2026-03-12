// ─── State ──────────────────────────────────────────────────────────────────
let board = Array(9).fill(null);   // null | 'X' | 'O'
let currentPlayer = 'X';
let gameOver = false;
let gameMode = 'pvp';              // 'pvp' | 'ai'
let aiDifficulty = 'easy';         // 'easy' | 'medium' | 'hard'
let aiThinking = false;            // blocks human clicks during AI delay

// All 8 winning combinations (indices into the board array)
const WIN_COMBOS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // anti-diagonal
];

// ─── DOM References ──────────────────────────────────────────────────────────
const cells       = document.querySelectorAll('.cell');
const statusEl    = document.getElementById('status');
const newGameBtn  = document.getElementById('new-game-btn');
const btnPvp      = document.getElementById('btn-pvp');
const btnAi       = document.getElementById('btn-ai');
const diffSelector = document.getElementById('difficulty-selector');
const diffBtns    = document.querySelectorAll('.btn-difficulty');

// ─── Event Listeners ─────────────────────────────────────────────────────────
cells.forEach(cell => {
  cell.addEventListener('click', () => handleCellClick(Number(cell.dataset.index)));
});
newGameBtn.addEventListener('click', resetGame);
btnPvp.addEventListener('click', () => setMode('pvp'));
btnAi.addEventListener('click',  () => setMode('ai'));
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => setDifficulty(btn.dataset.level));
});

// ─── Mode & Difficulty ───────────────────────────────────────────────────────

/**
 * Switch between 'pvp' and 'ai' modes.
 * @param {string} mode
 */
function setMode(mode) {
  gameMode = mode;
  btnPvp.classList.toggle('active', mode === 'pvp');
  btnAi.classList.toggle('active',  mode === 'ai');
  if (mode === 'ai') {
    diffSelector.removeAttribute('hidden');
  } else {
    diffSelector.setAttribute('hidden', '');
  }
  resetGame();
}

/**
 * Set AI difficulty level.
 * @param {string} level - 'easy' | 'medium' | 'hard'
 */
function setDifficulty(level) {
  aiDifficulty = level;
  diffBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.level === level));
  resetGame();
}

// ─── Game Logic ──────────────────────────────────────────────────────────────

/**
 * Handle a cell click (human move only).
 * @param {number} index - 0-8 board position
 */
function handleCellClick(index) {
  // Ignore clicks when game is over, cell is filled, or AI is thinking
  if (gameOver || board[index] !== null || aiThinking) return;
  // In AI mode, ignore clicks when it's the AI's turn (O)
  if (gameMode === 'ai' && currentPlayer === 'O') return;

  placeMove(index);

  // After a human move in AI mode, trigger the AI's turn
  if (gameMode === 'ai' && !gameOver) {
    aiThinking = true;
    setStatus('🤖 AI is thinking…');
    setTimeout(makeAIMove, 400);
  }
}

/**
 * Place a mark at the given index for the current player,
 * then check win/draw and switch player.
 * @param {number} index
 */
function placeMove(index) {
  board[index] = currentPlayer;
  renderBoard();

  const winCombo = getWinCombo();
  if (winCombo) {
    highlightWinner(winCombo);
    if (gameMode === 'ai') {
      setStatus(
        currentPlayer === 'X'
          ? 'You win! 🎉'
          : 'AI wins! 🤖',
        'winner'
      );
    } else {
      setStatus(
        `Player <span class="${playerClass(currentPlayer)}">${currentPlayer}</span> wins! 🎉`,
        'winner'
      );
    }
    gameOver = true;
    return;
  }

  if (isDraw()) {
    setStatus("It's a draw! 🤝", 'draw');
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateTurnStatus();
}

/**
 * Update the status bar to show whose turn it is.
 */
function updateTurnStatus() {
  if (gameMode === 'ai') {
    setStatus(currentPlayer === 'X' ? 'Your turn' : '🤖 AI is thinking…');
  } else {
    setStatus(`Player <span class="${playerClass(currentPlayer)}">${currentPlayer}</span>'s turn`);
  }
}

/**
 * Check whether the current board has a winner.
 * @returns {number[]|null} winning combo indices, or null
 */
function getWinCombo() {
  return winnerOnBoard(board);
}

/**
 * Check a given board state for a winner.
 * Operates on any board array, making it safe to use inside minimax.
 * @param {(null|string)[]} boardState
 * @returns {number[]|null} winning combo or null
 */
function winnerOnBoard(boardState) {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return combo;
    }
  }
  return null;
}

/**
 * Check whether the game is a draw (board full, no winner).
 * @returns {boolean}
 */
function isDraw() {
  return board.every(cell => cell !== null);
}

// ─── AI ──────────────────────────────────────────────────────────────────────

/**
 * Execute the AI's move after the thinking delay.
 */
function makeAIMove() {
  aiThinking = false;
  if (gameOver) return;  // edge case: game ended while waiting
  const index = getAIMove();
  placeMove(index);
}

/**
 * Dispatch to the correct AI strategy based on difficulty.
 * @returns {number} board index the AI will play
 */
function getAIMove() {
  if (aiDifficulty === 'easy')   return getRandomMove();
  if (aiDifficulty === 'medium') return getMediumMove();
  return getBestMove(); // hard: minimax
}

/**
 * Easy: pick a random empty cell.
 * @returns {number}
 */
function getRandomMove() {
  const empty = board.reduce((acc, v, i) => v === null ? [...acc, i] : acc, []);
  return empty[Math.floor(Math.random() * empty.length)];
}

/**
 * Medium: take a winning move if available, block a human win,
 * otherwise play randomly.
 * @returns {number}
 */
function getMediumMove() {
  // 1. Can AI win immediately?
  const win = findWinningMove('O');
  if (win !== -1) return win;
  // 2. Must AI block human?
  const block = findWinningMove('X');
  if (block !== -1) return block;
  // 3. Random fallback
  return getRandomMove();
}

/**
 * Find the index where placing `player`'s mark would win,
 * or -1 if no such move exists.
 * @param {string} player - 'X' or 'O'
 * @returns {number}
 */
function findWinningMove(player) {
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = player;
    const won = winnerOnBoard(board) !== null;
    board[i] = null;
    if (won) return i;
  }
  return -1;
}

/**
 * Hard: return the optimal move using the minimax algorithm.
 * AI is always 'O' (maximising player).
 * @returns {number}
 */
function getBestMove() {
  let bestScore = -Infinity;
  let bestIndex = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] !== null) continue;
    board[i] = 'O';
    const score = minimax(board, 0, false);
    board[i] = null;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }
  return bestIndex;
}

/**
 * Minimax algorithm.
 * AI ('O') maximises; Human ('X') minimises.
 * @param {(null|string)[]} boardState - board to evaluate (mutated then restored)
 * @param {number} depth - recursion depth (used to prefer faster wins)
 * @param {boolean} isMaximizing - true when it's O's turn
 * @returns {number} score
 */
function minimax(boardState, depth, isMaximizing) {
  const winCombo = winnerOnBoard(boardState);
  if (winCombo) {
    const winner = boardState[winCombo[0]];
    return winner === 'O' ? 10 - depth : depth - 10;
  }
  if (boardState.every(c => c !== null)) return 0; // draw

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] !== null) continue;
      boardState[i] = 'O';
      best = Math.max(best, minimax(boardState, depth + 1, false));
      boardState[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] !== null) continue;
      boardState[i] = 'X';
      best = Math.min(best, minimax(boardState, depth + 1, true));
      boardState[i] = null;
    }
    return best;
  }
}

// ─── Rendering ───────────────────────────────────────────────────────────────

/**
 * Sync the DOM cells with the current board state.
 */
function renderBoard() {
  cells.forEach((cell, i) => {
    const mark = board[i];
    cell.textContent = mark ?? '';
    if (mark) {
      cell.dataset.mark = mark;
      cell.setAttribute('aria-label', `Cell ${i + 1}: ${mark}`);
    } else {
      delete cell.dataset.mark;
      cell.setAttribute('aria-label', `Cell ${i + 1}: empty`);
    }
    cell.classList.remove('winner');
  });
}

/**
 * Add the winner CSS class to the three winning cells.
 * @param {number[]} combo - array of 3 board indices
 */
function highlightWinner(combo) {
  combo.forEach(i => cells[i].classList.add('winner'));
}

/**
 * Update the status bar text and optional modifier class.
 * @param {string} html - innerHTML for the status bar
 * @param {string} [modifier] - optional CSS class ('winner' | 'draw')
 */
function setStatus(html, modifier) {
  statusEl.innerHTML = html;
  statusEl.className = 'status-bar' + (modifier ? ` ${modifier}` : '');
}

/**
 * Return the CSS class name for a player's colour.
 * @param {string} player - 'X' or 'O'
 * @returns {string}
 */
function playerClass(player) {
  return player === 'X' ? 'player-x' : 'player-o';
}

// ─── Reset ───────────────────────────────────────────────────────────────────

/**
 * Reset the game to its initial state.
 * Preserves gameMode and aiDifficulty.
 */
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  aiThinking = false;
  renderBoard();
  updateTurnStatus();
}

// ─── Initialise ──────────────────────────────────────────────────────────────
updateTurnStatus();
