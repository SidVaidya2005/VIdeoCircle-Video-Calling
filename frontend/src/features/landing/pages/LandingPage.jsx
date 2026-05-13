import React from "react";
import { Link, useNavigate } from "react-router-dom";

const features = [
  {
    title: "Instant rooms",
    desc: "Generate a code, share it, you are in.",
    code: "/abc-xyz-123",
  },
  {
    title: "Direct WebRTC",
    desc: "Peer media routed via LiveKit. No proxy in the middle.",
    code: "serverUrl: livekit",
  },
  {
    title: "Built-in chat",
    desc: "Text alongside video over the same data channel.",
    code: "useChat()",
  },
  {
    title: "Screen share",
    desc: "Publish your screen with one click.",
    code: "Track.Source.ScreenShare",
  },
  {
    title: "Multi-party grid",
    desc: "Auto-tiling for any participant count.",
    code: "getGridDimensions(n)",
  },
  {
    title: "Open-source",
    desc: "MIT licensed. Fork, host, modify.",
    code: "github.com/SidVaidya2005",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page page--landing">
      <div className="pageContent">
        {/* Top bar */}
        <header className="topBar">
          <div
            className="brand"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <span>Video</span>
            <span className="brand__dot" />
            <span>Circle</span>
          </div>
          <nav className="topBar__group topBar__group--right">
            <button className="btn nav" onClick={() => navigate("/guest")}>
              JOIN AS GUEST
            </button>
            <button className="btn nav" onClick={() => navigate("/auth")}>
              REGISTER
            </button>
            <button
              className="btn nav primary"
              onClick={() => navigate("/auth")}
            >
              SIGN IN ↗
            </button>
          </nav>
        </header>

        {/* Hero */}
        <section
          style={{
            position: "relative",
            padding: "80px 28px 60px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div className="gridBackdrop" />
          <div style={{ position: "relative" }}>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginBottom: "22px",
              }}
            >
              <h1 className="heroTitle" style={{ margin: 0 }}>
                Video
                <span className="heroTitle__dot" />
                Circle
              </h1>
              <div className="heroOverline" style={{ margin: "8px 0 0 0" }}>
                <span className="heroOverline__dot" />
                <span>Available now</span>
              </div>
            </div>

            <p
              className="heroSubtitle"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              Fast, peer-to-peer, lightweight. A video calling room with chat,
              screen share, and a real-time grid. Direct media via LiveKit; no
              server in the middle.
            </p>

            <div className="heroCtaRow" style={{ justifyContent: "center" }}>
              <Link to="/auth" className="btn primary">
                START A MEETING
              </Link>
              <Link to="/guest" className="btn ghost">
                JOIN AS GUEST ↗
              </Link>
            </div>

            {/* Staggered red squares — kit signature */}
            <div className="staggerStrip">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="staggerSquare"
                  style={{ animationDelay: `${Math.abs(i - 4) * 65}ms` }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section
          style={{
            padding: "60px 28px 40px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div className="heroOverline">
            <span className="heroOverline__dot" />
            Modules
          </div>
          <h2
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              margin: "8px 0 26px",
            }}
          >
            Everything you need. Nothing you don't.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 10,
            }}
          >
            {features.map((f) => (
              <div key={f.title} className="card">
                <div className="listCard__title">{f.title}</div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--fg-2)",
                    lineHeight: 1.5,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {f.desc}
                </p>
                <code
                  style={{
                    fontSize: 11,
                    color: "var(--fg-1)",
                    background: "var(--bg-3)",
                    padding: "6px 8px",
                    borderRadius: 4,
                    alignSelf: "flex-start",
                    border: "1px solid rgba(255,255,255,.06)",
                  }}
                >
                  {f.code}
                </code>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: "40px 28px 48px",
            borderTop: "1px solid rgba(255,255,255,.08)",
            color: "var(--fg-3)",
            fontSize: 12,
            letterSpacing: "0.04em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: 14,
          }}
        >
          <div className="brand" style={{ fontSize: 14 }}>
            <span>video</span>
            <span className="brand__dot" />
            <span>circle</span>
            <span className="brand__suffix">V_C_26</span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 22,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            <span>FREE</span>
            <span>INSTANTLY</span>
            <span>ANYWHERE</span>
            <span>© 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
