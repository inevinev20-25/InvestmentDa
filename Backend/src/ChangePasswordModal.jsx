import React, { useState } from "react";
import { FiX } from "react-icons/fi";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirm)
      return alert("All fields required");

    if (newPassword !== confirm)
      return alert("New passwords do not match");

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update password");
        return;
      }

      alert("Password updated!");
      onClose();

    } catch (err) {
      alert("Error updating password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <FiX className="modal-close" onClick={onClose} />

        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button className="save-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
