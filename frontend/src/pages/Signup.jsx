import React, { useState } from "react";
import api, { setToken } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isStrongPassword(pw) {
    return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password || !confirm) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain a number"
      );
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        fullName,
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);

      navigate("/profile");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Signup</h2>

      <form onSubmit={submit}>
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
