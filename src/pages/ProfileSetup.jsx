import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../utils/auth";
import "./Auth.css";

export default function ProfileSetup({ user, onUpdate }) {
  const [name, setName] = useState(user?.name || "");
  const [description, setDescription] = useState(user?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const readFileAsDataUri = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { name, description };
      if (imageFile) {
        payload.image = await readFileAsDataUri(imageFile);
      }

      const updatedUser = await updateProfile(payload);
      onUpdate(updatedUser);
      navigate("/rooms", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h1>Complete your profile</h1>
      <p>Set a display name, profile picture, and a short bio.</p>
      {error && <div className="alert">{error}</div>}
      {preview && <img src={preview} alt="Profile preview" className="profile-preview" />}
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Ali Khan"
          />
        </label>

        <label>
          Short bio
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell other users what you do"
          />
        </label>

        <label>
          Profile picture
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <button className="btn-primary" disabled={loading}>
          {loading ? "Saving profile…" : "Save and continue"}
        </button>
      </form>
    </section>
  );
}
