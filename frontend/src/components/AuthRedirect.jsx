import { Navigate } from "react-router-dom";

export default function AuthRedirect({ children }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (token && user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/profile"}
        replace
      />
    );
  }

  return children;
}
