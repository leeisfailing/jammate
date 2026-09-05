import { AnimateInView } from "./AnimateInView";
import "./Testimonials.css";

const testimonials = [
  {
    quote: "Finally, a way to listen with friends that actually works. Zero lag.",
    name: "Alex",
    role: "Music Producer",
  },
  {
    quote: "We use it every Friday night. It's like a private concert with your crew.",
    name: "Jordan",
    role: "DJ & Streamer",
  },
  {
    quote: "The shared queue is genius. Everyone gets to contribute to the vibe.",
    name: "Sam",
    role: "College Student",
  },
];

export function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <AnimateInView>
          <h2 className="section-title">
            Loved by <span className="green">listeners</span>
          </h2>
        </AnimateInView>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <AnimateInView key={t.name} delay={i * 0.1} direction="up">
              <div className="testimonial-card">
                <div className="testimonial-quote-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z" />
                  </svg>
                </div>
                <blockquote className="testimonial-text">{t.quote}</blockquote>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
}
