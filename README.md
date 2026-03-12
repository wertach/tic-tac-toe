# Tic Tac Toe

A simple, responsive two-player Tic Tac Toe game built with plain HTML, CSS, and JavaScript — no frameworks or build tools required.

## Features

- 2-player local play (Player X vs Player O)
- Win detection for all rows, columns, and diagonals
- Draw detection
- Winning cells highlighted
- "New Game" button to reset at any time
- Fully responsive — works on mobile, tablet, and desktop
- Accessible: semantic HTML, ARIA labels, keyboard-friendly

## How to Play

1. Player X goes first
2. Players take turns clicking empty cells on the 3×3 grid
3. The first player to get 3 in a row (horizontally, vertically, or diagonally) wins
4. If all 9 cells are filled with no winner, it's a draw
5. Click **New Game** to start a fresh round

## Run Locally

No build step needed — just open the file in your browser:

```
Double-click index.html
```

Or serve it with any local server (e.g. VS Code Live Server extension).

## Deploy to GitHub Pages

1. Push all files to the `main` branch of your GitHub repo
2. Go to your repo → **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose branch: `main`, folder: `/ (root)`
5. Click **Save**

Your game will be live at:
`https://wertach.github.io/tic-tac-toe/`

## Project Structure

```
tic-tac-toe/
├── index.html    ← Game markup
├── style.css     ← Responsive styles
├── script.js     ← Game logic
├── README.md     ← This file
└── claude.md     ← Planning decisions and architecture notes
```
