import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  return (
    <>
      <h2>User Management</h2>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>KYC</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="center-text">
                  No users found
                </td>
              </tr>
            )}

            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`kyc-badge ${u.kycStatus}`}>
                    {u.kycStatus}
                  </span>
                </td>
                <td>A${u.balance.toFixed(2)}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/users/${u._id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
