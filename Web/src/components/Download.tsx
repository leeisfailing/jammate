import { AnimateInView } from "./AnimateInView";
import "./Download.css";

export function Download() {
  return (
    <section id="download" className="download">
      <div className="container">
        <AnimateInView direction="scale">
          <div className="download-card">
            <div className="download-orb download-orb-1" aria-hidden="true" />
            <div className="download-orb download-orb-2" aria-hidden="true" />

            <h2 className="download-title">
              Ready to <span className="green">jam</span>?
            </h2>

            <p className="download-subtitle">
              Free for Windows. macOS and Linux coming soon.
            </p>

            <div className="download-buttons">
              <button
                className="btn-download"
                onClick={() => alert("Download coming soon! Check back later.")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download v0.1.0
              </button>
            </div>

            <div className="download-platforms">
              <span className="platform active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                Windows
              </span>
              <span className="platform coming-soon">macOS</span>
              <span className="platform coming-soon">Linux</span>
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  );
}
