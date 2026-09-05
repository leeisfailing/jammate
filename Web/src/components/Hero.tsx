import { AnimateInView } from "./AnimateInView";
import "./Hero.css";

export function Hero() {
  return (
    <section className="hero">
      {/* Background orbs */}
      <div className="hero-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-content">
        <AnimateInView delay={0} direction="scale">
          <div className="hero-logo-wrap">
            <div className="hero-logo-glow" />
            <svg width="64" height="64" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="var(--color-primary)" />
              <text
                y="68"
                x="50"
                textAnchor="middle"
                fontSize="50"
                fontWeight="bold"
                fill="var(--color-bg)"
              >
                J
              </text>
            </svg>
          </div>
        </AnimateInView>

        <AnimateInView delay={0.1} direction="up">
          <h1 className="hero-title">
            Jam<span className="green">Mate</span>
          </h1>
        </AnimateInView>

        <AnimateInView delay={0.2} direction="up">
          <p className="hero-subtitle">
            Listen to music together in real-time rooms.
            <br />
            Synced playback. Shared queues. Zero latency.
          </p>
        </AnimateInView>

        <AnimateInView delay={0.3} direction="up">
          <div className="hero-buttons">
            <a href="#download" className="btn-hero-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download for Windows
            </a>
            <a href="#features" className="btn-hero-secondary">
              Learn More
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </AnimateInView>

        <AnimateInView delay={0.4} direction="up">
          <div className="hero-meta">
            <span className="hero-tag">v0.1.0</span>
            <span className="hero-dot" />
            <span className="hero-tag">Free &amp; Open Source</span>
            <span className="hero-dot" />
            <span className="hero-tag hero-tag-green">
              <span className="live-dot" />
              Spotify Integration
            </span>
          </div>
        </AnimateInView>

        <AnimateInView delay={0.5} direction="up">
          <div className="hero-wave" aria-hidden="true">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </AnimateInView>
      </div>
    </section>
  );
}
