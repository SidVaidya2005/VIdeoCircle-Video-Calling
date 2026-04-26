import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import goldTheme from '../shared/theme/goldTheme';
import { AuthProvider } from '../features/auth/context/AuthContext';

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={goldTheme}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
