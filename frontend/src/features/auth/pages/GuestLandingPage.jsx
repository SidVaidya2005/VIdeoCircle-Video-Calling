import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function GuestLandingPage() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = React.useState('');

    const handleJoin = () => {
        if (meetingCode.trim()) navigate(`/${meetingCode.trim()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleJoin();
    };

    return (
        <div className="page">
            <div className="pageContent">
                <header className="topBar">
                    <div className="topBar__group">
                        <button className="btn nav" onClick={() => navigate('/')}>HOME</button>
                        <div className="brand">
                            <span>video</span>
                            <span className="brand__dot" />
                            <span>circle</span>
                        </div>
                    </div>
                    <nav className="topBar__group topBar__group--right">
                        <button className="btn nav" onClick={() => navigate('/auth')}>SIGN IN</button>
                        <button className="btn nav primary" onClick={() => navigate('/auth')}>REGISTER ↗</button>
                    </nav>
                </header>

                <main
                    style={{
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 20px',
                        overflow: 'hidden',
                        minHeight: 'calc(100vh - 60px)',
                    }}
                >
                    <div className="gridBackdrop" />

                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 520,
                            textAlign: 'center',
                        }}
                    >
                        <div className="heroOverline" style={{ marginBottom: 14, justifyContent: 'center' }}>
                            <span className="heroOverline__dot" />
                            ENTER THE CIRCLE
                        </div>
                        <h1
                            className="heroTitle"
                            style={{
                                fontSize: 'clamp(48px, 8vw, 88px)',
                                justifyContent: 'center',
                                margin: '0 0 18px',
                            }}
                        >
                            join a room
                        </h1>
                        <p
                            className="heroSubtitle"
                            style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 14 }}
                        >
                            Paste a meeting code to drop straight into the call. No account required.
                        </p>

                        <div
                            style={{
                                marginTop: 32,
                                background: 'var(--bg-2)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 'var(--radius-lg)',
                                padding: 22,
                                textAlign: 'left',
                            }}
                        >
                            <Box component="form" noValidate sx={{ width: '100%' }} onKeyDown={handleKeyDown}>
                                <TextField
                                    fullWidth
                                    label="Meeting Code"
                                    value={meetingCode}
                                    autoFocus
                                    onChange={(e) => setMeetingCode(e.target.value)}
                                    placeholder="e.g. abc-xyz-123"
                                />
                                <button
                                    type="button"
                                    className="btn primary"
                                    onClick={handleJoin}
                                    disabled={!meetingCode.trim()}
                                    style={{ width: '100%', marginTop: 16 }}
                                >
                                    JOIN MEETING →
                                </button>
                            </Box>
                        </div>
                    </div>
                </main>

                <footer
                    style={{
                        padding: '24px 28px',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--fg-3)',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>V_C_26</span>
                    <span>© 2026</span>
                </footer>
            </div>
        </div>
    );
}
