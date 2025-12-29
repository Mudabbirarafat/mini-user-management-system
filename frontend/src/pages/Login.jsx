import React, { useState } from "react";
import api, { setToken } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      // store token
      localStorage.setItem("token", token);
      setToken(token);

      // fetch user profile to determine redirect
      try {
        const userRes = await api.get("/users/me");
        localStorage.setItem("user", JSON.stringify(userRes.data));
        if (userRes.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } catch (err) {
        // fallback if profile fetch fails
        navigate("/profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto" }}>
      <h2>Login</h2>

      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ marginTop: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: 10 }}>
        Don&apos;t have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
}
