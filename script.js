// ─── State ──────────────────────────────────────────────────────────────────
let board = Array(9).fill(null);   // null | 'X' | 'O'
let currentPlayer = 'X';
let gameOver = false;

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
const cells = document.querySelectorAll('.cell');
const statusEl = document.getElementById('status');
const newGameBtn = document.getElementById('new-game-btn');

// ─── Event Listeners ─────────────────────────────────────────────────────────
cells.forEach(cell => {
  cell.addEventListener('click', () => handleCellClick(Number(cell.dataset.index)));
});

newGameBtn.addEventListener('click', resetGame);

// ─── Game Logic ──────────────────────────────────────────────────────────────

/**
 * Handle a cell click.
 * @param {number} index - 0-8 board position
 */
function handleCellClick(index) {
  if (gameOver || board[index] !== null) return;

  board[index] = currentPlayer;
  renderBoard();

  const winCombo = getWinCombo();
  if (winCombo) {
    highlightWinner(winCombo);
    setStatus(`Player <span class="${playerClass(currentPlayer)}">${currentPlayer}</span> wins! 🎉`, 'winner');
    gameOver = true;
    return;
  }

  if (isDraw()) {
    setStatus("It's a draw! 🤝", 'draw');
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  setStatus(`Player <span class="${playerClass(currentPlayer)}">${currentPlayer}</span>'s turn`);
}

/**
 * Check whether the current board has a winner.
 * @returns {number[]|null} winning combo indices, or null
 */
function getWinCombo() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
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
 */
function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  renderBoard();
  setStatus(`Player <span class="player-x">X</span>'s turn`);
}

// ─── Initialise ──────────────────────────────────────────────────────────────
// Set initial status on page load
setStatus(`Player <span class="player-x">X</span>'s turn`);
