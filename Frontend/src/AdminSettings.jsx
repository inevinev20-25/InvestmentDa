import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminSettings() {
  const admin = JSON.parse(localStorage.getItem("adminInfo"));
  const token = localStorage.getItem("adminToken");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(admin);
  }, []);

  const updatePassword = async () => {
    if (!password) return alert("Enter a new password");

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/admin/users/${admin.id}/reset-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password updated successfully");
      setPassword("");

    } catch (err) {
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="admin-settings-container">Loading...</div>;

  return (
    <div className="admin-settings-container">

      <h2 className="settings-title">Admin Settings</h2>

      {/* Profile Card */}
      <div className="settings-card">
        <h3>Admin Profile</h3>

        <div className="settings-info">
          <div className="settings-row">
            <span className="label">Name:</span>
            <span className="value">{profile.fullName}</span>
          </div>

          <div className="settings-row">
            <span className="label">Email:</span>
            <span className="value">{profile.email}</span>
          </div>

          <div className="settings-row">
            <span className="label">Role:</span>
            <span className="value">{profile.role}</span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="settings-card">
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="New Password"
          className="settings-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="settings-btn" onClick={updatePassword} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* CSS INSIDE SAME FILE */}
      <style jsx>{`
        .admin-settings-container {
          max-width: 700px;
          margin: 30px auto;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .settings-title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 25px;
          text-align: center;
          color: #222;
        }

        .settings-card {
          background: #ffffff;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          margin-bottom: 30px;
          border-left: 4px solid #3b82f6;
        }

        .settings-card h3 {
          font-size: 20px;
          margin-bottom: 20px;
          font-weight: 600;
          color: #333;
        }

        .settings-info {
          margin-top: 10px;
        }

        .settings-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .label {
          font-weight: 600;
          color: #555;
        }

        .value {
          font-weight: 500;
          color: #333;
        }

        .settings-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 15px;
          transition: 0.2s;
        }

        .settings-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
          outline: none;
        }

        .settings-btn {
          width: 100%;
          padding: 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .settings-btn:hover {
          background: #2563eb;
        }

        .settings-btn:disabled {
          background: #9bbdfd;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
