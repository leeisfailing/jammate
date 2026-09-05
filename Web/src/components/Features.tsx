import { AnimateInView } from "./AnimateInView";
import "./Features.css";

const features = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1db954" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Real-Time Sync",
    description:
      "Everyone hears the same song at the exact same moment. Sub-second sync across all devices.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1db954" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: "Shared Queue",
    description:
      "Anyone can add tracks. Build the vibe together with a collaborative, real-time queue.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1db954" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Music Rooms",
    description:
      "Create a room, share the code, and start jamming. It's that simple.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1db954" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Spotify Integration",
    description:
      "Your library, your playlists. Connect Spotify and bring your music to the room.",
  },
];

export function Features() {
  return (
    <section id="features" className="features">
      <div className="container">
        <AnimateInView>
          <h2 className="section-title">
            Built for <span className="green">listening together</span>
          </h2>
          <p className="section-subtitle">
            Everything you need for a perfect listening session with friends.
          </p>
        </AnimateInView>

        <div className="features-grid">
          {features.map((feature, i) => (
            <AnimateInView key={feature.title} delay={i * 0.1} direction="up">
              <div className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-card-glow" />
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
