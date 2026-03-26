import React, { useRef, useEffect } from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'

export default function LandingPage() {
    const router = useNavigate();
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

            // Update ~0.8% of cells per frame for slow drift
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

        const handleResize = () => {
            initGrid();
            draw();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="landingPageContainer">
            <canvas ref={canvasRef} className="asciiCanvas" />
            <div className="landingOverlay" />

            <div className="landingContent">
                {/* ── Top bar ── */}
                <header className="landingTopBar">
                    <span className="bracketLabel">[V_C_26]</span>
                    <span className="landingBrand">VideoCircle®</span>
                    <nav className="landingTopRight">
                        <span className="navLinkBracket" onClick={() => router("/home")}>
                            [JOIN AS GUEST]
                        </span>
                        <span className="navLinkBracket" onClick={() => router("/auth")}>
                            [REGISTER]
                        </span>
                        <span className="navLinkBracket" onClick={() => router("/auth")}>
                            [LOGIN]
                        </span>
                    </nav>
                </header>

                {/* ── Hero ── */}
                <main className="landingHero">
                    <p className="heroScript">meet the world,</p>
                    <h1 className="heroTitle">
                        <span className="heroLine">VIDEO</span>
                        <span className="heroLine">CIRCLE</span>
                    </h1>

                    <div className="heroBadge">
                        <span className="bracketLabel">[FREE]</span>
                        <span className="bracketLabel">[INSTANTLY]</span>
                        <span className="bracketLabel">[ANYWHERE]</span>
                    </div>
                </main>

                {/* ── Bottom bar ── */}
                <footer className="landingBottomBar">
                    <div className="startCta">
                        <span className="yearLabel">[2026]</span>
                        <Link to="/auth" className="startBtn">
                            [START A MEETING]
                        </Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
