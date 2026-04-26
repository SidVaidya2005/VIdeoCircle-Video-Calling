import { useNavigate, useParams } from 'react-router-dom';
import LobbyScreen from '../components/LobbyScreen';
import RoomShell from '../livekit/RoomShell';
import { useMeetingRoom } from '../livekit/useMeetingRoom';

export default function MeetPage() {
    const { meetingCode } = useParams();
    const navigate = useNavigate();
    const { phase, token, mediaPrefs, error, handleJoin, handleLeave } =
        useMeetingRoom({ meetingCode });

    if (phase !== 'room') {
        return (
            <LobbyScreen
                connecting={phase === 'connecting'}
                error={error}
                onJoin={handleJoin}
                navigate={navigate}
            />
        );
    }

    return <RoomShell token={token} mediaPrefs={mediaPrefs} onLeave={handleLeave} />;
}
