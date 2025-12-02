# Scipher Clone UI (Demo)

This is a lightweight React + Vite scaffold that reproduces the UI of scipher.gg (Taboo mode).
It is intentionally **frontend-only** and uses mock data. Socket.io client is included in package.json
so you can later enable real-time features.

## How to run
1. Unzip the archive
2. `cd scipher_clone_ui`
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:5173`

## What this contains
- A Vite + React project
- `src/components/GameBoard.jsx` — main UI matching your screenshots
- Mock words and timer
- CSS that mimics scipher.gg's dark aesthetic

## Next steps to complete the app
- Add Socket.IO server (Node.js + Socket.IO)
- Implement rooms, turn rotation, and scoring logic on the backend
- Replace mock data with server-sent state
- Add authentication / Discord login (optional)
