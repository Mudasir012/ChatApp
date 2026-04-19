import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProfileSetup from "./pages/ProfileSetup";
import { fetchMe, signOut, getStoredUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(Boolean(getStoredUser()));

  useEffect(() => {
    if (!user) return;

    fetchMe()
      .then((freshUser) => setUser(freshUser))
      .catch(() => {
        signOut();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <div className="page-content">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={() => { signOut(); setUser(null); }} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/rooms"
            element={user ? <Rooms user={user} /> : <Navigate to="/signin" replace />}
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/signin"
            element={<SignIn onAuth={setUser} />}
          />
          <Route
            path="/signup"
            element={<SignUp onAuth={setUser} />}
          />
          <Route
            path="/profile-setup"
            element={user ? <ProfileSetup user={user} onUpdate={setUser} /> : <Navigate to="/signin" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
