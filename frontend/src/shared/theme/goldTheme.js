import { createTheme } from '@mui/material/styles';

// Filename kept for import stability; brand is now the warm near-black +
// mono + red-signal system from the Anime.js handoff kit.
const muiTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#ff4b4b', contrastText: '#252423' },
        background: { default: '#252423', paper: '#2a2928' },
        text: {
            primary: '#dddcda',
            secondary: '#96918f',
        },
    },
    typography: {
        fontFamily: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
    },
    shape: { borderRadius: 6 },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    background: 'transparent',
                    color: '#dddcda',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.95rem',
                    letterSpacing: '0.02em',
                    borderRadius: '0.25rem',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '0.25rem',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#ff4b4b',
                        borderWidth: '1px',
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#96918f',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.85rem',
                    letterSpacing: '0.04em',
                    '&.Mui-focused': { color: '#ff4b4b' },
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: '#dddcda',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.02em',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderRadius: '0.4rem',
                    boxShadow: 'none',
                    paddingLeft: '18px',
                    paddingRight: '18px',
                    '&:hover': { boxShadow: 'none' },
                },
                contained: {
                    background: '#f6f4f2',
                    color: '#252423',
                    '&:hover': {
                        background: '#b8b6b3',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    color: '#c6c3c1',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: '#dddcda',
                    },
                },
            },
        },
        MuiBadge: {
            styleOverrides: {
                badge: {
                    background: '#ff4b4b',
                    color: '#252423',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    fontWeight: 700,
                },
            },
        },
        MuiSnackbarContent: {
            styleOverrides: {
                root: {
                    background: '#2a2928',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#dddcda',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.85rem',
                    letterSpacing: '0.02em',
                    borderRadius: '0.4rem',
                },
            },
        },
    },
});

export default muiTheme;
