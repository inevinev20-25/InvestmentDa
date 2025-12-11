import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UserDetails.css";

import {
  FiEdit,
  FiTrash2,
  FiKey,
  FiX,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [amount, setAmount] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const [editForm, setEditForm] = useState({
    title: "",
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    accountType: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await res.json();

      setUser(data.user);
      setDocs(data.documents || []);

      setEditForm({
        title: data.user.title || "",
        fullName: data.user.fullName || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        dob: data.user.dob || "",
        address1: data.user.address1 || "",
        address2: data.user.address2 || "",
        city: data.user.city || "",
        state: data.user.state || "",
        postalCode: data.user.postalCode || "",
        country: data.user.country || "",
        accountType: data.user.accountType || "",
      });

    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  const updateKyc = async (docId, action) => {
    try {
      const url =
        action === "approved"
          ? `http://localhost:5000/api/documents/verify/${docId}`
          : `http://localhost:5000/api/documents/reject/${docId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await res.json();
      if (data.success) fetchUser();
    } catch (err) {
      console.error("KYC update error:", err);
    }
  };

  const updateBalance = async (type) => {
    if (!amount || amount <= 0) return alert("Enter valid amount");

    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}/balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount), type }),
      });

      setAmount("");
      fetchUser();
    } catch {
      alert("Balance update failed");
    }
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success) {
        setShowEdit(false);
        fetchUser();
      }
    } catch {
      alert("Failed to update user");
    }
  };

  const resetPassword = async () => {
    if (newPassword.length < 6) return alert("Password too short!");

    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      setShowPassword(false);
      setNewPassword("");
    } catch {
      alert("Error resetting password");
    }
  };

  const deleteUser = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const data = await res.json();
      if (data.success) navigate("/admin/users");
    } catch {
      alert("Delete failed");
    }
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="admin-main-page">

      <h2>User Details</h2>

      <p className="back-link" onClick={() => navigate("/admin/users")}>
        Back to Users
      </p>

      {/* USER INFO CARD */}
      <div className="user-card">
        <div className="user-card-header">
          <h3>User Info</h3>

          <div className="actions">
            <FiEdit className="icon-btn" onClick={() => setShowEdit(true)} />
            <FiKey className="icon-btn" onClick={() => setShowPassword(true)} />
            <FiTrash2 className="icon-btn delete" onClick={() => setShowDelete(true)} />
          </div>
        </div>

        <p><strong>Title:</strong> {user.title}</p>
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>DOB:</strong> {user.dob}</p>
        <p><strong>Address1:</strong> {user.address1}</p>
        <p><strong>Address2:</strong> {user.address2}</p>
        <p><strong>City:</strong> {user.city}</p>
        <p><strong>State:</strong> {user.state}</p>
        <p><strong>Postal Code:</strong> {user.postalCode}</p>
        <p><strong>Country:</strong> {user.country}</p>
        <p><strong>Account Type:</strong> {user.accountType}</p>
        <p><strong>Balance:</strong> A${user.balance}</p>
        <p><strong>KYC Status:</strong> {user.kycStatus}</p>
      </div>

      {/* BALANCE MANAGEMENT */}
      <div className="balance-card">
        <h3>Balance Management</h3>

        <input
          type="number"
          placeholder="Enter amount"
          className="balance-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="balance-buttons">
          <button className="add-btn" onClick={() => updateBalance("add")}>
            Add
          </button>
          <button className="subtract-btn" onClick={() => updateBalance("subtract")}>
            Subtract
          </button>
        </div>
      </div>

      {/* KYC DOCUMENTS */}
      <div className="kyc-section">
        <h3>KYC Documents</h3>

        {docs.length === 0 && <p>No documents uploaded.</p>}

        {docs.map((doc) => (
          <div className="kyc-item" key={doc._id}>
            <div>
              <strong>{doc.type}</strong>
              <div className="kyc-status">{doc.status}</div>
            </div>

            <div className="kyc-actions">
              <a
                className="kyc-view-link"
                href={`http://localhost:5000/uploads/kyc/${doc.filename}`}
                target="_blank"
              >
                View
              </a>

              {doc.status === "pending" && (
                <>
                  <FiCheckCircle
                    className="approve-btn"
                    onClick={() => updateKyc(doc._id, "approved")}
                  />
                  <FiXCircle
                    className="reject-btn"
                    onClick={() => updateKyc(doc._id, "rejected")}
                  />
                </>
              )}

              {doc.status === "verified" && (
                <span className="badge badge-verified">Verified</span>
              )}

              {doc.status === "rejected" && (
                <span className="badge badge-rejected">Rejected</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ===================== MODALS ===================== */}

      {showEdit && (
        <div className="modal">
          <div className="modal-content">
            <FiX className="modal-close" onClick={() => setShowEdit(false)} />
            <h3>Edit User</h3>

            {Object.keys(editForm).map((field) => (
              <div className="input-group" key={field}>
                <label>{field}</label>
                <input
                  value={editForm[field]}
                  onChange={(e) =>
                    setEditForm({ ...editForm, [field]: e.target.value })
                  }
                />
              </div>
            ))}

            <button className="save-btn" onClick={saveEdit}>Save</button>
          </div>
        </div>
      )}

      {showPassword && (
        <div className="modal">
          <div className="modal-content">
            <FiX className="modal-close" onClick={() => setShowPassword(false)} />
            <h3>Reset Password</h3>

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button className="save-btn" onClick={resetPassword}>
              Reset
            </button>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="modal">
          <div className="modal-content">
            <FiX className="modal-close" onClick={() => setShowDelete(false)} />
            <h3>Delete User?</h3>
            <p>This action cannot be undone.</p>

            <button className="delete-btn" onClick={deleteUser}>
              Delete Permanently
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
