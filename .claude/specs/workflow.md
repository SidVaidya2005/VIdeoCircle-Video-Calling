# VideoCircle — Development Workflow

How work flows through this repo, day to day. Companion to `design.md` (visual system) and `techstack.md` (libraries).

## 1. Repository Shape

Two-package monorepo. Each package installs and runs independently — there is no root `package.json` or workspace tool.

```
VideoCircle/
├── frontend/   # React 18 (CRA), deployed to Vercel
└── backend/    # Express 5 (ESM), deployed to Railway
```

Run scripts from inside the package, never from root.

## 2. First-Time Setup

```bash
git clone <repo> && cd VideoCircle
cp backend/.env.example  backend/.env   # fill in MONGO_URL, LIVEKIT_*
cp frontend/.env.example frontend/.env  # fill in REACT_APP_LIVEKIT_URL
```

Required services:
- **MongoDB Atlas** — free tier; whitelist your IP under *Network Access*.
- **LiveKit Cloud** — free project at livekit.io for `LIVEKIT_API_KEY` / `_SECRET` / `_URL`.

`LIVEKIT_URL` (backend) and `REACT_APP_LIVEKIT_URL` (frontend) **must point at the same project** — mismatched values fail silently after the JWT validates.

## 3. Daily Loop

Two terminals:

```bash
# Terminal 1 — backend
cd backend && npm install && npm run dev   # nodemon on :8000

# Terminal 2 — frontend
cd frontend && npm install && npm start    # CRA dev server on :3000
```

Backend hot-reloads via `nodemon`. Frontend hot-reloads via CRA. No watch task to start manually.

If the backend fails to boot, it's almost always a missing env var — `config/env.js` throws fast at boot.

## 4. Where Code Lives

### Frontend — feature folders + `shared/`

```
frontend/src/
  app/         # routes.jsx, providers.jsx, App.jsx
  features/    # auth, home, history, landing, meet
  shared/      # apiClient, env, storage, hooks, theme, styles
```

Per-feature shape: `pages/`, `components/`, `services/<feature>Api.js`, optional `context/` and `livekit/`. The `meet/` feature also has `livekit/` and `styles/`.

### Backend — layered modules

```
backend/src/
  app.js            # boot only
  config/           # env.js, db.js
  middleware/       # auth, errorHandler, validate, rateLimit
  modules/<name>/   # routes → controller → service → model
  utils/            # AppError, tokens, logger
```

Routes wire `limiter → validate → [requireAuth] → controller`. Controllers stay thin: `req.validated → service → res`.

## 5. Adding Things

### A new frontend page

1. Decide the feature folder. New domain → `features/<name>/pages/<PageName>.jsx`.
2. If it makes HTTP calls, add `features/<name>/services/<name>Api.js` using `shared/lib/apiClient`.
3. Register the route in `app/routes.jsx` **above** `/:meetingCode` — that route is a catch-all for meeting codes.
4. If protected, wrap the export with `withAuth(...)` from `features/auth/components/withAuth`.

### A new backend endpoint

1. Add a Zod schema in `<module>.validation.js` shaped as `z.object({ body|query|params: ... })`.
2. Add the business logic to `<module>.service.js`. Throw `new AppError(message, status)` on expected failures; let unexpected errors bubble.
3. Add a thin handler to `<module>.controller.js`: read `req.validated.{body|query|params}` and `req.user`, call the service, send. **No try/catch** — Express 5 forwards async rejections.
4. Wire it in `<module>.routes.js`: `limiter → validate(schema) → [requireAuth] → controller`.

### Reading env vars

Never read `process.env.*` outside the single source of truth:
- Backend: `backend/src/config/env.js`
- Frontend: `frontend/src/shared/lib/env.js`

Add new vars to **both** the env.js and the matching `.env.example` so future contributors know what to set.

## 6. Quick Reference — Commands

| Command | Where | Effect |
|---|---|---|
| `npm install` | `frontend/` or `backend/` | Install deps |
| `npm run dev` | `backend/` | Nodemon hot reload on `:8000` |
| `npm start` | `backend/` | Production-style `node src/app.js` |
| `npm run prod` | `backend/` | PM2 (host must have it globally) |
| `npm start` | `frontend/` | CRA dev server on `:3000` |
| `npm run build` | `frontend/` | Production build → `frontend/build/` |
| `npm test -- <pattern>` | `frontend/` | Single test file (CRA pass-through to Jest) |

There is no root-level command runner, no lint script, and no test suite in active use (CRA's defaults are present but unused).

## 7. Verification Before Pushing

Manual checklist — run through the **golden path** in two browser windows:

1. Backend boots: `npm run dev` logs Mongo host + listening port, no env errors.
2. Frontend compiles: `npm start` finishes with "Compiled successfully", no module-not-found.
3. **Window A**: register → log in → land on `/guest`.
4. **Window A**: enter code `smoke-test` → lobby → camera preview → join.
5. **Window B**: open the same URL → enter name → join.
6. Both: see each other's video, send a chat message, toggle mic, share screen, end call.
7. **Window A**: navigate to `/history` → see `smoke-test` listed.
8. Endpoint sanity (curl): `GET /api/v1/meet/get-token?room=x&username=y` returns `{token, url}`. `POST /api/v1/users/login` with bad body returns 4xx with `{ status, message, issues }`.
9. Production build: `npm run build` succeeds with no new warnings.

If any step fails, fix before opening the PR.

## 8. Git Conventions

- `main` is the deploy branch — Vercel auto-deploys frontend, Railway auto-deploys backend.
- Conventional-ish commit prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- One concern per commit. Don't bundle unrelated cleanup into a feature commit.
- `.gitignore` is the single source of truth — `CLAUDE.md` files **are** tracked, `vercel.json` and both `.env` files are not.

## 9. Deploys

- **Frontend**: push to `main` → Vercel builds with `cd frontend && npm install && npm run build`. Vars in Vercel project settings (`REACT_APP_SERVER_URL`, `REACT_APP_LIVEKIT_URL`).
- **Backend**: push to `main` → Railway runs `npm start`. Vars in Railway project settings (all `MONGO_URL` / `LIVEKIT_*` / optional `PORT`).
- Neither deploy uses Docker; the host runs Node directly.

## 10. Common Gotchas

- **`/:meetingCode` is a catch-all**. Any new top-level route must go *above* it in `app/routes.jsx` or the router will treat the path as a meeting code.
- **Frontend will silently fail on missing `REACT_APP_LIVEKIT_URL`** — there is no fallback. Backend will fail loudly on any missing var.
- **In-call chat is LiveKit's data channel**, not a separate WebSocket. Don't introduce Socket.IO.
- **`getUserMedia` collisions**: the lobby preview holds its own stream; it must stop all tracks before LiveKit re-acquires the camera. Don't keep a reference past `onJoin`.
- **`ConferenceGrid` filters out the local participant**; the local feed is shown only via `LocalVideoPIP`. Change one → change the other.
- **Login overwrites the existing session token** (single-session-per-user). There is no server-side logout endpoint — the client just clears storage.
- **`.DS_Store` files**: ignored at root, but historical ones may already be tracked. `git rm --cached <path>` if you spot one.

## 11. When in Doubt

- Repo-wide context: `CLAUDE.md` (root)
- Frontend conventions: `frontend/CLAUDE.md`
- Backend conventions: `backend/CLAUDE.md`
- Visual system: `.claude/specs/design.md`
- Library inventory: `.claude/specs/techstack.md`

If a convention you need isn't documented in any of those, ask before guessing — these files are the contract.
