import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
                    letterSpacing: '0.04em',
                },
            },
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);
    const canvasRef = React.useRef(null);
    const router = useNavigate();

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

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            }
            if (formState === 1) {
                let result = await handleRegister(name, username, password);
                console.log(result);
                setUsername('');
                setMessage(result);
                setOpen(true);
                setError('');
                setFormState(0);
                setPassword('');
            }
        } catch (err) {
            console.log(err);
            let message = err.response.data.message;
            setError(message);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAuth();
    };

    return (
        <ThemeProvider theme={goldTheme}>
            <div className="authPage">
                <canvas ref={canvasRef} className="asciiCanvas" />
                <div className="authOverlay" />

                <div className="authContent">
                    {/* Top bar */}
                    <header className="authTopBar">
                        <nav className="authTopLeft">
                            <span className="navLinkBracket" onClick={() => router("/")}>
                                [HOME]
                            </span>
                            <span className="bracketLabel">[V_C_26]</span>
                        </nav>
                        <span className="landingBrand">VideoCircle®</span>
                        <span className="bracketLabel">[AUTH]</span>
                    </header>

                    {/* Card */}
                    <div className="authCard">
                        <div className="authCardHeader">
                            <p className="authScript">
                                {formState === 0 ? 'welcome back,' : 'join the circle,'}
                            </p>
                            <h2 className="authCardTitle">
                                {formState === 0 ? 'SIGN IN' : 'REGISTER'}
                            </h2>
                        </div>

                        {/* Form panel with dark backdrop */}
                        <div className="authFormPanel">
                            {/* Tabs */}
                            <div className="authTabs">
                                <button
                                    className={`authTab${formState === 0 ? ' active' : ''}`}
                                    onClick={() => setFormState(0)}
                                >
                                    [SIGN IN]
                                </button>
                                <button
                                    className={`authTab${formState === 1 ? ' active' : ''}`}
                                    onClick={() => setFormState(1)}
                                >
                                    [REGISTER]
                                </button>
                            </div>

                            <Box component="form" noValidate sx={{ width: '100%' }} onKeyDown={handleKeyDown}>
                                {formState === 1 && (
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Full Name"
                                        value={name}
                                        autoFocus
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                )}
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Username"
                                    value={username}
                                    autoFocus={formState === 0}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    value={password}
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                {error && <p className="authError">{error}</p>}

                                <button
                                    type="button"
                                    className="authSubmitBtn"
                                    onClick={handleAuth}
                                >
                                    {formState === 0 ? '[SIGN IN →]' : '[CREATE ACCOUNT →]'}
                                </button>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={4000} message={message} />
        </ThemeProvider>
    );
}
