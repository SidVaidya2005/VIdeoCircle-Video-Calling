import { useEffect } from 'react';
import '../App.css';
import Providers from './providers';
import AppRoutes from './routes';

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="App">
      <Providers>
        <AppRoutes />
      </Providers>
    </div>
  );
}
