# CLAUDE.md — frontend

This file provides guidance to Claude Code (claude.ai/code) when working with the frontend package. For repo-wide context, see `../CLAUDE.md`.

## Stack & conventions

- **Create React App (react-scripts 5)** + React 18 + React Router v6. Not Vite, not Next — `npm start` is the CRA dev server.
- **MUI v5** for inputs/icons (`@mui/material`, `@mui/icons-material`), but the global look is hand-styled in `App.css` and `styles/videoComponent.module.css`. The MUI theme defined at `src/themes/goldTheme.js` exists but is **not currently wired** into `App.js` (no `ThemeProvider`); component-level `sx` overrides do the styling. Don't assume the theme is active.
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

- `REACT_APP_SERVER_URL` — backend base URL. Falls back to `http://localhost:8000` (`src/environment.js`).
- `REACT_APP_LIVEKIT_URL` — **required**, used directly in `pages/VideoMeet.jsx` as `<LiveKitRoom serverUrl={...}>`. There is no fallback — if missing, the connect step fails silently with a generic error.

CRA bakes these into the bundle at build time; changing them means a rebuild/redeploy.

## Routing layout (`src/App.js`)

```
/                → landing.jsx          (public)
/auth            → authentication.jsx   (public, register/login)
/home            → home.jsx             (withAuth — requires token)
/guest           → joinmeet.jsx         (public, post-login redirect lands here)
/history         → history.jsx          (withAuth)
/:url            → VideoMeet.jsx        (CATCH-ALL — meeting code lives in :url)
```

`/:url` matches **any** single-segment path. Add new top-level routes **above** it in `App.js` or they'll be treated as meeting codes. The param is named `url`; `VideoMeet.jsx` aliases it as `meetingCode` via `const { url: meetingCode } = useParams()`.

## Auth pattern

- `contexts/AuthContext.jsx` exposes `handleLogin`, `handleRegister`, `handleLogout`, `verifyToken`, `getHistoryOfUser`, `addToUserHistory`. The token lives in `localStorage` under the key `token`.
- `utils/withAuth.jsx` is a guard HOC: on mount it calls `verifyToken()` against the backend; while checking it returns `null` (blank screen, no spinner). On invalid token it clears `localStorage` and routes to `/auth`. Wrap any new authenticated page with `withAuth(...)` — see `home.jsx` and `history.jsx`.
- After successful login, `handleLogin` redirects to `/guest`, not `/home`. This is intentional based on current UX flow; don't "fix" it without asking.

## VideoMeet flow (`pages/VideoMeet.jsx`)

Three phases driven by local state:

1. `lobby` — renders `<LobbyScreen>` only. The lobby acquires its **own** `getUserMedia` preview stream and stops all tracks before calling `onJoin` so LiveKit can re-acquire the same devices. Don't add code that holds onto the preview stream past join — Chrome will refuse a second `getUserMedia` for the camera.
2. `connecting` — fetches `${REACT_APP_SERVER_URL}/api/v1/meet/get-token` (bare `fetch`, not the Axios `client` from AuthContext, because the meet endpoint lives at a different base path).
3. `room` — mounts `<LiveKitRoom>` with `adaptiveStream` and `dynacast` and `VideoPresets.h720`. Capture defaults are intentional — bumping resolution affects every participant via simulcast.

`onDisconnected` navigates to `/`, which unmounts `<LiveKitRoom>` and tears down tracks. The end-call button passes the same handler.

## Component placement rules (in-call components)

These components use LiveKit hooks and **must** be rendered inside `<LiveKitRoom>` or they'll throw:

- `LocalVideoPIP` (uses `useLocalParticipant`)
- `RoomView` and everything it renders (`ConferenceGrid`, `MeetControls`, `ChatPanel`)

`<RoomAudioRenderer />` is what plays remote audio — it lives at the top of `RoomView`. Removing it silences the call without any visual indication.

`ConferenceGrid` filters out the local participant (`!t.participant.isLocal`); the local feed is shown only via `LocalVideoPIP`. If you change one, change the other to match.

## UI conventions

- **Bracket-notation buttons** (`[JOIN]`, `[CHAT]`, `[×]`) are the visual language — preserve them in any new control.
- **Fonts**: `Anton` (display headings) and `JetBrains Mono` (body, inputs, controls). Loaded via `index.css` / `App.css`.
- **Color**: gold `#D4A017` on near-black `#080808`. CSS vars `--mouse-x` / `--mouse-y` are updated on every mousemove from `App.js` for parallax effects.
- **ASCII canvas backgrounds**: `hooks/useASCIICanvas.js` returns a ref you attach to a `<canvas>`. It self-manages resize and a 80ms repaint interval. Multiple canvases on one page are fine but expensive — don't mount it inside `<LiveKitRoom>`.

## Don'ts

- Don't introduce a separate WebSocket/Socket.IO client for chat — chat is `useChat()` over LiveKit's data channel.
- Don't store the LiveKit JWT in `localStorage` — it's intentionally held only in component state for the duration of the call.
- Don't migrate to React Router v7 / data routers without checking that `withAuth` and `useParams({ url })` still behave; the catch-all route is fragile.
