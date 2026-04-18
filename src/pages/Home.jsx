import { NavLink } from "react-router-dom";
import "./Home.css";

export default function Home({ user }) {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <div className="orb orb-c" />
          <div className="noise" />
        </div>

        <div className="hero-content">
          <div className="hero-left">
            <div className="badge animate-fade-up" style={{ animationDelay: "0ms" }}>
              <span className="badge-dot" />
              Now in beta
            </div>

            <h1 className="hero-title animate-fade-up" style={{ animationDelay: "80ms" }}>
              Chat.<br />
              <span className="gradient-text">Connect.</span><br />
              Vibe.
            </h1>

            <p className="hero-sub animate-fade-up" style={{ animationDelay: "160ms" }}>
              A modern messaging & watch-party platform built for communities,
              teams, and friends who refuse to be boring.
            </p>

            <div className="hero-actions animate-fade-up" style={{ animationDelay: "240ms" }}>
              <NavLink to={user ? "/rooms" : "/signin"} className="btn-primary">
                {user ? "Explore Rooms" : "Sign in to join"}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </NavLink>
              <NavLink to="/about" className="btn-ghost">
                Learn more
              </NavLink>
            </div>

            <div className="social-proof animate-fade-up" style={{ animationDelay: "320ms" }}>
              <div className="avatars-stack">
                {["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626"].map((bg, i) => (
                  <div key={i} className="sp-avatar" style={{ background: bg, zIndex: 5 - i }}>
                    {["N", "J", "A", "R", "M"][i]}
                  </div>
                ))}
              </div>
              <p className="sp-text">
                <strong>2,800+</strong> members already online
              </p>
            </div>
          </div>

          {/* ── CARDS ── */}
          <div className="hero-right">
            <div className="cards-scene">
              {/* Card 1 – General */}
              <div className="glass-card card-1 animate-card" style={{ animationDelay: "100ms" }}>
                <div className="card-header">
                  <div className="channel-icon">💬</div>
                  <div className="notif-badge">12</div>
                </div>
                <div className="card-title"># general</div>
                <div className="card-sub">chatApp · 1,204 members</div>
                <div className="msg-preview">
                  <div className="msg-sender" style={{ color: "#a78bfa" }}>@nova</div>
                  <div className="msg-text">anyone tried the new voice rooms? they're actually so clean 🔥</div>
                </div>
                <div className="avatars-row">
                  {[["#7c3aed","N"],["#2563eb","J"],["#059669","A"],["#d97706","R"]].map(([bg,l],i) => (
                    <div key={i} className="mini-avatar" style={{ background: bg }}>{l}</div>
                  ))}
                  <div className="online-dot" />
                  <span className="members-label">84 online</span>
                </div>
                <div className="divider" />
                <div className="card-footer">
                  <div className="pill"><span className="status-dot" style={{ background: "#a78bfa" }} /> Active</div>
                  <span className="timestamp">just now</span>
                </div>
              </div>

              {/* Card 2 – Voice */}
              <div className="glass-card card-2 animate-card" style={{ animationDelay: "200ms" }}>
                <div className="card-header">
                  <div className="channel-icon">🎙️</div>
                  <div className="notif-badge green">Live</div>
                </div>
                <div className="card-title">Voice · lounge</div>
                <div className="card-sub">Stage channel · ongoing</div>
                <div className="msg-preview">
                  <div className="msg-sender" style={{ color: "#34d399" }}>Speaking now</div>
                  <div className="msg-text">@kai is sharing screen — "React 19 deep dive" talk</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "62%", background: "linear-gradient(90deg,#34d399,#059669)" }} />
                </div>
                <div className="progress-labels">
                  <span>37 min in</span><span>~60 min total</span>
                </div>
                <div className="divider" />
                <div className="card-footer">
                  <div className="pill"><span className="status-dot" style={{ background: "#34d399" }} /> 9 listening</div>
                  <span className="timestamp">Live</span>
                </div>
              </div>

              {/* Card 3 – Mentions */}
              <div className="glass-card card-3 animate-card" style={{ animationDelay: "300ms" }}>
                <div className="card-header">
                  <div className="channel-icon">🔔</div>
                  <div className="notif-badge red">3</div>
                </div>
                <div className="card-title">Mentions</div>
                <div className="card-sub">You were tagged · today</div>
                <div className="msg-preview">
                  <div className="msg-sender" style={{ color: "#f87171" }}>@marco in #dev-chat</div>
                  <div className="msg-text">hey @you can you review the PR before EOD?</div>
                </div>
                <div className="avatars-row">
                  {[["#dc2626","M"],["#7c3aed","S"],["#0891b2","T"]].map(([bg,l],i) => (
                    <div key={i} className="mini-avatar" style={{ background: bg, width: 20, height: 20, fontSize: 8 }}>{l}</div>
                  ))}
                  <span className="members-label">+2 more mentions</span>
                </div>
                <div className="divider" />
                <div className="card-footer">
                  <div className="pill"><span className="status-dot" style={{ background: "#f87171" }} /> Unread</div>
                  <span className="timestamp">2 hrs ago</span>
                </div>
              </div>

              {/* Card 4 – Server */}
              <div className="glass-card card-4 animate-card" style={{ animationDelay: "400ms" }}>
                <div className="card-header">
                  <div className="channel-icon">🛡️</div>
                  <div className="notif-badge amber">mod</div>
                </div>
                <div className="card-title">Your server</div>
                <div className="card-sub">chatApp HQ · owner</div>
                <div className="msg-preview">
                  <div className="msg-sender" style={{ color: "#fbbf24" }}>Server health</div>
                  <div className="msg-text">All systems normal · 0 flagged messages today</div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "88%", background: "linear-gradient(90deg,#f59e0b,#d97706)" }} />
                </div>
                <div className="progress-labels">
                  <span>2,841 members</span><span>88% retention</span>
                </div>
                <div className="divider" />
                <div className="card-footer">
                  <div className="pill"><span className="status-dot" style={{ background: "#fbbf24" }} /> Owner</div>
                  <span className="timestamp">thriving</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="section-inner">
          <p className="section-eyebrow">Why chatApp</p>
          <h2 className="section-title">Everything your community needs</h2>

          <div className="features-grid">
            {[
              { icon: "💬", color: "#7c3aed", title: "Text Rooms", desc: "Organised channels with threads, reactions, file sharing, and powerful search." },
              { icon: "🎙️", color: "#059669", title: "Voice & Stage", desc: "Crystal-clear voice rooms with screen sharing and live audience tools." },
              { icon: "🎬", color: "#d97706", title: "Watch Parties", desc: "Sync video playback with friends in real-time. React together, no spoilers." },
              { icon: "🛡️", color: "#dc2626", title: "Mod Tools", desc: "Auto-moderation, custom roles, permission levels and detailed audit logs." },
              { icon: "🔔", color: "#0891b2", title: "Smart Alerts", desc: "Granular notification controls so you only hear what actually matters." },
              { icon: "🌐", color: "#9333ea", title: "Global CDN", desc: "Low-latency delivery in 30+ regions. Fast wherever your community is." },
            ].map(({ icon, color, title, desc }, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: color + "22", color }}>{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="section-inner stats-inner">
          {[
            { value: "2.8K+", label: "Active users" },
            { value: "150+", label: "Public rooms" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<40ms", label: "Avg latency" },
          ].map(({ value, label }, i) => (
            <div key={i} className="stat-item">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-bg">
          <div className="cta-orb cta-orb-a" />
          <div className="cta-orb cta-orb-b" />
        </div>
        <div className="cta-content">
          <h2 className="cta-title">Ready to find your community?</h2>
          <p className="cta-sub">Jump into a room, start a server, or just lurk. No pressure.</p>
          <NavLink to={user ? "/rooms" : "/signin"} className="btn-primary btn-large">
            {user ? "Get started — it's free" : "Sign in to start"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </NavLink>
        </div>
      </section>
    </>
  );
}