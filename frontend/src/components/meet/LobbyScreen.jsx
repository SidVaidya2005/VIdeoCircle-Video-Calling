import React from 'react';
import { TextField, Button } from '@mui/material';
import styles from '../../styles/videoComponent.module.css';
import '../../App.css';

export default function LobbyScreen({
    lobbyCanvasRef,
    localVideoref,
    username,
    setUsername,
    video,
    audio,
    videoAvailable,
    audioAvailable,
    setVideo,
    setAudio,
    connect,
    navigate,
}) {
    return (
        <div className={styles.lobbyContainer}>
            <canvas ref={lobbyCanvasRef} className={styles.lobbyCanvas} />
            <div className={styles.lobbyOverlay} />
            <div className={styles.lobbyContent}>
                <header className="landingTopBar">
                    <nav className="authTopLeft">
                        <span className="navLinkBracket" onClick={() => navigate('/')}>[HOME]</span>
                        <span className="bracketLabel">[V_C_26]</span>
                    </nav>
                    <span className="landingBrand">VideoCircle®</span>
                    <span className="bracketLabel">[LOBBY]</span>
                </header>
                <div className={styles.lobbyMain}>
                    <h2>Enter into Lobby</h2>
                    <div className={styles.lobbyCard}>
                        <div className={styles.lobbyInputRow}>
                            <TextField
                                id="outlined-basic"
                                label="Your Name"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        background: 'rgba(212,160,23,0.03)',
                                        color: '#D4A017',
                                        borderRadius: 0,
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '0.87rem',
                                        '& fieldset': { borderColor: 'rgba(212,160,23,0.25)', borderRadius: 0 },
                                        '&:hover fieldset': { borderColor: 'rgba(212,160,23,0.6)' },
                                        '&.Mui-focused fieldset': { borderColor: '#D4A017', borderWidth: '1px' },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(212,160,23,0.45)',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontSize: '0.82rem',
                                        letterSpacing: '0.06em',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A017' },
                                    '& .MuiInputBase-input': {
                                        color: '#D4A017',
                                        fontFamily: "'JetBrains Mono', monospace",
                                        letterSpacing: '0.08em',
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={connect}
                                sx={{
                                    background: '#D4A017',
                                    color: '#080808',
                                    fontWeight: 700,
                                    fontFamily: "'JetBrains Mono', monospace",
                                    letterSpacing: '0.06em',
                                    textTransform: 'none',
                                    borderRadius: 0,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        background: '#080808',
                                        color: '#D4A017',
                                        boxShadow: 'inset 0 0 0 1px #D4A017',
                                    }
                                }}
                            >
                                [JOIN]
                            </Button>
                        </div>
                        <video className={styles.lobbyVideo} ref={localVideoref} autoPlay muted></video>
                        <div className={styles.lobbyMediaControls}>
                            <button
                                type="button"
                                className={`${styles.lobbyMediaBtn} ${!videoAvailable || video === false ? styles.lobbyMediaBtnOff : styles.lobbyMediaBtnOn}`}
                                onClick={() => setVideo(v => v === false ? videoAvailable : false)}
                            >
                                [camera]
                            </button>
                            <button
                                type="button"
                                className={`${styles.lobbyMediaBtn} ${!audioAvailable || audio === false ? styles.lobbyMediaBtnOff : styles.lobbyMediaBtnOn}`}
                                onClick={() => setAudio(a => a === false ? audioAvailable : false)}
                            >
                                [mic]
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
