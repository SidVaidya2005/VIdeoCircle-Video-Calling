import { Route, Routes } from 'react-router-dom';
import LandingPage from '../features/landing/pages/LandingPage';
import AuthPage from '../features/auth/pages/AuthPage';
import GuestLandingPage from '../features/auth/pages/GuestLandingPage';
import HomePage from '../features/home/pages/HomePage';
import HistoryPage from '../features/history/pages/HistoryPage';
import MeetPage from '../features/meet/pages/MeetPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/guest" element={<GuestLandingPage />} />
      <Route path="/history" element={<HistoryPage />} />
      {/* Catch-all: any single-segment path is treated as a meeting code. Keep last. */}
      <Route path="/:meetingCode" element={<MeetPage />} />
    </Routes>
  );
}
