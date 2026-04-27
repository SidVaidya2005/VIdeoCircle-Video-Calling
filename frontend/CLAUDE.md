# CLAUDE.md — frontend

This file provides guidance to Claude Code (claude.ai/code) when working with the frontend package. For repo-wide context, see `../CLAUDE.md`.

## Stack & conventions

- **Create React App (react-scripts 5)** + React 18 + React Router v6. Not Vite, not Next — `npm start` is the CRA dev server.
- **MUI v5** for inputs/icons (`@mui/material`, `@mui/icons-material`). The MUI theme `shared/theme/goldTheme.js` is wired globally in `app/providers.jsx` via `<ThemeProvider>` — anything you build inherits it. Most pages still carry inline `sx` overrides from the pre-theme era; cleaning those up is out of scope for now.
- **LiveKit React SDK** (`@livekit/components-react`, `livekit-client`) drives all in-call state. Hooks like `useLocalParticipant`, `useTracks`, `useChat` only work inside `<LiveKitRoom>` — see "Component placement rules" below.

## Commands

```bash
npm start                    # CRA dev server on http://localhost:3000
npm run build                # production build → frontend/build (consumed by vercel.json)
npm test                     # CRA Jest in watch mode
npm test -- App.test.js      # single test file (pass through CRA to Jest after `--`)
```

There is no lint script — ESLint runs implicitly via `react-scripts`. Only `App.test.js` exists; the test infrastructure is essentially unused.

## Required environment (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` as a starting template.

- `REACT_APP_SERVER_URL` — backend base URL. Falls back to `http://localhost:8000`.
- `REACT_APP_LIVEKIT_URL` — **required**, used by `RoomShell.jsx` as `<LiveKitRoom serverUrl={...}>`. There is no fallback — if missing, the connect step fails silently with a generic error.

Both are read in exactly one place: `src/shared/lib/env.js`. CRA bakes them into the bundle at build time; changing them means a rebuild/redeploy.

## Layout

```
src/
  app/
    App.jsx                        // mouse-position listener + <Providers><AppRoutes/></Providers>
    providers.jsx                  // <BrowserRouter><ThemeProvider><AuthProvider>
    routes.jsx                     // single source of truth for routes
  features/
    auth/
      components/withAuth.jsx      // HOC that gates routes on a valid token
      context/AuthContext.jsx      // useAuth() — login/register/logout/verify
      pages/AuthPage.jsx           // /auth (login + register)
      pages/GuestLandingPage.jsx   // /guest (enter a meeting code, no auth)
      services/authApi.js          // register/login/verify
    home/pages/HomePage.jsx        // /home (logged-in landing)
    history/
      pages/HistoryPage.jsx        // /history
      services/historyApi.js       // get_all_activity / add_to_activity
    landing/pages/LandingPage.jsx  // /
    meet/
      components/                  // LobbyScreen, ConferenceGrid, MeetControls, ChatPanel, LocalVideoPIP
      livekit/RoomShell.jsx        // wraps <LiveKitRoom> + RoomAudioRenderer
      livekit/tokenApi.js          // GET /api/v1/meet/get-token
      livekit/useMeetingRoom.js    // lobby | connecting | room phase machine
      pages/MeetPage.jsx           // /:meetingCode
      styles/videoComponent.module.css
  shared/
    hooks/useASCIICanvas.js
    lib/apiClient.js               // single Axios instance + Authorization interceptor
    lib/env.js                     // only place that reads process.env.*
    lib/storage.js                 // wraps localStorage("token")
    styles/globals.css             // formerly App.css — imported once in index.js
    styles/tokens.css              // CSS custom properties (--gold-primary, etc.)
    theme/goldTheme.js
```

## Routing layout (`app/routes.jsx`)

```
/                → LandingPage          (public)
/auth            → AuthPage             (public, register/login)
/home            → HomePage             (withAuth — requires token)
/guest           → GuestLandingPage     (public, post-login redirect lands here)
/history         → HistoryPage          (withAuth)
/:meetingCode    → MeetPage             (CATCH-ALL — single-segment paths are meeting codes)
```

`/:meetingCode` matches **any** single-segment path. Add new top-level routes **above** it in `app/routes.jsx` or they'll be treated as meeting codes.

## Auth pattern

- `features/auth/context/AuthContext.jsx` exposes `handleLogin`, `handleRegister`, `handleLogout`, `verifyToken` via `useAuth()`. The token lives in `localStorage` under the key `token`, accessed only through `shared/lib/storage.js`. `handleLogout` is **client-only** — it just clears storage; there is no `/logout` endpoint on the backend.
- `features/auth/components/withAuth.jsx` is a guard HOC: on mount it calls `verifyToken()` against the backend; while checking it returns `null` (blank screen, no spinner). On invalid token it clears storage and routes to `/auth`. Wrap any new authenticated page with `withAuth(...)` — see `HomePage.jsx` and `HistoryPage.jsx`.
- After successful login, `AuthPage` redirects to `/guest`, not `/home`. This is intentional based on current UX flow; don't "fix" it without asking.
- The Axios `apiClient` (`shared/lib/apiClient.js`) attaches `Authorization: Bearer <token>` automatically via a request interceptor. Don't read the token directly in features — call the API helpers.

## Meet flow (`features/meet/`)

`MeetPage` is a thin shell over `useMeetingRoom`, which owns the three phases:

1. `lobby` — renders `<LobbyScreen>` only. The lobby acquires its **own** `getUserMedia` preview stream and stops all tracks before calling `onJoin` so LiveKit can re-acquire the same devices. Don't add code that holds onto the preview stream past join — Chrome will refuse a second `getUserMedia` for the camera.
2. `connecting` — calls `livekit/tokenApi.js → fetchMeetingToken()` (which goes through the shared Axios client at `/api/v1/meet/get-token`).
3. `room` — `<RoomShell>` mounts `<LiveKitRoom>` with `adaptiveStream`, `dynacast`, and `VideoPresets.h720`. Capture defaults are intentional — bumping resolution affects every participant via simulcast.

`onDisconnected` navigates to `/` via the `handleLeave` returned from `useMeetingRoom`, which unmounts `<LiveKitRoom>` and tears down tracks. The end-call button passes the same handler.

## Component placement rules (in-call components)

These components use LiveKit hooks and **must** be rendered inside `<LiveKitRoom>` or they'll throw:

- `LocalVideoPIP` (uses `useLocalParticipant`)
- `RoomView` (defined inside `RoomShell.jsx`) and everything it renders (`ConferenceGrid`, `MeetControls`, `ChatPanel`)

`<RoomAudioRenderer />` is what plays remote audio — it lives at the top of `RoomView`. Removing it silences the call without any visual indication.

`ConferenceGrid` filters out the local participant (`!t.participant.isLocal`); the local feed is shown only via `LocalVideoPIP`. If you change one, change the other to match.

## UI conventions

For the full visual system (color ladder, type scale, component patterns), read `../.claude/specs/design.md` before any non-trivial UI work — the notes below are a quick reference, not the full system.

- **Bracket-notation buttons** (`[JOIN]`, `[CHAT]`, `[×]`) are the visual language — preserve them in any new control.
- **Fonts**: `Anton` (display headings) and `JetBrains Mono` (body, inputs, controls). Loaded via `index.css` / `globals.css`.
- **Color**: gold `#D4A017` on near-black `#080808`. Prefer the CSS vars in `shared/styles/tokens.css` (`--gold-primary`, `--ink-primary`, …) for new code; existing files still use the literals.
- **Mouse parallax**: `--mouse-x` / `--mouse-y` are updated on every mousemove from the listener in `app/App.jsx`.
- **ASCII canvas backgrounds**: `shared/hooks/useASCIICanvas.js` returns a ref you attach to a `<canvas>`. It self-manages resize and a 80ms repaint interval. Multiple canvases on one page are fine but expensive — don't mount it inside `<LiveKitRoom>`.

## Don'ts

- Don't introduce a separate WebSocket/Socket.IO client for chat — chat is `useChat()` over LiveKit's data channel.
- Don't store the LiveKit JWT in `localStorage` — it's intentionally held only in component state for the duration of the call.
- Don't read `process.env.REACT_APP_*` outside `shared/lib/env.js` (see Required environment above). CRA inlines them at build time — scattered reads can't be overridden without a rebuild.
- Don't import `globals.css` from features — it's imported once in `src/index.js`. Use CSS modules (e.g. `features/meet/styles/videoComponent.module.css`) for feature-scoped styles.
- Don't migrate to React Router v7 / data routers without checking that `withAuth` and the catch-all `/:meetingCode` route still behave (see Routing layout above).

## Adding a new page

1. Decide the feature folder (`features/<name>/pages/<PageName>.jsx`). If the page belongs to an existing feature, drop it under that folder; otherwise create a new feature folder with `pages/`, and `services/` / `components/` as needed.
2. If the page makes HTTP calls, add a service file under `features/<name>/services/<name>Api.js` that uses `shared/lib/apiClient`.
3. Add the route to `app/routes.jsx` **above** `/:meetingCode`.
4. If it requires auth, wrap the export with `withAuth(...)`.
