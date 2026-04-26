import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMeetingToken } from './tokenApi';

// Owns the lobby → connecting → room phase machine and the join handler.
export function useMeetingRoom({ meetingCode }) {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('lobby'); // 'lobby' | 'connecting' | 'room'
    const [token, setToken] = useState('');
    const [mediaPrefs, setMediaPrefs] = useState({ video: true, audio: true });
    const [error, setError] = useState('');

    const handleJoin = useCallback(async (username, prefs) => {
        setPhase('connecting');
        setError('');
        try {
            const jwt = await fetchMeetingToken({ meetingCode, username });
            setMediaPrefs(prefs);
            setToken(jwt);
            setPhase('room');
        } catch (err) {
            setError(err?.message || 'Could not get room token');
            setPhase('lobby');
        }
    }, [meetingCode]);

    const handleLeave = useCallback(() => {
        navigate('/');
    }, [navigate]);

    return { phase, token, mediaPrefs, error, handleJoin, handleLeave };
}
