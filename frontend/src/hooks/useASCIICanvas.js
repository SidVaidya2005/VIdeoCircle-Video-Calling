import { useEffect, useRef } from 'react';

export default function useASCIICanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
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
                grid[Math.floor(Math.random() * grid.length)] = CHARS[Math.floor(Math.random() * CHARS.length)];
            }
            for (let i = 0; i < grid.length; i++) {
                ctx.fillText(grid[i], (i % cols) * CHAR_W, (Math.floor(i / cols) + 1) * FONT_SIZE);
            }
        };

        const interval = setInterval(draw, 80);
        draw();

        const handleResize = () => { initGrid(); draw(); };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return canvasRef;
}
