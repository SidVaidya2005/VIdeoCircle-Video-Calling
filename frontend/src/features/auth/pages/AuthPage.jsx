import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
                navigate('/guest');
            }
            if (formState === 1) {
                const result = await handleRegister(name, username, password);
                setUsername('');
                setMessage(result);
                setOpen(true);
                setError('');
                setFormState(0);
                setPassword('');
            }
        } catch (err) {
            const apiMessage = err?.response?.data?.message;
            setError(apiMessage || 'Something went wrong');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAuth();
    };

    const isSignIn = formState === 0;

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
                    <span className="overline">AUTH</span>
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
                            maxWidth: 440,
                            background: 'var(--bg-2)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '8px',
                        }}
                    >
                        {/* Tabs */}
                        <div
                            style={{
                                display: 'flex',
                                gap: 4,
                                padding: 4,
                                background: 'var(--bg-3)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 22,
                            }}
                        >
                            <button
                                className={`chip${isSignIn ? ' active' : ''}`}
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={() => setFormState(0)}
                            >
                                SIGN IN
                            </button>
                            <button
                                className={`chip${!isSignIn ? ' active' : ''}`}
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={() => setFormState(1)}
                            >
                                REGISTER
                            </button>
                        </div>

                        <div style={{ padding: '0 18px 22px' }}>
                            <div className="heroOverline" style={{ marginBottom: 14 }}>
                                <span className="heroOverline__dot" />
                                {isSignIn ? 'WELCOME BACK' : 'JOIN THE CIRCLE'}
                            </div>
                            <h1
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: 34,
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    margin: '0 0 18px',
                                    lineHeight: 1.05,
                                }}
                            >
                                {isSignIn ? 'Sign in.' : 'Create account.'}
                            </h1>

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
                                    autoFocus={isSignIn}
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

                                {error && (
                                    <p
                                        style={{
                                            color: 'var(--red-1)',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.8rem',
                                            margin: '14px 0 0',
                                            padding: '8px 12px',
                                            background: 'rgba(255, 75, 75, 0.08)',
                                            border: '1px solid rgba(255, 75, 75, 0.35)',
                                            borderRadius: 'var(--radius-xs)',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        [ERR] {error}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    className="btn primary"
                                    onClick={handleAuth}
                                    style={{ width: '100%', marginTop: 20 }}
                                >
                                    {isSignIn ? 'SIGN IN →' : 'CREATE ACCOUNT →'}
                                </button>
                            </Box>
                        </div>
                    </div>
                </main>
            </div>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
                onClose={() => setOpen(false)}
            />
        </div>
    );
}
