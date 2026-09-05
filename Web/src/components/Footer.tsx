import { AnimateInView } from "./AnimateInView";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <AnimateInView direction="up">
          <div className="footer-content">
            <div className="footer-brand">
              <svg width="20" height="20" viewBox="0 0 100 100">
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
              <span className="footer-name">JamMate</span>
            </div>
            <p className="footer-copy">
              &copy; 2026 JamMate. Built with Spotify API + Supabase.
            </p>
          </div>
        </AnimateInView>
      </div>
    </footer>
  );
}
