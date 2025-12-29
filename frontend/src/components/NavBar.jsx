import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand">
          UserManager
        </Link>

        {user && (
          <>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
          </>
        )}
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="user-badge">
              {user.fullName} ({user.role})
            </span>
            <button className="secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
