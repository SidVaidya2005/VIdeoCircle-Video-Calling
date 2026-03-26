# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack video conferencing web application (Zoom clone) with a React frontend and Node.js/Express backend.

## Commands

### Frontend (`/frontend`)
```bash
npm start       # Dev server on http://localhost:3000
npm run build   # Production build
npm test        # Run tests (Jest + React Testing Library)
```

### Backend (`/backend`)
```bash
npm run dev     # Development with nodemon hot reload on port 8000
npm start       # Production start
npm run prod    # Start with PM2 process manager
```

## Architecture

### Communication Patterns

The frontend communicates with the backend via two channels:

1. **REST API** (auth + history) — Axios client targeting `/api/v1/users`:
   - `POST /register`, `POST /login` — auth endpoints returning a 40-char hex token
   - `POST /add_to_activity`, `GET /get_all_activity` — meeting history

2. **Socket.IO** (real-time signaling) — used for WebRTC peer discovery and in-meeting chat:
   - `join-call` — user joins a room (keyed by URL path/meeting code)
   - `signal` — relay WebRTC SDP offer/answer/ICE candidates between peers
   - `chat-message` — broadcast chat messages within a room

### Video Call Flow

1. User enters a meeting code on `/home` → navigates to `/:meetingCode`
2. `VideoMeet.jsx` requests camera/mic via `getUserMedia`, then connects via Socket.IO
3. Server maintains `connections[path]` (socket IDs per room) and notifies existing peers
4. Peers exchange SDP via `signal` events through the server; direct WebRTC connections form
5. STUN server: `stun:stun.l.google.com:19302`

### Authentication

- Token stored in `localStorage`; no JWT — backend looks up the token directly in MongoDB
- `withAuth.jsx` HOC guards authenticated routes (e.g., `/home`, `/history`)
- Passwords hashed with bcrypt (10 rounds)
- `/guest` is an unprotected route — skips auth guard and meeting history tracking; intended for unauthenticated users joining a meeting directly

### Environment Configuration

**Backend** requires a `.env` file:
```
MONGO_URL=mongodb+srv://...
PORT=8000  # optional
```

**Frontend** backend URL is toggled in `frontend/src/environment.js` via `IS_PROD` flag — set to `false` for local development to target `http://localhost:8000`.

### Key Files

| File | Purpose |
|------|---------|
| `backend/src/app.js` | Express + Socket.IO initialization |
| `backend/src/controllers/socketManager.js` | WebRTC signaling logic |
| `backend/src/controllers/user.controller.js` | Auth + history API handlers |
| `frontend/src/App.js` | Route definitions |
| `frontend/src/contexts/AuthContext.jsx` | Auth context + Axios client |
| `frontend/src/pages/VideoMeet.jsx` | Main video call component |
| `frontend/src/pages/landing.jsx` | Landing page (`/`) — ASCII canvas, top nav with `[JOIN AS GUEST]`, `[REGISTER]`, `[LOGIN]` |
| `frontend/src/pages/authentication.jsx` | Auth page (`/auth`) — sign in + register tabs |
| `frontend/src/pages/guest.jsx` | Guest join page (`/guest`) — unprotected, no history tracking |
| `frontend/src/environment.js` | Backend URL config (toggle `IS_PROD`) |
