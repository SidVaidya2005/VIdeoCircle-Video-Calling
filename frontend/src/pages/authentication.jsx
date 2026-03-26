import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';
import '../App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#00C8FF', contrastText: '#07080F' },
        secondary: { main: '#FF9D42' },
        background: { default: '#07080F', paper: 'rgba(13, 16, 28, 0.6)' },
        text: { primary: '#DDE6F0', secondary: 'rgba(221,230,240,0.55)' },
    },
    typography: { fontFamily: "'DM Sans', sans-serif" },
    shape: { borderRadius: 10 },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: 'rgba(255,255,255,0.03)',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0,200,255,0.35)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00C8FF',
                        borderWidth: '1px',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(221,230,240,0.5)',
                    fontFamily: "'DM Sans', sans-serif",
                    '&.Mui-focused': { color: '#00C8FF' },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: '#DDE6F0',
                    fontFamily: "'DM Sans', sans-serif",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    background: 'linear-gradient(135deg, #00C8FF 0%, #0099CC 100%)',
                    color: '#07080F',
                    fontWeight: 700,
                    fontSize: '0.97rem',
                    fontFamily: "'DM Sans', sans-serif",
                    textTransform: 'none',
                    boxShadow: '0 4px 24px rgba(0,200,255,0.22)',
                    transition: 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #33D4FF 0%, #00C8FF 100%)',
                        boxShadow: '0 8px 40px rgba(0,200,255,0.42)',
                        transform: 'translateY(-1px)',
                    },
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

    return (
        <ThemeProvider theme={darkTheme}>
            <div className="authPage">
                <div className="authBg">
                    <div className="authOrb authOrb1" />
                    <div className="authOrb authOrb2" />
                    <div className="authOrb authOrb3" />
                </div>

                <div className="authCard">
                    <div className="authCardInner">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main', color: '#07080F', width: 48, height: 48 }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <h2 className="authTitle">
                            {formState === 0 ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="authSubtitle">
                            {formState === 0 ? 'Sign in to continue' : 'Join Apna Video Call'}
                        </p>

                        <div className="authTabs">
                            <button
                                className={`authTab${formState === 0 ? ' active' : ''}`}
                                onClick={() => setFormState(0)}
                            >
                                Sign In
                            </button>
                            <button
                                className={`authTab${formState === 1 ? ' active' : ''}`}
                                onClick={() => setFormState(1)}
                            >
                                Sign Up
                            </button>
                        </div>

                        <Box component="form" noValidate sx={{ mt: 0.5, width: '100%' }}>
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

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 1, py: 1.5 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? 'Sign In' : 'Create Account'}
                            </Button>
                        </Box>
                    </div>
                </div>
            </div>

            <Snackbar open={open} autoHideDuration={4000} message={message} />
        </ThemeProvider>
    );
}
