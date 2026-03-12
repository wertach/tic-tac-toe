# Claude.md — Tic Tac Toe Project

> This file captures all planning decisions and architectural choices made during development with Claude. It serves as the persistent record of the "why" behind the project.

---

## Project Overview

**Goal:** A responsive Tic Tac Toe webapp with 2-player local and single-player vs AI modes.

**Repo:** https://github.com/wertach/tic-tac-toe.git
**Local folder:** `C:/users/susi/tic-tac-toe`
**Live URL (after deploy):** https://wertach.github.io/tic-tac-toe/

---

## Key Decisions

| Topic | Decision | Rationale |
|---|---|---|
| Stack | Plain HTML / CSS / JS | No build tools needed; zero dependencies; works on GitHub Pages with no config |
| v1 Features | 2-player local only | Clean first version; solid foundation |
| Styling | Custom CSS only | Full control; no external dependencies |
| Deployment | GitHub Pages (`main` branch, root folder) | Free; zero-config for static file projects |
| State model | Simple array (`board[9]`) + flags | Minimal and easy to reason about |
| Win detection | Hardcoded 8-combo lookup table | Most readable and performant for a fixed 3×3 grid |
| AI mode UX | Toggle above board, always visible | Quick to switch modes without a separate screen |
| AI difficulty | Easy / Medium / Hard (3 levels) | Covers casual, learning, and challenge players |
| AI identity | AI always plays as 'O'; human always 'X' | Conventional; avoids extra player-choice UI |
| AI turn delay | 400 ms artificial pause | Feels more natural; prevents snap-response disorientation |

---

## Architecture

### File Structure
```
tic-tac-toe/
├── index.html    ← Semantic HTML5 markup; mode/difficulty toggles; 9 <button> cells
├── style.css     ← CSS custom properties; mobile-first; CSS Grid board; toggle styles
├── script.js     ← Game state, game logic, AI strategies, mode/difficulty control
├── README.md     ← User-facing docs; run & deploy instructions
└── claude.md     ← This file
```

---

### State (script.js)

| Variable | Type | Purpose |
|---|---|---|
| `board` | `(null\|'X'\|'O')[]` | Current marks on all 9 cells |
| `currentPlayer` | `'X'\|'O'` | Whose turn it is |
| `gameOver` | `boolean` | Prevents moves after win/draw |
| `gameMode` | `'pvp'\|'ai'` | Current game mode |
| `aiDifficulty` | `'easy'\|'medium'\|'hard'` | Selected AI level |
| `aiThinking` | `boolean` | Blocks human clicks during AI delay |

---

### Functions (script.js)

#### Mode & Difficulty
| Function | Purpose |
|---|---|
| `setMode(mode)` | Switch between 'pvp' and 'ai'; show/hide difficulty row; reset game |
| `setDifficulty(level)` | Update AI difficulty; highlight active button; reset game |

#### Game Logic
| Function | Purpose |
|---|---|
| `handleCellClick(index)` | Human move handler; guards against gameOver, filled cell, AI thinking |
| `placeMove(index)` | Shared logic: place mark, check win/draw, switch player, update status |
| `updateTurnStatus()` | Show contextual status (Your turn / AI thinking / Player X's turn) |
| `getWinCombo()` | Check global `board` for a winner; returns combo or null |
| `winnerOnBoard(boardState)` | Win-check on any board array (used by game loop AND minimax) |
| `isDraw()` | True if all cells filled and no winner |

#### AI Strategies
| Function | Difficulty | Behaviour |
|---|---|---|
| `getAIMove()` | — | Dispatcher: routes to correct strategy |
| `getRandomMove()` | Easy | Picks a random empty cell |
| `getMediumMove()` | Medium | Take win → block human win → random |
| `findWinningMove(player)` | Medium helper | Tests each empty cell; returns winning index or -1 |
| `getBestMove()` | Hard | Tries all moves; picks highest minimax score |
| `minimax(boardState, depth, isMaximizing)` | Hard | Recursive minimax; AI (O) maximises, human (X) minimises; depth-adjusted scores prefer faster wins |
| `makeAIMove()` | — | Called after delay; invokes `getAIMove()` then `placeMove()` |

#### Rendering & UI
| Function | Purpose |
|---|---|
| `renderBoard()` | Sync DOM cells with board state; clear winner highlights |
| `highlightWinner(combo)` | Add `.winner` CSS class to three winning cells |
| `setStatus(html, modifier)` | Update status bar text + optional CSS modifier class |
| `playerClass(player)` | Return CSS colour class for 'X' or 'O' |
| `resetGame()` | Clear state; re-render; preserve mode/difficulty |

---

### AI Difficulty Design

| Level | Strategy | Can it lose? |
|---|---|---|
| Easy | Random empty cell | Yes, frequently |
| Medium | Win if possible → block if needed → random | Yes (no look-ahead beyond 1 move) |
| Hard | Minimax (full look-ahead) | Never (always optimal play) |

The `winnerOnBoard(boardState)` function is the key shared utility: it accepts any board array, making it safe for both the live game loop and the recursive minimax tree without touching global state.

---

### Responsive Design Strategy
- CSS Grid board: `grid-template-columns: repeat(3, var(--cell-size))`
- Cell size: `min(28vw, 120px)` — scales on any screen, caps on desktop
- Mode/difficulty toggles: pill-shaped buttons using `border-radius: 999px`, flex-wrapped
- Extra small screen breakpoint at 360px scales down all button text and padding

---

## Deployment Steps (GitHub Pages)
1. Push all files to `main` branch
2. GitHub repo → Settings → Pages
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save → site live at `https://wertach.github.io/tic-tac-toe/`

---

## Future Enhancement Ideas
These are intentionally out of scope but noted for future sessions:

- **Player name input** — let players enter names before the game
- **Score tracking** — persist win/loss/draw counts across rounds (localStorage)
- **Dark mode** — CSS custom property swap via a toggle button
- **Win animation** — animate the winning line across the board
- **Sound effects** — subtle click / win / draw sounds
- **Choose your mark** — let human pick X or O in AI mode

---

## Development Session Notes

### Session 1 — 2026-03-12
- Built v1: plain HTML/CSS/JS, 2-player local, responsive, GitHub Pages deployment
- Stack: no frameworks, no build tools

### Session 2 — 2026-03-12
- Added single-player vs AI mode (additive; 2-player mode fully preserved)
- AI implemented with three difficulty levels:
  - Easy: random
  - Medium: greedy 1-move look-ahead (win/block/random)
  - Hard: minimax (unbeatable)
- Mode + difficulty toggle UI added above the board
- Key architectural decision: extracted `winnerOnBoard(boardState)` as a pure function
  that works on any board array, enabling safe use inside minimax recursion
