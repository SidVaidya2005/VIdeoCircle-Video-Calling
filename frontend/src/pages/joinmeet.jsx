import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import '../App.css';
import goldTheme from '../themes/goldTheme';
import useASCIICanvas from '../hooks/useASCIICanvas';

export default function GuestHome() {
    const navigate = useNavigate();
    const canvasRef = useASCIICanvas();
    const [meetingCode, setMeetingCode] = React.useState('');

    const handleJoin = () => {
        if (meetingCode.trim()) {
            navigate(`/${meetingCode.trim()}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleJoin();
    };

    return (
        <ThemeProvider theme={goldTheme}>
            <div className="guestPage">
                <canvas ref={canvasRef} className="pageCanvas" />
                <div className="pageOverlay" />

                <div className="pageContent guestContent">
                    {/* Top bar */}
                    <header className="landingTopBar">
                        <nav className="authTopLeft">
                            <span className="navLinkBracket" onClick={() => navigate('/')}>
                                [HOME]
                            </span>
                            <span className="bracketLabel">[V_C_26]</span>
                        </nav>
                        <span className="landingBrand">VideoCircle®</span>
                        <nav className="landingTopRight">
                            <span className="navLinkBracket" onClick={() => navigate('/auth')}>
                                [SIGN IN]
                            </span>
                            <span className="navLinkBracket" onClick={() => navigate('/auth')}>
                                [REGISTER]
                            </span>
                        </nav>
                    </header>

                    {/* Main join area */}
                    <main className="guestMain">
                        <div className="guestHero">
                            <p className="authScript">enter the circle,</p>
                            <h1 className="guestTitle">JOIN A<br />MEETING</h1>
                        </div>

                        <div className="guestPanel">
                            <Box
                                component="form"
                                noValidate
                                sx={{ width: '100%' }}
                                onKeyDown={handleKeyDown}
                            >
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
                                    className="authSubmitBtn"
                                    onClick={handleJoin}
                                >
                                    [JOIN MEETING →]
                                </button>
                            </Box>
                        </div>
                    </main>

                    {/* Bottom bar */}
                    <footer className="landingBottomBar">
                        <span className="yearLabel">[2026]</span>
                    </footer>
                </div>
            </div>
        </ThemeProvider>
    );
}
