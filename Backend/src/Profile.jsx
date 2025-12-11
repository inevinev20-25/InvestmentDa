import React, { useState, useEffect } from "react";
import axios from "axios";
 
export default function Profile() {
  const token = localStorage.getItem("token");
 
  const [user, setUser] = useState(null);
 
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Profile Load Error:", err));
  }, [token]);
 
  const updatePassword = async () => {
    if (!currentPassword || !newPassword || !confirm)
      return alert("All password fields are required");
 
    if (newPassword !== confirm) return alert("New passwords do not match");
 
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      console.error(err);
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };
 
  if (!user)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
 
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm rounded-4 p-4 p-md-5">
            <h2 className="text-center fw-bold mb-4">My Profile</h2>
 
            {/* User Info */}
            <div className="mb-5">
              <h4 className="mb-3 fw-semibold border-bottom pb-2">Personal Information</h4>
              {[
                { label: "Name", value: user.fullName },
                { label: "Email", value: user.email },
                { label: "Phone", value: user.phone },
                { label: "Address", value: `${user.address1}${user.address2 ? ", " + user.address2 : ""}` },
                { label: "DOB", value: user.dob },
                { label: "Country", value: user.country },
              ].map((item) => (
                <div key={item.label} className="mb-3">
                  <label className="form-label fw-semibold">{item.label}</label>
                  <p className="bg-light p-2 rounded border">{item.value}</p>
                </div>
              ))}
            </div>
 
            {/* Change Password */}
            <div>
              <h4 className="mb-3 fw-semibold border-bottom pb-2">Change Password</h4>
 
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
 
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
 
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
 
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
 
 