import React, { useState, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import styles from '../styles/videoComponent.module.css';

export default function LobbyScreen({ connecting, error, onJoin, navigate }) {
    const localVideoRef = useRef(null);
    const streamRef = useRef(null);

    const [username, setUsername] = useState('');
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [videoAvailable, setVideoAvailable] = useState(false);
    const [audioAvailable, setAudioAvailable] = useState(false);
    const [videoPending, setVideoPending] = useState(true);
    const [audioPending, setAudioPending] = useState(true);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                streamRef.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                setVideoAvailable(true);
                setAudioAvailable(true);
            })
            .catch(() => {
                // Permissions denied or no devices — proceed without preview
            })
            .finally(() => {
                setVideoPending(false);
                setAudioPending(false);
            });

        return () => streamRef.current?.getTracks().forEach((t) => t.stop());
    }, []);

    useEffect(() => {
        streamRef.current?.getVideoTracks().forEach((t) => { t.enabled = video; });
    }, [video]);

    useEffect(() => {
        streamRef.current?.getAudioTracks().forEach((t) => { t.enabled = audio; });
    }, [audio]);

    const handleJoin = () => {
        if (!username.trim() || connecting) return;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        onJoin(username.trim(), { video: video && videoAvailable, audio: audio && audioAvailable });
    };

    return (
        <div className={styles.lobbyContainer}>
            <div className="gridBackdrop" />
            <div className={styles.lobbyContent}>
                <header className="topBar">
                    <div className="topBar__group">
                        <button className="btn nav" onClick={() => navigate('/')}>HOME</button>
                        <div className="brand">
                            <span>video</span>
                            <span className="brand__dot" />
                            <span>circle</span>
                        </div>
                    </div>
                    <span className="overline">LOBBY</span>
                </header>

                <div className={styles.lobbyMain}>
                    <span className={styles.lobbyOverline}>READY TO ENTER</span>
                    <h2 className={styles.lobbyHeading}>Lobby</h2>

                    <div className={styles.lobbyCard}>
                        <div className={styles.lobbyInputRow}>
                            <TextField
                                label="Your name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                variant="outlined"
                                size="small"
                                sx={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                className="btn primary"
                                onClick={handleJoin}
                                disabled={connecting || !username.trim()}
                            >
                                {connecting ? '...' : 'JOIN →'}
                            </button>
                        </div>

                        {error && <p className={styles.lobbyError}>[ERR] {error}</p>}

                        <video className={styles.lobbyVideo} ref={localVideoRef} autoPlay muted />

                        <div className={styles.lobbyMediaControls}>
                            <button
                                type="button"
                                disabled={videoPending || !videoAvailable}
                                className={`${styles.lobbyMediaBtn} ${
                                    videoPending || !videoAvailable || !video
                                        ? styles.lobbyMediaBtnOff
                                        : styles.lobbyMediaBtnOn
                                }`}
                                onClick={() => setVideo((v) => !v)}
                            >
                                {videoPending ? 'CONNECTING' : video ? 'CAMERA ON' : 'CAMERA OFF'}
                            </button>
                            <button
                                type="button"
                                disabled={audioPending || !audioAvailable}
                                className={`${styles.lobbyMediaBtn} ${
                                    audioPending || !audioAvailable || !audio
                                        ? styles.lobbyMediaBtnOff
                                        : styles.lobbyMediaBtnOn
                                }`}
                                onClick={() => setAudio((a) => !a)}
                            >
                                {audioPending ? 'CONNECTING' : audio ? 'MIC ON' : 'MIC OFF'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
