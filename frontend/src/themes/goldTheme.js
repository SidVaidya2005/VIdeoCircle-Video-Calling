import { createTheme } from '@mui/material/styles';

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

export default goldTheme;
