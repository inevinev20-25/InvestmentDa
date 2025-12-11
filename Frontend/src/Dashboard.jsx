import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
 
 
import ChangePasswordModal from "./ChangePasswordModal";
import ActiveInvestments from "./ActiveInvestments";
 
export default function Dashboard() {
  const navigate = useNavigate();
 
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("passport");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
 
  const token = localStorage.getItem("token");
 
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMe();
    const interval = setInterval(fetchMe, 5000);
    return () => clearInterval(interval);
  }, []);
 
  const fetchMe = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return navigate("/login");
      setUser(data.user);
      fetchUserDocs(data.user._id);
    } catch (err) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
 
  const fetchUserDocs = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/documents/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (data.success) setDocs(data.docs || []);
    } catch {}
  };
 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose a file");
 
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", docType);
 
      const res = await fetch(
        "http://localhost:5000/api/documents/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) return alert("Upload failed");
      fetchUserDocs(user._id);
      setFile(null);
    } finally {
      setUploading(false);
    }
  };
 
  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }
 
  return (
    <div className="container-fluid py-4" style={{ background: "#f5f7fb" }}>
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Welcome back, {user.fullName}</h2>
          <p className="text-muted mb-0">Manage your investment profile.</p>
        </div>
 
        <span
          className={`badge px-3 py-2 mt-3 mt-md-0 ${
            user.kycStatus === "verified"
              ? "bg-success"
              : user.kycStatus === "pending"
              ? "bg-warning text-dark"
              : "bg-danger"
          }`}
          style={{ borderRadius: "50px" }}
        >
          KYC Status: {user.kycStatus}
        </span>
      </div>
 
      {/* GRID */}
      <div className="row g-4">
        {/* ACCOUNT OVERVIEW */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm h-100 rounded-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Account Overview</h5>
              <h4 className="fw-bold text-primary">
                A${(user.balance ?? 0).toFixed(2)}
              </h4>
              <p className="mb-1">Account Type: {user.accountType}</p>
              <p className="mb-0">Email: {user.email}</p>
            </div>
          </div>
        </div>
 
        {/* KYC DOCUMENTS */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm h-100 rounded-4">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">KYC Documents</h5>
 
              <form
                className="row g-2 align-items-end mb-4"
                onSubmit={handleUpload}
              >
                <div className="col-12 col-md-4">
                  <label className="form-label">Document Type</label>
                  <select
                    className="form-select"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="passport">Passport</option>
                    <option value="id_card">ID Card</option>
                    <option value="driver_license">Driver License</option>
                    <option value="other">Other</option>
                  </select>
                </div>
 
                <div className="col-12 col-md-5">
                  <label className="form-label">Upload File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
 
                <div className="col-12 col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
 
              {docs.length === 0 ? (
                <p className="text-muted">No documents uploaded yet.</p>
              ) : (
                docs.map((doc) => (
                  <div
                    key={doc._id}
                    className="d-flex justify-content-between align-items-center border-bottom py-2"
                  >
                    <div>
                      <strong className="me-2">{doc.type}</strong>
                      <small className="text-muted d-block">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </small>
                    </div>
 
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`badge ${
                          doc.status === "verified"
                            ? "bg-success"
                            : doc.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {doc.status}
                      </span>
                      <a
                        className="btn btn-outline-secondary btn-sm"
                        href={`http://localhost:5000/uploads/kyc/${doc.filename}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
 
        {/* ACTIVE INVESTMENTS */}
        <div className="col-12">
          <ActiveInvestments />
        </div>
      </div>
 
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}