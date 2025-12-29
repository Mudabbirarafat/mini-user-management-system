import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
        setFullName(res.data.fullName);
        setEmail(res.data.email);
      } catch (err) {
        setError("Failed to load profile");
      }
    }
    load();
  }, []);

  async function saveProfile() {
    setError(null);
    setMessage(null);

    if (!fullName || !email) {
      setError("Full name and email are required");
      return;
    }

    try {
      await api.put("/users/me", { fullName, email });
      setMessage("Profile updated successfully");
      const updated = { ...user, fullName, email };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    }
  }

  function cancelEdit() {
    setFullName(user.fullName);
    setEmail(user.email);
    setMessage(null);
    setError(null);
  }

  async function changePassword() {
    setError(null);
    setMessage(null);

    if (!currentPassword || !newPassword) {
      setError("Both password fields are required");
      return;
    }

    try {
      await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto" }}>
      <h2>Profile</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}

      <h3>Edit Profile</h3>
      <div>
        <label>Full name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

      <div>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button onClick={saveProfile}>Save</button>
      <button onClick={cancelEdit} style={{ marginLeft: 10 }}>
        Cancel
      </button>

      <hr />

      <h3>Change Password</h3>
      <div>
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button onClick={changePassword}>Change Password</button>
    </div>
  );
}
