import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/landing';
import Authentication from '../features/auth/pages/AuthPage';
import VideoMeetComponent from '../features/meet/pages/MeetPage';
import HomeComponent from '../pages/home';
import GuestHome from '../pages/joinmeet';
import History from '../pages/history';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Authentication />} />
      <Route path="/home" element={<HomeComponent />} />
      <Route path="/guest" element={<GuestHome />} />
      <Route path="/history" element={<History />} />
      <Route path="/:meetingCode" element={<VideoMeetComponent />} />
    </Routes>
  );
}
