import React, { useRef } from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
import useASCIICanvas from '../shared/hooks/useASCIICanvas'

export default function LandingPage() {
    const router = useNavigate();
    const canvasRef = useASCIICanvas();
    const previewRef = useRef(null);

    const handlePreviewMove = (e) => {
        const el = previewRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateY = ((x - cx) / cx) * 6;
        const rotateX = -((y - cy) / cy) * 4;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handlePreviewLeave = () => {
        const el = previewRef.current;
        if (!el) return;
        el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg)`;
    };

    return (
        <div className="landingPageContainer">
            <canvas ref={canvasRef} className="pageCanvas" />
            <div className="pageOverlay" />

            <div className="pageContent landingContent">
                {/* ── Top bar ── */}
                <header className="landingTopBar">
                    <span className="bracketLabel">[V_C_26]</span>
                    <span className="landingBrand">VideoCircle®</span>
                    <nav className="landingTopRight">
                        <span className="navLinkBracket" onClick={() => router("/guest")}>
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
                    <div className="heroLeft">
                        <p className="heroScript">meet the world,</p>
                        <h1 className="heroTitle">
                            <span className="heroLine">VIDEO</span>
                            <span className="heroLine">CIRCLE</span>
                        </h1>
                    </div>
                    <div className="heroPreview">
                        <div className="heroPreviewLabel">[IN-CALL EXPERIENCE]</div>
                        <div
                            className="heroPreviewImgWrap"
                            ref={previewRef}
                            onMouseMove={handlePreviewMove}
                            onMouseLeave={handlePreviewLeave}
                        >
                            <img
                                src="/in_call_experience.png"
                                alt="In-call experience"
                                className="heroPreviewImg"
                            />
                        </div>
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
                    <div className="heroBadge">
                        <span className="bracketLabel">[FREE]</span>
                        <span className="bracketLabel">[INSTANTLY]</span>
                        <span className="bracketLabel">[ANYWHERE]</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
