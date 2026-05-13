# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Two-package monorepo (no workspaces tool — each package installs independently):

- `frontend/` — React 18 (CRA) app, deployed to Vercel. See `frontend/CLAUDE.md`.
- `backend/` — Express 5 (ESM) REST API, deployed to Railway. See `backend/CLAUDE.md`.

For anything beyond the cross-cutting notes below, read the package-specific CLAUDE.md.

## Big-picture architecture

Media is **not** proxied through the backend. The backend is a thin REST API that does two unrelated things:

1. User auth + meeting history (MongoDB-backed).
2. Issuing short-lived **LiveKit JWTs** so the browser can connect directly to LiveKit Cloud.

The browser opens a WebRTC + WebSocket connection straight to **LiveKit Cloud (SFU)** for video, audio, screen share, and in-call chat. In-call chat uses LiveKit's data channel via `useChat()` — there is no Socket.IO server. This is why the backend is serverless-compatible: it holds no persistent connections.

```
Browser ──REST(Axios)──► Express ──► MongoDB Atlas
   │
   └──WebRTC/WSS──► LiveKit Cloud (SFU)
```

## Two unrelated auth systems — don't conflate

- **App auth** (`/api/v1/users/*`): `crypto.randomBytes(20).toString("hex")` token, 7-day TTL, stored on the user document in MongoDB. Sent as `Authorization: Bearer <token>`. Validated by the `requireAuth` middleware (`backend/src/middleware/auth.js`), which lazily expires the token on read. **Not a JWT.**
- **LiveKit auth** (`/api/v1/meet/get-token`): server-signed JWT with a 1h TTL, issued via `livekit-server-sdk`. Endpoint is **public** — anyone with the URL can join any room as any name. Treat meeting codes as the only access control.

## Common commands

Fresh clone (run both, in separate terminals):

```bash
(cd backend  && npm install && npm run dev)   # :8000
(cd frontend && npm install && npm start)     # :3000
```

Per-package details:

```bash
# Backend
cd backend && npm install && npm run dev      # nodemon on PORT (default 8000)
cd backend && npm start                       # production node
cd backend && npm run lint                    # ESLint over src/**/*.js
cd backend && npm run lint:fix                # ESLint autofix
cd backend && npm run format:check            # Prettier check
cd backend && npm run format                  # Prettier write

# Frontend
cd frontend && npm install && npm start       # CRA dev server on :3000
cd frontend && npm run build                  # production build → frontend/build
cd frontend && npm test -- <pattern>          # CRA/Jest, single file: append the filename pattern
cd frontend && npm run lint                   # ESLint over src/**/*.{js,jsx}
cd frontend && npm run lint:fix               # ESLint autofix
cd frontend && npm run format:check           # Prettier check
cd frontend && npm run format                 # Prettier write
```

There is no root-level package.json or task runner. Run scripts from inside each package.

## Cross-cutting gotchas

- `vercel.json` is gitignored — the Vercel project config lives outside the repo, so don't assume it will be present in clones. (`CLAUDE.md` files **are** tracked.)
- Both `.env` files are required for any meaningful local dev. Templates: `backend/.env.example` and `frontend/.env.example` — copy these to `.env` and fill in values. The frontend will silently fail to connect to video calls if `REACT_APP_LIVEKIT_URL` is missing — there is no fallback.
- The frontend route `/:meetingCode` is a **catch-all** for meeting codes (`frontend/src/app/routes.jsx`). It is registered last; any new top-level route (e.g. `/settings`) must be added **above** it or it will be swallowed as a meeting code.
- `LIVEKIT_URL` (backend) and `REACT_APP_LIVEKIT_URL` (frontend) must point at the same LiveKit project — the backend embeds it in the token response and the frontend uses its own env var to actually connect. Mismatched values produce a connect that fails after the JWT validates.

## Documentation map

- `README.md` — user-facing overview, setup, API reference, deployment notes.
- `backend/CLAUDE.md` — backend architecture, commands, auth/session details, endpoint conventions.
- `frontend/CLAUDE.md` — frontend routing, auth, LiveKit component placement, and UI conventions.
- There is no checked-in `.claude/specs/` directory right now; don't reference design or workflow docs there unless they are added later.
