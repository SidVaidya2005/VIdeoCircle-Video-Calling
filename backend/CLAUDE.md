# CLAUDE.md — backend

This file provides guidance to Claude Code (claude.ai/code) when working with the backend package. For repo-wide context, see `../CLAUDE.md`.

## Stack & conventions

- **Express 5** with native ESM (`"type": "module"` in `package.json`). Use `import` syntax and include the `.js` extension on relative imports — Node ESM does not auto-resolve.
- No TypeScript, no linter, **no tests** in this package. Don't add a test runner without asking.
- `src/app.js` is the entry point — boots Mongoose then `app.listen()`. Body limits are 40kb on JSON and urlencoded bodies; bumping these has security implications, ask first.

## Commands

```bash
npm run dev      # nodemon src/app.js — hot reload during development
npm start        # node src/app.js
npm run prod     # pm2 src/app.js (used in some deploy configs)
```

There is no test/lint script.

## Required environment

`src/app.js` and `src/controllers/meet.controller.js` will throw or 500 without these (set in `backend/.env`):

- `MONGO_URL` — Mongoose connects with `tls: true`, no fallback URL.
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL` — all three are required for `/api/v1/meet/get-token`.
- `PORT` — optional, defaults to 8000.

## Route surface

Mounted in `src/app.js`:

- `/api/v1/users` → `routes/users.routes.js` → `controllers/user.controller.js`
- `/api/v1/meet`  → `routes/meet.routes.js`  → `controllers/meet.controller.js`

All routes use `express-rate-limit` (100 req / 15 min per IP) **except** `POST /add_to_activity` and `GET /verify`, which currently have no limiter. If you add new auth-bearing routes, add a limiter alongside the existing ones.

## Auth model — non-obvious

`controllers/user.controller.js` implements its own session-token scheme. Tokens are **not JWTs**:

- `crypto.randomBytes(20).toString("hex")` (40 chars), 7-day TTL stored on the `User` doc as `token` + `tokenExpiry`.
- `extractToken(req)` reads `Authorization: Bearer <token>`.
- `findValidUser(token)` is the authoritative validator — it also **lazily clears** expired token fields back to `undefined` and saves. Any new protected endpoint must go through `findValidUser`, not roll its own check.
- Login overwrites the existing token, so a user is effectively logged in on one session at a time.
- There is no logout endpoint that invalidates server-side; the frontend just deletes from `localStorage`.

## LiveKit token endpoint

`GET /api/v1/meet/get-token?room=<r>&username=<u>` is **unauthenticated**. It returns a 1h LiveKit JWT with `roomJoin`, `canPublish`, `canSubscribe`, **and `roomCreate`**. The token's `identity` is `${username}-${randomUUID}` to prevent identity collisions when two callers pick the same name; `name` is the raw username (used for chat display). Don't drop the UUID suffix without auditing — LiveKit treats two participants with the same identity as one and will disconnect the older one.

## Mongoose models

Both schemas are minimal and live in `src/models/`:

- `User` — `name`, `username` (unique), `password` (bcrypt 10 rounds), `token`, `tokenExpiry`. No timestamps option set.
- `Meeting` — `user_id` (stores `username`, **not** an ObjectId — keep this in mind when querying), `meetingCode`, `date`.

Meetings are written by `addToHistory` whenever a logged-in user joins a code via `/home`. Guests do not create history rows.

## Things that look like bugs but aren't

- `register` returns `httpStatus.FOUND` (302) on duplicate username. Frontend reads `err.response.status` to drive UX — changing the status will break the auth page.
- `app.js` calls `start()` at the top level and lets unhandled rejections bubble. Do not wrap it in a try/catch that swallows — Mongoose connection errors should crash the process so the platform restarts it.
