import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const LandingPage = lazy(() => import("../features/landing/pages/LandingPage"));
const AuthPage = lazy(() => import("../features/auth/pages/AuthPage"));
const GuestLandingPage = lazy(
  () => import("../features/auth/pages/GuestLandingPage")
);
const HomePage = lazy(() => import("../features/home/pages/HomePage"));
const HistoryPage = lazy(() => import("../features/history/pages/HistoryPage"));
const MeetPage = lazy(() => import("../features/meet/pages/MeetPage"));

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary, #0a0a0a)",
        color: "var(--fg-primary, #e8e6e3)",
        fontFamily: "JetBrains Mono, IBM Plex Mono, monospace",
        fontSize: "0.875rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    >
      Loading…
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/guest" element={<GuestLandingPage />} />
        <Route path="/history" element={<HistoryPage />} />
        {/* Catch-all: any single-segment path is treated as a meeting code. Keep last. */}
        <Route path="/:meetingCode" element={<MeetPage />} />
      </Routes>
    </Suspense>
  );
}
