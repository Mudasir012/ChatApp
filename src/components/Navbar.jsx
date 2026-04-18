import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-mark">
            <span>C</span>
          </div>
          <div className="brand-text">
            <span className="brand-name">ChatApp</span>
            <span className="brand-tagline">Live rooms & watch parties</span>
          </div>
        </NavLink>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <span className="nav-link-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            Home
          </NavLink>
          {user && (
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={closeMenu}
            >
              <span className="nav-link-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Rooms
            </NavLink>
          )}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <span className="nav-link-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            About
          </NavLink>

          <div className="nav-auth-mobile">
            {!user ? (
              <>
                <Link className="btn-signin" to="/signin" onClick={closeMenu}>Sign In</Link>
                <Link className="btn-signup" to="/signup" onClick={closeMenu}>Sign Up</Link>
              </>
            ) : (
              <button className="btn-signup" onClick={() => { onLogout(); closeMenu(); }}>
                Logout
              </button>
            )}
          </div>
        </nav>

        <div className="nav-auth">
          {!user ? (
            <> 
              <Link className="btn-signin" to="/signin">Sign In</Link>
              <Link className="btn-signup" to="/signup">
                Sign Up
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </>
          ) : (
            <div className="nav-logged-in">
              <span className="nav-username">{user.name || user.username}</span>
              <button className="btn-signup" onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>

        <button
          className={`hamburger ${menuOpen ? "hamburger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}
    </header>
  );
}
