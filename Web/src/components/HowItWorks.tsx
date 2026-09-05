import { AnimateInView } from "./AnimateInView";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    title: "Connect Spotify",
    description: "Log in with your Spotify account to access your music library.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Create a Room",
    description: "Generate a room code and share it with your friends.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Start Jamming",
    description: "Play music and everyone hears it together. Add tracks and vibe.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <AnimateInView>
          <h2 className="section-title">
            Three steps to <span className="green">jam</span>
          </h2>
          <p className="section-subtitle">
            Get started in under a minute. No downloads to configure, no accounts to link.
          </p>
        </AnimateInView>

        <div className="steps">
          {steps.map((step, i) => (
            <div key={step.number} className="step-wrapper">
              <AnimateInView delay={i * 0.15} direction="up">
                <div className="step">
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-number">{step.number}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </AnimateInView>
              {i < steps.length - 1 && (
                <div className="step-connector" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
