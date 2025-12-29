import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load(p = page) {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/admin/users?page=${p}&limit=10`);
      setUsers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(page);
  }, [page]);

  async function toggle(userId, action) {
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/admin/users/${userId}/${action}`);
      load(page);
    } catch {
      alert("Action failed");
    }
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Admin Dashboard</h2>

      <table width="100%" border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Email</th>
            <th>Full name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.fullName}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                {u.status === "active" ? (
                  <button onClick={() => toggle(u._id, "deactivate")}>
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => toggle(u._id, "activate")}>
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span style={{ margin: "0 8px" }}>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
