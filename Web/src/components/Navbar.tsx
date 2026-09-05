import { useState, useEffect } from "react";
import "./Navbar.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-inner">
        <a href="#" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 100 100">
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
          <span className="brand-text">
            Jam<span className="green">Mate</span>
          </span>
        </a>

        <div className="navbar-links">
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How It Works
          </a>
          <a href="#download" className="nav-cta">
            Download
          </a>
        </div>
      </div>
    </nav>
  );
}
