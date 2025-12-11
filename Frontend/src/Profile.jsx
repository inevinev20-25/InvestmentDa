import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./config";

export default function Profile() {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error("Profile Load Error:", err);
        window.location.href = "/login";
      });
  }, [token]);

  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirm)
      return alert("All password fields are required");

    if (newPassword !== confirm)
      return alert("New passwords do not match");

    try {
      setLoading(true);

      await axios.post(
        `${API_BASE_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" />
      </div>
    );

  // Format DOB safely
  const formattedDOB = user.dob
    ? new Date(user.dob).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm rounded-4 p-4 p-md-5">

            <h2 className="text-center fw-bold mb-4">My Profile</h2>

            {/* USER INFO */}
            <div className="mb-5">
              <h4 className="mb-3 fw-semibold border-bottom pb-2">Personal Information</h4>

              {[
                { label: "Name", value: user.fullName || "N/A" },
                { label: "Email", value: user.email || "N/A" },
                { label: "Phone", value: user.phone || "N/A" },
                {
                  label: "Address",
                  value: `${user.address1 || ""} ${
                    user.address2 ? ", " + user.address2 : ""
                  }`.trim() || "N/A",
                },
                { label: "DOB", value: formattedDOB },
                { label: "Country", value: user.country || "N/A" },
              ].map((item) => (
                <div key={item.label} className="mb-3">
                  <label className="form-label fw-semibold">{item.label}</label>
                  <p className="bg-light p-2 rounded border">{item.value}</p>
                </div>
              ))}
            </div>

            {/* CHANGE PASSWORD */}
            <div>
              <h4 className="mb-3 fw-semibold border-bottom pb-2">Change Password</h4>

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                className="form-control mb-4"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <button
                className="btn btn-primary w-100 rounded-pill"
                onClick={updatePassword}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
