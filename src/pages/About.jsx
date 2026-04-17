import { NavLink } from "react-router-dom";
import "./About.css";

export default function About() {
  const team = [
    { name: "Mudasir Hussain", role: "Founder & Lead Dev", avatar: "https://i.pravatar.cc/120?img=10", color: "#7c3aed" },
    { name: "Ali Khan", role: "Backend Engineer", avatar: "https://i.pravatar.cc/120?img=1", color: "#2563eb" },
    { name: "Sara Ahmed", role: "UI/UX Designer", avatar: "https://i.pravatar.cc/120?img=5", color: "#059669" },
    { name: "Usman Tariq", role: "DevOps & Infra", avatar: "https://i.pravatar.cc/120?img=3", color: "#d97706" },
  ];

  const timeline = [
    { year: "2024", title: "The Idea", desc: "Born from late-night study sessions where we needed a better way to stay connected." },
    { year: "2025", title: "First Build", desc: "Launched our MVP with text rooms, real-time messaging, and basic voice support." },
    { year: "2026", title: "Going Live", desc: "Watch parties, stage channels, mod tools, and 2,800+ users across 30+ regions." },
  ];

  const values = [
    { icon: "🎯", title: "Community First", desc: "Every feature we build starts with one question — does this bring people closer together?" },
    { icon: "⚡", title: "Speed Matters", desc: "Sub-40ms latency globally. Because conversations shouldn't wait for technology." },
    { icon: "🔒", title: "Privacy by Default", desc: "End-to-end encryption, zero data selling. Your conversations are yours alone." },
    { icon: "🎨", title: "Designed to Delight", desc: "Pixel-perfect interfaces with micro-animations that make every interaction feel alive." },
    { icon: "🌍", title: "Open & Inclusive", desc: "Built for everyone, everywhere. Accessible design and global CDN coverage." },
    { icon: "🔧", title: "Always Improving", desc: "Weekly updates driven by community feedback. We ship fast and listen faster." },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-bg">
          <div className="about-orb about-orb-a" />
          <div className="about-orb about-orb-b" />
          <div className="about-orb about-orb-c" />
          <div className="about-noise" />
        </div>

        <div className="about-hero-content">
          <div className="about-badge animate-fade-up" style={{ animationDelay: "0ms" }}>
            <span className="about-badge-dot" />
            Our Story
          </div>

          <h1 className="about-hero-title animate-fade-up" style={{ animationDelay: "80ms" }}>
            Built for people who{" "}
            <span className="about-gradient-text">refuse to be boring.</span>
          </h1>

          <p className="about-hero-sub animate-fade-up" style={{ animationDelay: "160ms" }}>
            ChatApp started as a side project between friends who wanted a better
            way to hang out online. Today, it's a thriving platform for
            communities, teams, and friend groups worldwide.
          </p>

          <div className="about-hero-stats animate-fade-up" style={{ animationDelay: "240ms" }}>
            {[
              { value: "2.8K+", label: "Active Users" },
              { value: "150+", label: "Public Rooms" },
              { value: "30+", label: "Regions" },
            ].map(({ value, label }, i) => (
              <div key={i} className="about-stat-chip">
                <span className="about-stat-value">{value}</span>
                <span className="about-stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="about-section">
        <div className="about-inner">
          <div className="about-split">
            <div className="about-split-left">
              <p className="about-eyebrow">Our Mission</p>
              <h2 className="about-section-title">
                Making online hangouts feel{" "}
                <span className="about-gradient-text">real again.</span>
              </h2>
            </div>
            <div className="about-split-right">
              <p className="about-body-text">
                We believe the best conversations happen when technology gets out
                of the way. ChatApp is designed to feel natural — like sitting in
                a room with your friends, not staring at a screen.
              </p>
              <p className="about-body-text">
                From text channels with threads and reactions, to voice rooms
                with crystal-clear audio, to synchronized watch parties — every
                feature is crafted to keep you connected without the friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-section about-values-section">
        <div className="about-inner">
          <p className="about-eyebrow">What We Stand For</p>
          <h2 className="about-section-title">Our core values</h2>

          <div className="about-values-grid">
            {values.map(({ icon, title, desc }, i) => (
              <div key={i} className="about-value-card">
                <div className="about-value-icon">{icon}</div>
                <h3 className="about-value-title">{title}</h3>
                <p className="about-value-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="about-section about-timeline-section">
        <div className="about-inner">
          <p className="about-eyebrow">The Journey</p>
          <h2 className="about-section-title">How we got here</h2>

          <div className="about-timeline">
            {timeline.map(({ year, title, desc }, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-dot" />
                  {i < timeline.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <span className="timeline-year">{year}</span>
                  <h3 className="timeline-title">{title}</h3>
                  <p className="timeline-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-section about-team-section">
        <div className="about-inner">
          <p className="about-eyebrow">The Team</p>
          <h2 className="about-section-title">Meet the people behind ChatApp</h2>

          <div className="about-team-grid">
            {team.map(({ name, role, avatar, color }, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar-wrap">
                  <img className="team-avatar" src={avatar} alt={name} />
                  <div
                    className="team-avatar-ring"
                    style={{ borderColor: color }}
                  />
                </div>
                <h3 className="team-name">{name}</h3>
                <p className="team-role" style={{ color }}>
                  {role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="about-section about-tech-section">
        <div className="about-inner">
          <div className="about-split">
            <div className="about-split-left">
              <p className="about-eyebrow">Under the Hood</p>
              <h2 className="about-section-title">
                Built with{" "}
                <span className="about-gradient-text">modern tools.</span>
              </h2>
            </div>
            <div className="about-split-right">
              <div className="tech-grid">
                {[
                  { name: "React", icon: "⚛️", desc: "Component-driven UI" },
                  { name: "Node.js", icon: "🟢", desc: "Server runtime" },
                  { name: "WebSockets", icon: "🔌", desc: "Real-time comms" },
                  { name: "WebRTC", icon: "📡", desc: "Voice & video" },
                  { name: "Redis", icon: "🔴", desc: "Caching layer" },
                  { name: "PostgreSQL", icon: "🐘", desc: "Primary database" },
                ].map(({ name, icon, desc }, i) => (
                  <div key={i} className="tech-chip">
                    <span className="tech-icon">{icon}</span>
                    <div>
                      <span className="tech-name">{name}</span>
                      <span className="tech-desc">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta">
        <div className="about-cta-bg">
          <div className="about-cta-orb about-cta-orb-a" />
          <div className="about-cta-orb about-cta-orb-b" />
        </div>
        <div className="about-cta-content">
          <h2 className="about-cta-title">Ready to join the conversation?</h2>
          <p className="about-cta-sub">
            Thousands of communities are already here. Find yours today.
          </p>
          <div className="about-cta-actions">
            <NavLink to="/rooms" className="about-btn-primary">
              Explore Rooms
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
            <NavLink to="/" className="about-btn-ghost">
              Back to Home
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
