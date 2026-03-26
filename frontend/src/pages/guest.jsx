import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '../App.css';

const goldTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#D4A017', contrastText: '#080808' },
        background: { default: '#080808', paper: 'rgba(8, 8, 8, 0.8)' },
        text: { primary: '#D4A017', secondary: 'rgba(212, 160, 23, 0.55)' },
    },
    typography: { fontFamily: "'JetBrains Mono', monospace" },
    shape: { borderRadius: 0 },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: 'rgba(212, 160, 23, 0.03)',
                    borderRadius: '0 !important',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.87rem',
                    color: '#D4A017',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(212, 160, 23, 0.25)',
                        borderRadius: 0,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(212, 160, 23, 0.6)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D4A017',
                        borderWidth: '1px',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(212, 160, 23, 0.45)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.82rem',
                    letterSpacing: '0.06em',
                    '&.Mui-focused': { color: '#D4A017' },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: '#D4A017',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.08em',
                },
            },
        },
    },
});

export default function GuestHome() {
    const navigate = useNavigate();
    const canvasRef = React.useRef(null);
    const [meetingCode, setMeetingCode] = React.useState('');

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const CHARS = 'VIDEOCIRCL·=+-*·N·U·S·E·I·2·0·1·6·····=·+·-·*·V·I·D·E·O·C·';
        const FONT_SIZE = 13;
        const CHAR_W = FONT_SIZE * 0.62;

        let cols, rows, grid;

        const initGrid = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cols = Math.ceil(canvas.width / CHAR_W);
            rows = Math.ceil(canvas.height / FONT_SIZE);
            grid = Array.from({ length: rows * cols }, () =>
                CHARS[Math.floor(Math.random() * CHARS.length)]
            );
        };

        initGrid();

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;
            ctx.fillStyle = 'rgba(185, 138, 18, 0.42)';

            const updateCount = Math.max(1, Math.floor(grid.length * 0.008));
            for (let i = 0; i < updateCount; i++) {
                const idx = Math.floor(Math.random() * grid.length);
                grid[idx] = CHARS[Math.floor(Math.random() * CHARS.length)];
            }

            for (let i = 0; i < grid.length; i++) {
                const r = Math.floor(i / cols);
                const c = i % cols;
                ctx.fillText(grid[i], c * CHAR_W, (r + 1) * FONT_SIZE);
            }
        };

        let interval = setInterval(draw, 80);
        draw();

        const handleResize = () => { initGrid(); draw(); };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
                <canvas ref={canvasRef} className="asciiCanvas" />
                <div className="guestOverlay" />

                <div className="guestContent">
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
                        <div className="startCta">
                            <span className="yearLabel">[2026]</span>
                            <span className="bracketLabel">[GUEST MODE]</span>
                        </div>
                    </footer>
                </div>
            </div>
        </ThemeProvider>
    );
}
