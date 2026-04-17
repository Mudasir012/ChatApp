import { NavLink } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-mark">C</div>
        <div className="app-name">
          <h1>ChatApp</h1>
          <p>Live rooms & watch parties</p>
        </div>
      </div>
      <nav className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/rooms"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Rooms
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          About
        </NavLink>
      </nav>
      <div className="sign-options">
        <button>Sign In</button>
        <button>Sign Up</button>
      </div>
    </header>
  );
}
