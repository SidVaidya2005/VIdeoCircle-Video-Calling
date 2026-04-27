# VideoCircle — Tech Stack

A two-package monorepo (no workspace tool — each package installs independently). Backend is a thin REST API; the browser opens WebRTC + WebSocket directly to LiveKit Cloud, so the backend holds no persistent connections and is serverless-compatible.

```
Browser ──REST(Axios)──► Express ──► MongoDB Atlas
   │
   └──WebRTC/WSS──► LiveKit Cloud (SFU)
```

---

## Frontend (`frontend/`)

Deployed to **Vercel** as a static React build.

### Core

| Tech | Version | Role |
|---|---|---|
| **React** | `^18.2.0` | UI runtime |
| **React DOM** | `^18.2.0` | DOM renderer |
| **React Router DOM** | `^6.21.1` | Client-side routing — `/`, `/auth`, `/home`, `/guest`, `/history`, `/:meetingCode` |
| **Create React App** (`react-scripts`) | `^5.0.1` | Build/dev/test toolchain — Webpack 5, Babel, Jest under the hood |

### UI & Styling

| Tech | Version | Role |
|---|---|---|
| **MUI Material** | `^5.15.4` | Inputs, buttons, icons; themed via `goldTheme` (`shared/theme/goldTheme.js`) wired in `app/providers.jsx` |
| **MUI Icons Material** | `^5.15.4` | Icon set (e.g. `RestoreIcon`) |
| **Emotion React** | `^11.11.3` | MUI's CSS-in-JS engine |
| **Emotion Styled** | `^11.11.0` | MUI's `styled()` API |
| **CSS Modules** | (Webpack/CRA built-in) | Scoped styles in `features/meet/styles/videoComponent.module.css` |
| **Plain CSS** | — | `shared/styles/{globals,tokens}.css`, imported once at boot in `index.js` |
| **Custom fonts** | — | Loaded via `<link>` in `public/index.html`: `Anton`, `Syne`, `Playfair Display`, `DM Sans`, `JetBrains Mono` |

### Real-Time Video / Audio / Chat

| Tech | Version | Role |
|---|---|---|
| **LiveKit Components React** | `^2.9.20` | `<LiveKitRoom>`, `useTracks`, `useLocalParticipant`, `useChat`, `RoomAudioRenderer` |
| **LiveKit Components Styles** | `^1.2.0` | Default LiveKit component CSS (overridden where needed) |
| **LiveKit Client** | `^2.18.1` | WebRTC/WSS client; `VideoPresets.h720`, simulcast + adaptive bitrate |

### HTTP & Auth

| Tech | Version | Role |
|---|---|---|
| **Axios** | `^1.6.5` | Single shared instance in `shared/lib/apiClient.js` with `Authorization: Bearer <token>` request interceptor |
| **localStorage** | (browser) | Token storage, accessed only via `shared/lib/storage.js` |

### Testing (CRA defaults — currently unused in practice)

| Tech | Version | Role |
|---|---|---|
| **Jest** | (via `react-scripts`) | Test runner |
| **Testing Library — React** | `^13.4.0` | Component testing |
| **Testing Library — Jest DOM** | `^5.17.0` | Custom DOM matchers |
| **Testing Library — User Event** | `^13.5.0` | Simulated interactions |

The repo carries a single placeholder `App.test.js`. There is no working test suite.

### Tooling & Misc

| Tech | Version | Role |
|---|---|---|
| **Web Vitals** | `^2.1.4` | CRA-default perf measurement (not currently sent anywhere) |
| **`http-status`** | `^1.7.3` | Status-code constants (legacy import; new code uses literals) |
| **`jsconfig.json`** | — | `"baseUrl": "src"` so imports resolve relative to `src/` |
| **ESLint (CRA preset)** | — | `react-app`, `react-app/jest` — runs implicitly via `react-scripts`; no separate lint script |

### Frontend env vars (`frontend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `REACT_APP_SERVER_URL` | No (defaults to `http://localhost:8000`) | Backend base URL |
| `REACT_APP_LIVEKIT_URL` | **Yes** | LiveKit Cloud WebSocket URL — no fallback; missing value silently breaks calls |

Both are read in exactly one place: `shared/lib/env.js`. CRA inlines them at build time.

---

## Backend (`backend/`)

Deployed to **Railway**. Stateless — no persistent connections, fully serverless-compatible.

### Runtime

| Tech | Version | Role |
|---|---|---|
| **Node.js** | 18+ | Runtime |
| **Express** | `^5.2.1` | HTTP server. Native async error forwarding (no manual try/catch in controllers) |
| **ESM** | (via `"type": "module"`) | Native ES modules — `import` everywhere; relative imports must include `.js` |

### Data

| Tech | Version | Role |
|---|---|---|
| **Mongoose** | `^8.0.3` | MongoDB ODM. Models: `User`, `Meeting` |
| **MongoDB Atlas** | (managed) | Database. Connection via `config/db.js` with TLS opts |

### Auth & Security

| Tech | Version | Role |
|---|---|---|
| **bcrypt** | `^5.1.1` | Password hashing (10 rounds) |
| **`crypto`** (Node built-in, declared as `crypto` `^1.0.1`) | — | `randomBytes(20).toString("hex")` session tokens (40 chars, 7-day TTL). The `crypto` npm package is a no-op shim — Node's built-in is what's used |
| **`express-rate-limit`** | `^8.3.1` | Named limiters in `middleware/rateLimit.js` (login, register, verify, history, token) — currently all 100 req / 15 min |
| **`cors`** | `^2.8.5` | Permissive CORS for the cross-origin Vercel frontend |

### Validation & Errors

| Tech | Version | Role |
|---|---|---|
| **Zod** | `^4.3.6` | Schema validation in `<module>/<module>.validation.js`. Runner in `middleware/validate.js` parses `{body, query, params}` → `req.validated`. Validation failures return `{ status, message, issues: [{path, message}] }` |
| **`AppError`** | (in-repo, `utils/AppError.js`) | Throwable error with HTTP status. Services throw it; the central `errorHandler` shapes the response |

### LiveKit

| Tech | Version | Role |
|---|---|---|
| **`livekit-server-sdk`** | `^2.15.1` | Signs short-lived (1h) JWTs. `roomJoin`, `canPublish`, `canSubscribe`, `roomCreate`. Identity is `${username}-${randomUUID}` to prevent collisions |

### Config & Process

| Tech | Version | Role |
|---|---|---|
| **`dotenv`** | `^17.3.1` | Loads `backend/.env` once in `config/env.js`. Boot-time validation throws if any required var is missing |
| **`nodemon`** | `^3.0.2` | Dev hot-reload (`npm run dev`) |
| **PM2** | (declared via `pm2 src/app.js`) | Production process manager (`npm run prod`) — not in `dependencies`, expected globally on the host |

### Misc

| Tech | Version | Role |
|---|---|---|
| **`http-status`** | `^1.7.3` | Status-code constants (legacy; new code uses literals) |

### Backend env vars (`backend/.env`)

| Variable | Required | Purpose |
|---|---|---|
| `MONGO_URL` | **Yes** | MongoDB Atlas connection string |
| `LIVEKIT_API_KEY` | **Yes** | LiveKit project API key |
| `LIVEKIT_API_SECRET` | **Yes** | LiveKit project API secret |
| `LIVEKIT_URL` | **Yes** | LiveKit Cloud WebSocket URL (echoed in token responses; the frontend uses its own `REACT_APP_LIVEKIT_URL` to actually connect — they must match) |
| `PORT` | No (default 8000) | HTTP port |

All read in exactly one place: `config/env.js`. The app **fails fast at boot** if any required var is missing.

---

## Infrastructure

| Tech | Role |
|---|---|
| **Vercel** | Hosts the static React build (`frontend/build`). `vercel.json` is intentionally git-ignored — config lives in the Vercel project settings |
| **Railway** | Hosts the Express server (`backend/`) |
| **MongoDB Atlas** | Managed MongoDB cluster |
| **LiveKit Cloud** | Managed SFU for video, audio, screen-share, and in-call chat data channel |

---

## Tooling on the host (not in `package.json`)

| Tech | Version expected | Role |
|---|---|---|
| **Node.js** | 18+ | Runtime for both packages |
| **npm** | 9+ | Package manager — used for both packages independently (no workspaces) |
| **git** | any recent | VCS |
| **PM2** | any recent | Optional, only for `backend npm run prod` |

---

## What is *not* in the stack (intentionally)

- **No Socket.IO / standalone WebSocket server.** In-call chat rides LiveKit's data channel via `useChat()`. The backend holds zero persistent connections.
- **No JWT for app auth.** App auth uses opaque hex session tokens stored on the user document. (LiveKit auth *is* a JWT — they're separate systems; don't conflate them.)
- **No TypeScript.** Pure JavaScript on both sides. A future migration is on the table but not in scope.
- **No linter or formatter** beyond CRA's implicit ESLint preset. No Prettier, no Husky, no pre-commit hooks.
- **No test infrastructure in active use.** CRA's Jest + Testing Library are present as defaults; the only test file is a placeholder.
- **No state management library** (no Redux, Zustand, Jotai). Local component state + a single `AuthContext` is the entire client-side store.
- **No CSS framework** (no Tailwind, no styled-components beyond Emotion, which ships with MUI). Plain CSS + CSS Modules + MUI's `sx` prop.
- **No GraphQL.** REST + JSON via Axios.
- **No analytics, no error reporting** (Sentry, LogRocket, etc.) wired up.
