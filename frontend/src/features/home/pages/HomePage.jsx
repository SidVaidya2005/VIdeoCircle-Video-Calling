import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, TextField } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import withAuth from '../../auth/components/withAuth';
import { useAuth } from '../../auth/context/AuthContext';
import { historyApi } from '../../history/services/historyApi';

function HomePage() {
    const navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState('');
    const { handleLogout } = useAuth();

    const handleJoinVideoCall = async () => {
        if (!meetingCode.trim()) return;
        await historyApi.addHistory({ meetingCode });
        navigate(`/${meetingCode}`);
    };

    const onLogout = () => {
        handleLogout();
        navigate('/auth');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleJoinVideoCall();
    };

    return (
        <div className="page">
            <div className="pageContent">
                <header className="topBar">
                    <div className="brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
                        <span>video</span>
                        <span className="brand__dot" />
                        <span>circle</span>
                    </div>
                    <nav className="topBar__group topBar__group--right">
                        <IconButton onClick={() => navigate('/history')} aria-label="history" size="small">
                            <RestoreIcon fontSize="small" />
                        </IconButton>
                        <button className="btn nav" onClick={() => navigate('/history')}>HISTORY</button>
                        <button className="btn nav" onClick={onLogout}>LOGOUT ↗</button>
                    </nav>
                </header>

                <main
                    style={{
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 28px',
                        overflow: 'hidden',
                        minHeight: 'calc(100vh - 60px)',
                    }}
                >
                    <div className="gridBackdrop" />

                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: 720,
                            textAlign: 'center',
                        }}
                    >
                        <div
                            className="heroOverline"
                            style={{ marginBottom: 14, justifyContent: 'center' }}
                        >
                            <span className="heroOverline__dot" />
                            CONNECT INSTANTLY
                        </div>
                        <h1
                            className="heroTitle"
                            style={{
                                fontSize: 'clamp(40px, 6.4vw, 76px)',
                                justifyContent: 'center',
                                margin: '0 auto 18px',
                                textAlign: 'center',
                            }}
                        >
                            Meet anyone, anywhere.
                        </h1>
                        <p
                            className="heroSubtitle"
                            style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 12 }}
                        >
                            Generate or paste a meeting code to start the call.
                        </p>

                        <div
                            style={{
                                marginTop: 28,
                                display: 'flex',
                                gap: 10,
                                justifyContent: 'center',
                                alignItems: 'stretch',
                                flexWrap: 'wrap',
                            }}
                        >
                            <TextField
                                value={meetingCode}
                                onChange={(e) => setMeetingCode(e.target.value)}
                                onKeyDown={handleKeyDown}
                                label="Meeting Code"
                                variant="outlined"
                                size="small"
                                sx={{ minWidth: 260, flex: '1 1 260px', maxWidth: 380 }}
                            />
                            <button
                                type="button"
                                className="btn primary"
                                onClick={handleJoinVideoCall}
                                disabled={!meetingCode.trim()}
                            >
                                JOIN →
                            </button>
                        </div>

                        {/* Staggered red squares — kit signature */}
                        <div className="staggerStrip">
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="staggerSquare"
                                    style={{ animationDelay: `${Math.abs(i - 3) * 65}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default withAuth(HomePage);
