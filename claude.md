# Claude.md — Tic Tac Toe Project

> This file captures all planning decisions and architectural choices made during development with Claude. It serves as the persistent record of the "why" behind the project.

---

## Project Overview

**Goal:** A simple, responsive Tic Tac Toe webapp for two local players.

**Repo:** https://github.com/wertach/tic-tac-toe.git
**Local folder:** `C:/users/susi/tic-tac-toe`
**Live URL (after deploy):** https://wertach.github.io/tic-tac-toe/

---

## Key Decisions

| Topic | Decision | Rationale |
|---|---|---|
| Stack | Plain HTML / CSS / JS | No build tools needed; zero dependencies; works on GitHub Pages with no configuration |
| Features | 2-player local only | Keep scope focused; clean first version |
| Styling | Custom CSS only | Full control; no external dependencies to manage |
| Deployment | GitHub Pages (`main` branch, root folder) | Free; zero-config for static file projects |
| State model | Simple array (`board[9]`) + flags | Minimal, easy to reason about for this scope |
| Win detection | Hardcoded 8-combo lookup table | Most readable and performant approach for a fixed 3×3 grid |

---

## Architecture

### File Structure
```
tic-tac-toe/
├── index.html    ← Semantic HTML5 markup; 9 <button> cells
├── style.css     ← CSS custom properties; mobile-first; CSS Grid board
├── script.js     ← All game logic; no dependencies
├── README.md     ← User-facing docs; run & deploy instructions
└── claude.md     ← This file
```

### State (script.js)
| Variable | Type | Purpose |
|---|---|---|
| `board` | `(null\|'X'\|'O')[]` | Current marks on all 9 cells |
| `currentPlayer` | `'X'\|'O'` | Whose turn it is |
| `gameOver` | `boolean` | Prevents moves after win/draw |

### Key Functions (script.js)
| Function | Purpose |
|---|---|
| `handleCellClick(index)` | Process a move, check win/draw, switch player |
| `getWinCombo()` | Check all 8 winning combos; return matching combo or null |
| `isDraw()` | True if all cells filled and no winner |
| `renderBoard()` | Sync DOM cells with board state |
| `highlightWinner(combo)` | Add CSS `.winner` class to winning cells |
| `resetGame()` | Reset state and re-render |
| `setStatus(html, modifier)` | Update the status bar text + CSS modifier class |

### Responsive Design Strategy
- CSS Grid board: `grid-template-columns: repeat(3, var(--cell-size))`
- Cell size: `min(28vw, 120px)` — scales on any screen, caps on desktop
- All spacing and font sizes use `clamp()` or CSS custom properties
- Extra small screen breakpoint at 360px

---

## Deployment Steps (GitHub Pages)
1. Push all files to `main` branch
2. GitHub repo → Settings → Pages
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save → site live at `https://wertach.github.io/tic-tac-toe/`

---

## Future Enhancement Ideas
These are intentionally out of scope for v1 but noted for future sessions:

- **AI opponent** — minimax algorithm for unbeatable computer play
- **Player names** — input fields before the game starts
- **Score tracking** — persist win/loss/draw counts across rounds (localStorage)
- **Dark mode** — CSS custom property swap via a toggle button
- **Win animation** — animate the winning line being drawn across the board
- **Sound effects** — subtle click / win / draw sounds

---

## Planning Session Notes

- Date: 2026-03-12
- Stack choice driven by desire for simplicity and direct GitHub Pages compatibility
- No AI opponent requested for v1 — human vs human only
- No score tracking in v1 — game resets cleanly with "New Game"
- Accessibility: all cells are `<button>` elements with ARIA labels; keyboard navigation works natively
