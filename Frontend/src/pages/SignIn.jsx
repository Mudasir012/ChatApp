import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../utils/auth";
import "./Auth.css";

export default function SignIn({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await signIn({ email, password });
      onAuth(user);
      navigate(user.name || user.description ? "/rooms" : "/profile-setup", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h1>Sign In</h1>
      <p>Access your ChatApp account and continue your rooms.</p>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </label>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <div className="auth-footer">
        New here? <Link to="/signup">Create an account</Link>
      </div>
    </section>
  );
}
