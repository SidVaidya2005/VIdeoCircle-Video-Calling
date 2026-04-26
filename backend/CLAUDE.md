# CLAUDE.md — backend

This file provides guidance to Claude Code (claude.ai/code) when working with the backend package. For repo-wide context, see `../CLAUDE.md`.

## Stack & conventions

- **Express 5** with native ESM (`"type": "module"`). Use `import` syntax and include the `.js` extension on relative imports — Node ESM does not auto-resolve.
- No TypeScript, no linter, **no tests** in this package. Don't add a test runner without asking.
- **Layered architecture**: `app.js` is boot only. Each domain lives in `modules/<name>/` as `routes → controller → service → model`. Cross-cutting concerns are in `middleware/`. Env reads are confined to `config/env.js`.

## Layout

```
src/
  app.js                       boot only — assemble app, mount routes, listen
  config/
    env.js                     reads + validates process.env (fails fast at boot)
    db.js                      mongoose.connect with TLS
  middleware/
    auth.js                    requireAuth — validates Bearer token, attaches req.user
    errorHandler.js            final catch-all + notFoundHandler
    validate.js                validate(zodSchema) — parses {body, query, params} → req.validated
    rateLimit.js               named limiters (loginLimiter, tokenLimiter, …)
  modules/
    users/
      users.routes.js          limiter → validate → (requireAuth) → controller
      users.controller.js      thin: req.validated → service → res
      users.service.js         business logic (register/login/findUserByToken/history)
      users.validation.js      Zod schemas
      users.model.js           Mongoose User
      meeting.model.js         Mongoose Meeting (history records)
    meet/
      meet.routes.js
      meet.controller.js
      meet.service.js          generateLiveKitToken
      meet.validation.js
  utils/
    AppError.js                throwable error with HTTP status
    tokens.js                  generateSessionToken, sessionExpiry, isExpired
    logger.js                  console wrapper, swappable
```

## Commands

```bash
npm run dev      # nodemon src/app.js — hot reload
npm start        # node src/app.js
npm run prod     # pm2 src/app.js
```

There is no test/lint script.

## Required environment

Read once in `config/env.js`. The app **throws at boot** if any required var is missing (was previously a per-request 500). Set in `backend/.env`:

- `MONGO_URL` — required.
- `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL` — all required.
- `PORT` — optional, defaults to 8000.

Never read `process.env.*` outside `config/env.js`. Import the typed `env` object instead.

## Auth model — non-obvious

`modules/users/users.service.js` implements a session-token scheme. Tokens are **not JWTs**:

- `crypto.randomBytes(20).toString("hex")` (40 chars), 7-day TTL, stored on the `User` doc as `token` + `tokenExpiry`. Helpers live in `utils/tokens.js`.
- `findUserByToken` is the authoritative validator — it lazily clears expired token fields. **Don't roll a parallel check elsewhere.**
- `middleware/auth.js#requireAuth` is the only entry point for protected routes. It calls `findUserByToken` and attaches `req.user`. Never call the service directly from a controller for auth purposes.
- Login overwrites the existing token (single-session-per-user). No server-side logout endpoint.

## How to add a new endpoint

1. Add a Zod schema to `<module>.validation.js` shaped as `z.object({ body|query|params: ... })`.
2. Add the business logic to `<module>.service.js`. Throw `new AppError(message, status)` on expected failures; let unexpected errors bubble.
3. Add a thin handler to `<module>.controller.js`: read `req.validated.{body|query|params}` and `req.user`, call the service, send the response. **No try/catch** — Express 5 forwards async rejections, the central `errorHandler` shapes the response.
4. Wire it in `<module>.routes.js` as: `limiter → validate(schema) → [requireAuth] → controller`.

Error responses are always `{ status, message }`. Validation failures additionally include `issues: [{ path, message }]`.

## LiveKit token endpoint

`GET /api/v1/meet/get-token?room=<r>&username=<u>` is **unauthenticated**. Returns a 1h LiveKit JWT with `roomJoin`, `canPublish`, `canSubscribe`, **and `roomCreate`**. Identity is `${username}-${randomUUID}` to prevent collisions when two callers pick the same name; `name` is the raw username (used for chat display). Don't drop the UUID suffix — LiveKit treats two participants with the same identity as one and disconnects the older one.

## Mongoose models

- `User` (`modules/users/users.model.js`) — `name`, `username` (unique), `password` (bcrypt 10 rounds), `token`, `tokenExpiry`.
- `Meeting` (`modules/users/meeting.model.js`) — `user_id` stores `username` (a string, **not** an ObjectId), `meetingCode`, `date`. Lives under `users/` because it's user-history data.

## Things that look like bugs but aren't

- The `add_to_activity` endpoint accepts both `meetingCode` and `meeting_code` in the body — the Zod schema in `users.validation.js` normalizes either form to `meetingCode`. Frontend currently sends `meeting_code`; new clients should send `meetingCode`.
- `app.js` calls `start()` at the top level and lets unhandled rejections bubble. Don't wrap in try/catch — Mongoose connection failures should crash the process so the platform restarts it.
- All rate-limiters share the same window/cap (15 min / 100 req per IP). They're named separately so behavior can diverge later without touching call sites.
